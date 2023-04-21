const {authenticator} = require('otplib');
const qrcode = require('qrcode');

module.exports = {
    friendlyName: 'Enable 2-Factor Authentication',

    description: 'Enable 2FA (2-Factor Authentication) for the current user.',

    inputs: {},

    exits: {
        ok: {
            responseType: 'ok'
        },
        badRequest: {
            responseType: 'badRequest'
        }
    },

    fn: async (inputs, exits, env) => {
        const secret = authenticator.generateSecret();
        const image = await qrcode.toDataURL(authenticator.keyuri(env.req.session.user.email, sails.config.appName, secret));

        const foundOTP = await sails.models.otp.findOne({user: env.req.session.user.id});

        if (foundOTP) {
            if (foundOTP.isEnabled) {
                return exits.badRequest('OTP is already enabled.');
            }

            await sails.models.otp.update(foundOTP.id).set({secret});

            return exits.ok({secret, image});
        }

        await sails.models.otp.create({
            id: 'c', // required, auto-generated
            user: env.req.session.user.id,
            secret: secret
        });

        return exits.ok({secret, image});
    }
};
