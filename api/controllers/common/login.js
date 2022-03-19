module.exports = {
    friendlyName: 'User Login',

    description: 'Basic authentication for users.',

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
            return exits.badRequest('Already logged in.');
        }

        const badEmailPass = 'Bad email / password combination.';
        const foundUser = await sails.models.user.findOne({email: inputs.email, deletedAt: null});

        if (!foundUser) {
            return exits.badRequest(badEmailPass);
        }

        if (!await sails.models.user.doPasswordsMatch(inputs.password, foundUser.password)) {
            return exits.badRequest(badEmailPass);
        }

        const csrf = sails.helpers.generateCsrfTokenAndSecret();
        const newSession = await sails.models.session.create({
            id: 'c', // required, auto-generated
            user: foundUser.id,
            data: {
                user: {
                    id: foundUser.id,
                    firstName: foundUser.firstName,
                    lastName: foundUser.lastName,
                    email: foundUser.email,
                    role: foundUser.role
                },
                _csrfSecret: csrf.secret
            }
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
            user: foundUser,
            _csrf: csrf.token
        });
    }
};
