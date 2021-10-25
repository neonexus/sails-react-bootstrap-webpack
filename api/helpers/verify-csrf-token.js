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
        }
    },

    exits: {},

    fn: (inputs, exits) => {
        const tokens = new Tokens();

        return exits.success(tokens.verify(inputs.secret, inputs.token));
    }
};
