const Tokens = require('csrf');

module.exports = {
    sync: true,

    friendlyName: 'Verify CSRF token',

    description: 'Verify a CSRF token, given a secret.',

    inputs: {
        token: {
            type: 'string',
            required: true
        },

        secret: {
            type: 'string',
            required: true
        },

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

        return exits.success(tokens.verify(inputs.secret, inputs.token));
    }
};
