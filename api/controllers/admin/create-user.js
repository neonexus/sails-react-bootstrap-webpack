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
            maxLength: 191
        },

        role: {
            type: 'string',
            defaultsTo: 'user',
            isIn: [
                'user',
                'admin'
            ]
        },

        setPassword: {
            type: 'boolean',
            defaultsTo: true
        }
    },

    exits: {
        ok: {
            responseType: 'created'
        },
        badRequest: {
            responseType: 'badRequest'
        },
        serverError: {
            responseType: 'serverError'
        }
    },

    fn: async (inputs, exits) => {
        let password = inputs.password;
        let isPasswordValid;

        if (inputs.setPassword) {
            isPasswordValid = sails.helpers.isPasswordValid.with({
                password: inputs.password,
                user: {firstName: inputs.firstName, lastName: inputs.lastName, email: inputs.email}
            });
        } else {
            isPasswordValid = true;
            password = sails.helpers.generateToken();
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
            email: inputs.email
        }).meta({fetch: true}).exec((err, newUser) => {
            if (err) {
                console.error(err);

                return exits.serverError(err);
            }

            /**
             * We should probably email the new user their new account info here if the password was generated (!inputs.setPassword)...
             */

            return exits.ok({user: newUser});
        });
    }
};
