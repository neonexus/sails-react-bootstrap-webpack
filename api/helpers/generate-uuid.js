const crypto = require('crypto');

/**
 * Generate UUID
 *
 * @function sails.helpers.generateUuid
 * @param {Boolean} [disableEntropyCache=false] - This will force the RNG to ignore the pre-generated values, in-turn will mean a performance hit.
 *
 * @returns {String} A UUID v4 string.
 */
module.exports = {
    friendlyName: 'Generate UUID',

    description: 'Generate a v4 UUID.',

    sync: true, // not async

    inputs: {
        disableEntropyCache: {
            description: 'This will force the RNG to ignore the pre-generated values, in-turn will mean a performance hit.',
            type: 'bool',
            defaultsTo: false
        }
    },

    fn: (inputs, exits) => {
        return exits.success(crypto.randomUUID({
            disableEntropyCache: inputs.disableEntropyCache
        }));
    }
};
