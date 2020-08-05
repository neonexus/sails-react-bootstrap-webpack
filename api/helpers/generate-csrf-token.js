const Tokens = require('csrf');

module.exports = {
    sync: true,

    friendlyName: 'Generate CSRF token',

    description: 'Generate a CSRF token, and a secret.',

    inputs: {
        saltLength: {
            type: 'number',
            defaultsTo: 8
        },

        secretLength: {
            type: 'number',
            defaultsTo: 18
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
            token: tokens.create(secret),
            secret
        });
    }
};
