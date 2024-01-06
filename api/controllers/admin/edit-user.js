module.exports = {
    friendlyName: 'Edit User',

    description: 'Edit an active user.',

    inputs: {
        id: {
            type: 'string',
            required: true,
            isUUID: true
        },

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
            defaultsTo: false
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

    fn: async (inputs, exits) => {
        let isPasswordValid = true;
        const foundUser = await sails.models.user.findOne({id: inputs.id});

        if (!foundUser) {
            return exits.badRequest('There is no user with that ID.');
        }

        if (foundUser.deletedAt !== null) {
            return exits.badRequest('This user has been deleted, and can not be edited until reactivated.');
        }

        if (inputs.setPassword) {
            isPasswordValid = await sails.helpers.isPasswordValid.with({
                password: inputs.password,
                user: {firstName: inputs.firstName, lastName: inputs.lastName, email: inputs.email}
            });
        }

        if (isPasswordValid !== true) {
            return exits.badRequest(isPasswordValid);
        }

        let updatedUser = {
            firstName: inputs.firstName,
            lastName: inputs.lastName,
            role: inputs.role,
            email: inputs.email
        };

        if (inputs.setPassword) {
            updatedUser.password = inputs.password;
        }

        const user = await sails.models.user.updateOne({id: inputs.id}).set(updatedUser);

        return exits.ok({user});
    }
};
