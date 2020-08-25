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
            required: true,
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
            defaultsTo: 'user'
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
        const isPasswordValid = sails.helpers.isPasswordValid.with({
            password: inputs.password,
            user: {firstName: inputs.firstName, lastName: inputs.lastName, email: inputs.email}
        });

        if (isPasswordValid !== true) {
            return exits.badRequest(isPasswordValid);
        }

        const foundUser = await User.findOne({email: inputs.email, deletedAt: null});

        if (foundUser) {
            return exits.badRequest('Email is already in-use.');
        }

        User.create({
            id: 'c', // required, but auto-generated
            firstName: inputs.firstName,
            lastName: inputs.lastName,
            password: inputs.password,
            role: inputs.role,
            email: inputs.email
        }).meta({fetch: true}).exec((err, newUser) => {
            if (err) {
                console.error(err);

                return exits.serverError(err);
            }

            return exits.ok({user: newUser});
        });
    }
};
