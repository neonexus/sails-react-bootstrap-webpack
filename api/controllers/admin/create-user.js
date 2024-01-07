module.exports = {
    friendlyName: 'Create User',

    description: 'Create a new user.',

    inputs: {
        firstName: {
            type: 'string',
            required: true,
            maxLength: 70
        },

        lastName: {
            type: 'string',
            required: true,
            maxLength: 70
        },

        password: {
            type: 'string',
            maxLength: 70
        },

        email: {
            type: 'string',
            isEmail: true,
            required: true,
            maxLength: 191 // Max size of an utf8mb4 varchar in MySQL.
        },

        role: {
            type: 'string',
            defaultsTo: 'user',
            isIn: [
                'user',
                'admin'
            ]
        },

        generatePassword: {
            type: 'boolean',
            defaultsTo: false,
            description: 'Used to auto-generate a password for the user'
        }
    },

    exits: {
        created: {
            responseType: 'created'
        },
        badRequest: {
            responseType: 'badRequest'
        },
        serverError: {
            responseType: 'serverError'
        }
    },

    fn: async (inputs, exits, env) => {
        let password = inputs.password;
        let isPasswordValid;

        if (!inputs.generatePassword) {
            isPasswordValid = await sails.helpers.isPasswordValid.with({
                password: inputs.password,
                user: {firstName: inputs.firstName, lastName: inputs.lastName, email: inputs.email}
            });
        } else {
            isPasswordValid = true;
            password = sails.helpers.generateToken().substring(0, 42);

            // should probably send password somehow; it will be scrubbed in the response (would be hashed anyway...)
        }

        if (isPasswordValid !== true) {
            return exits.badRequest(isPasswordValid);
        }

        const foundUser = await sails.models.user.findOne({email: inputs.email, deletedAt: null});

        if (foundUser) {
            return exits.badRequest('Email is already in-use.');
        }

        sails.models.user.create({
            id: 'c', // required, but auto-generated
            firstName: inputs.firstName,
            lastName: inputs.lastName,
            password,
            role: inputs.role,
            email: inputs.email,
            createdBy: env.req.session.user.id
        }).fetch().exec((err, user) => {
            /* istanbul ignore if */
            if (err) {
                console.error(err);

                return exits.serverError(err);
            }

            /**
             * TODO: We should probably email the new user their new account info here if the password was generated (inputs.generatePassword)...
             */

            return exits.created({user});
        });
    }
};
