const {authenticator} = require('otplib');

/**
 * Verify and Spend an OTP or Backup Token
 *
 * @function sails.helpers.verifyAndSpendOtp
 * @param {String} userID The UUIDv4 of the user to verify.
 * @param {String} otp The OTP or backup token to spend.
 *
 * @returns {Boolean|String} `true` if valid OTP; `false` if OTP is not enabled; a string if invalid.
 */
module.exports = {
    friendlyName: 'Verify and Spend an OTP or Backup Token',

    description: 'Verify and spend a 2FA OTP, or backup token, for current user.',

    inputs: {
        userID: {
            type: 'string',
            maxLength: 36,
            required: true
        },
        otp: {
            type: 'string',
            minLength: 6,
            maxLength: 8,
            required: false // Can't be required, because not every user is using 2FA.
        }
    },

    exits: {},

    fn: async (inputs, exits) => {
        const foundOTP = await sails.models.otp.findOne({user: inputs.userID, isEnabled: true}).decrypt();

        if (foundOTP) {
            const backupTokens = JSON.parse(foundOTP.backupTokens);

            if (!inputs.otp || !inputs.otp.length) {
                return exits.success('Invalid OTP');
            }

            // If it's 6 characters long, verify it's a valid OTP.
            if (inputs.otp.length === 6) {
                if (!authenticator.verify({token: inputs.otp, secret: foundOTP.secret})) {
                    return exits.success('Invalid OTP');
                }
            }
            // If it's 8 characters long, check if it's a valid backup token.
            else if (inputs.otp.length === 8 && backupTokens.length) {
                let foundIt = false;

                for (let i = 0; i < backupTokens.length; ++i) {
                    if (inputs.otp === backupTokens[i]) {
                        foundIt = true;
                        delete backupTokens[i];

                        await sails.models.otp.update({id: foundOTP.id}).set({backupTokens: JSON.stringify(backupTokens)});

                        break;
                    }
                }

                if (!foundIt) {
                    return exits.success('Invalid OTP');
                }
            } else {
                return exits.success('Invalid OTP');
            }
        } else if (inputs.otp && inputs.otp.length) {
            // OTP is not enabled, but one was supplied to the request.
            return exits.success('Invalid OTP');
        } else {
            // OTP is not enabled.
            return exits.success(false);
        }

        // Valid OTP / backup code.
        return exits.success(true);
    }
};
