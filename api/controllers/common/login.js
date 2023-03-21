const {authenticator} = require('otplib');

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

        const foundOTP = await sails.models.otp.findOne({user: foundUser.id, isEnabled: true}).decrypt();

        if (foundOTP) {
            const backupTokens = JSON.parse(foundOTP.backupTokens);

            if (!inputs.otp || !inputs.otp.length) {
                return exits.badRequest('Invalid One-Time Password.');
            }

            // If it's 6 characters long, verify it's a valid OTP.
            if (inputs.otp.length === 6) {
                if (!authenticator.verify({token: inputs.otp, secret: foundOTP.secret})) {
                    return exits.badRequest('Invalid One-Time Password.');
                }
            }
            // If it's 8 characters long, check if it's a valid backup token.
            else if (inputs.otp.length === 8 && backupTokens.length) {
                let foundIt = false;

                for (let i = 0; i < backupTokens.length; ++i) {
                    if (inputs.otp === backupTokens[i]) {
                        foundIt = true;
                        delete backupTokens[i];

                        await sails.models.otp.update({id: foundOTP.id}).set({backupTokens: JSON.stringify(backupTokens)});

                        break;
                    }
                }

                if (!foundIt) {
                    return exits.badRequest('Invalid One-Time Password.');
                }
            } else {
                return exits.badRequest('Invalid One-Time Password.');
            }
        } else if (inputs.otp && inputs.otp.length) {
            // OTP is not enabled, but one was supplied to the request.
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
            user: _.merge(foundUser, {_isOTPEnabled: (!!foundOTP)}),
            _csrf: csrf.token
        });
    }
};
