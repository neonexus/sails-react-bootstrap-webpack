const Tokens = require('csrf');

/**
 * Generate CSRF Token and Secret
 *
 * @function sails.helpers.generateCsrfTokenAndSecret
 * @param {Number} [saltLength=8] The salt length to use (characters, not bytes). Minimum and default are 8 characters.
 * @param {Number} [secretLength=18] The secret length to generate (bytes, not characters). Minimum and default are 18 bytes.
 *
 * @returns {Object} An object with `token` (to send to the end-user) and `secret` (to be stored in back-end for later verification).
 */
module.exports = {
    friendlyName: 'Generate CSRF Token and Secret',

    description: 'Generate a CSRF token, and a secret.',

    sync: true, // not async

    inputs: {
        saltLength: {
            type: 'number',
            defaultsTo: 8, // characters, not bytes
            min: 8
        },

        secretLength: {
            type: 'number',
            defaultsTo: 18, // bytes, not characters
            min: 18
        }
    },

    exits: {},

    fn: (inputs, exits) => {
        const tokens = new Tokens({
            saltLength: inputs.saltLength,
            secretLength: inputs.secretLength
        });

        const secret = tokens.secretSync();

        return exits.success({
            token: tokens.create(secret), // goes to user, to be used (or "spent") to perform anything other than a GET request
            secret // to be stored, and never shared; used to validate the user given token
        });
    }
};
