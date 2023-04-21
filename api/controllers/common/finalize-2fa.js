const {authenticator} = require('otplib');

module.exports = {
    friendlyName: 'Finalize 2FA',

    description: 'Fully enable the 2FA for the current user.',

    inputs: {
        password: {
            type: 'string',
            required: true
        },

        otp: {
            type: 'string',
            maxLength: 6,
            minLength: 6,
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
        const foundUser = await sails.models.user.findOne(env.req.session.user.id);

        if (!sails.models.user.doPasswordsMatch(inputs.password, foundUser.password)) {
            return exits.badRequest('Password is invalid.');
        }

        const foundOTP = await sails.models.otp.findOne({user: env.req.session.user.id}).decrypt();

        if (!foundOTP) {
            return exits.badRequest('OTP has NOT been enabled.');
        }

        if (foundOTP.isEnabled) {
            return exits.badRequest('OTP is already enabled.');
        }

        if (!authenticator.verify({token: inputs.otp, secret: foundOTP.secret})) {
            return exits.badRequest('OTP is invalid.');
        }

        const backupTokens = sails.helpers.generateBackupTokens();

        await sails.models.otp.update(foundOTP.id).set({isEnabled: true, backupTokens: JSON.stringify(backupTokens)});

        return exits.ok({backupTokens});
    }
};
