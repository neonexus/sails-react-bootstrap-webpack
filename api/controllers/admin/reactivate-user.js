module.exports = {
    friendlyName: 'Reactivate User',

    description: 'Reactivate a soft-deleted user.',

    inputs: {
        id: {
            type: 'string',
            required: true,
            isUUID: true
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
        const foundUser = await sails.models.user.findOne({id: inputs.id});

        if (!foundUser) {
            return exits.badRequest('There is no user with that ID.');
        }

        if (!foundUser.deletedAt) {
            return exits.badRequest('User is already active.');
        }

        const activeUser = await sails.models.user.findOne({email: foundUser.email, deletedAt: null});

        if (activeUser) {
            return exits.badRequest('There is already an active user with the email address ' + activeUser.email);
        }

        await sails.models.user.update({id: inputs.id}).set({deletedAt: null});

        return exits.ok();
    }
};
