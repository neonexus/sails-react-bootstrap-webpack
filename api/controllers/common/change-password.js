module.exports = {
    friendlyName: 'Change Password',

    description: 'Change password of currently logged-in user.',

    inputs: {
        currentPassword: {
            type: 'string',
            maxLength: 70,
            required: true
        },

        newPassword: {
            type: 'string',
            maxLength: 70,
            required: true
        },

        confirmPassword: {
            type: 'string',
            maxLength: 70,
            required: true
        }
    },

    exits: {
        ok: {
            responseType: 'ok'
        },
        badRequest: {
            responseType: 'badRequest'
        }
    },

    fn: async (inputs, exits, env) => {
        if (inputs.newPassword !== inputs.confirmPassword) {
            return exits.badRequest('New passwords do not match.');
        }

        if (inputs.currentPassword === inputs.newPassword) {
            return exits.badRequest('New password can\'t be the same as the old password.');
        }

        const foundUser = await sails.models.user.findOne({id: env.req.session.user.id});

        /* istanbul ignore if */
        if (!foundUser) {
            console.error('Could NOT find user while changing password!');

            return exits.serverError('Unknown error occurred. Please contact support.');
        }

        if (!await sails.models.user.doPasswordsMatch(inputs.currentPassword, foundUser.password)) {
            return exits.badRequest('Current password is incorrect.');
        }

        const isPasswordValid = await sails.helpers.isPasswordValid(inputs.newPassword, false, foundUser);

        if (isPasswordValid !== true) {
            return exits.badRequest(isPasswordValid);
        }

        await sails.models.user.update({id: env.req.session.user.id}).set({password: inputs.newPassword});

        return exits.ok();
    }
};
