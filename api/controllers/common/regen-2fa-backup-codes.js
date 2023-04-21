module.exports = {
    friendlyName: 'Regenerate 2FA Backup Codes',

    description: 'Regenerate 2FA backup codes for the current user.',

    inputs: {
        password: {
            type: 'string',
            required: true
        },

        otp: {
            type: 'string',
            minLength: 6,
            maxLength: 8,
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
        const foundOTP = await sails.models.otp.findOne({user: env.req.session.user.id, isEnabled: true}).decrypt();

        if (!foundOTP) {
            return exits.badRequest('2FA has not been enabled.');
        }

        const backupTokens = sails.helpers.generateBackupTokens();

        await sails.models.otp.update(foundOTP.id).set({backupTokens: JSON.stringify(backupTokens)});

        return exits.ok({backupTokens});
    }
};
