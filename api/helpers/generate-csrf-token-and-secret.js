const Tokens = require('csrf');

module.exports = {
    sync: true,

    friendlyName: 'Generate CSRF token',

    description: 'Generate a CSRF token, and a secret.',

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
