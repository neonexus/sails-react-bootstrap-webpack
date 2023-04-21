module.exports = {
    friendlyName: 'User Login',

    description: 'Basic authentication for users, now with OTPs!',

    inputs: {
        email: {
            type: 'string',
            required: true,
            isEmail: true,
            maxLength: 191 // max length of UTF8-MB4 varchar
        },

        password: {
            type: 'string',
            required: true,
            maxLength: 70
        },

        otp: {
            type: 'string', // can't be a number, because it may start with a zero
            required: false, // not required for every user
            minLength: 6,
            maxLength: 8,
            allowNull: true
        }
    },

    exits: {
        ok: {
            responseType: 'ok'
        },
        badRequest: {
            responseType: 'badRequest'
        },
        serverError: {
            responseType: 'serverError'
        }
    },

    fn: async (inputs, exits, env) => {
        if (env.req.signedCookies[sails.config.session.name]) {
            const foundSession = await sails.models.session.findOne({id: env.req.signedCookies[sails.config.session.name]});

            if (foundSession) {
                return exits.badRequest('Already logged in.');
            }
        }

        const badEmailPass = 'Bad email / password combination.';

        const foundUser = await sails.models.user.findOne({email: inputs.email, deletedAt: null});

        /* istanbul ignore if */
        if (!foundUser) {
            return exits.badRequest(badEmailPass);
        }

        /* istanbul ignore if */
        if (!await sails.models.user.doPasswordsMatch(inputs.password, foundUser.password)) {
            return exits.badRequest(badEmailPass);
        }

        // Returns a string if invalid, false if OTP is disabled, true if OTP enabled and valid.
        const isValidOTP = await sails.helpers.verifyAndSpendOtp(foundUser.id, inputs.otp);

        if (typeof isValidOTP === 'string') {
            return exits.badRequest('Invalid One-Time Password.');
        }

        const csrf = sails.helpers.generateCsrfTokenAndSecret();
        const newSession = await sails.models.session.create({
            id: 'c', // required, auto-generated
            user: foundUser.id,
            data: {}, // Used to store things that are temporary, or only apply to this session.
            csrfSecret: csrf.secret
        }).fetch();

        return exits.ok({
            // Cookies are automatically handled in our custom response `ok`.
            cookies: [
                {
                    name: sails.config.session.name,
                    value: newSession.id,
                    isSession: true
                }
            ],
            user: _.merge(foundUser, {_isOTPEnabled: (isValidOTP)}),
            _csrf: csrf.token
        });
    }
};
