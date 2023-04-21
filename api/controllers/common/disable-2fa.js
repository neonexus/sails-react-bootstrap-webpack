module.exports = {
    friendlyName: 'Disable 2-Factor Authentication',

    description: 'Disable 2-factor authentication for the current user.',

    inputs: {
        password: {
            type: 'string',
            required: true
        },

        otp: {
            type: 'string',
            minLength: 6,
            maxLength: 8,
            allowNull: false,
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

        const isValidOTP = await sails.helpers.verifyAndSpendOtp(env.req.session.user.id, inputs.otp);

        if (typeof isValidOTP === 'string') {
            return exits.badRequest('Invalid one-time password / backup code.');
        }

        // Should not happen... But might
        if (!isValidOTP) {
            return exits.badRequest('2-factor authentication is not enabled.');
        }

        const foundOTP = await sails.models.otp.findOne({user: env.req.session.user.id, isEnabled: true});

        await sails.models.otp.update(foundOTP.id).set({isEnabled: false});

        return exits.ok();
    }
};
