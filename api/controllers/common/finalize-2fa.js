const {authenticator} = require('otplib');

module.exports = {
    friendlyName: 'Finalize 2FA',

    description: 'Fully enable the 2FA for the current user.',

    inputs: {
        otp: {
            type: 'string',
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

        const token = sails.helpers.generateToken();
        const backupTokens = [];

        for (let i = 0; i < 10; ++i) {
            backupTokens[i] = token.substring(i * 8, (i * 8) + 8);
        }

        await sails.models.otp.update(foundOTP.id).set({isEnabled: true, backupTokens: JSON.stringify(backupTokens)});

        return exits.ok({backupTokens});
    }
};
