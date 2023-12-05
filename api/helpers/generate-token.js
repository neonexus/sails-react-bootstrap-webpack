const crypto = require('crypto');
const moment = require('moment-timezone');

/**
 * Generate Token
 *
 * @function sails.helpers.generateToken
 * @param {String} [extra='Evil will always triumph, because good is dumb. -Lord Helmet'] - A bit of random, extra bits to change up the hash.
 *
 * @returns {String} A SHA512 hash of a cryptographically-secure, randomly generated string of characters.
 */
module.exports = {
    friendlyName: 'Generate Token',

    description: 'Generate generic token for generic use, generically. (64 characters)',

    sync: true, // not async

    inputs: {
        extra: {
            type: 'string',
            description: 'A bit of random, extra bits to change up the hash.',
            defaultsTo: 'Evil will always triumph, because good is dumb. -Lord Helmet'
        }
    },

    fn: (inputs, exits) => {
        return exits.success(
            crypto.createHmac('sha512', sails.config.session.secret).update(
                crypto.randomBytes(21)    // cryptographically-secure random characters
                + moment(new Date()).format()       // throw in the current time stamp
                + inputs.extra                      // an optional way to add a bit more randomness to the mix
                + crypto.randomBytes(21)       // cryptographically-secure random characters
            ).digest('hex')
        );
    }
};

