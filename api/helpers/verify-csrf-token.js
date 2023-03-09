const Tokens = require('csrf');

module.exports = {
    friendlyName: 'Verify CSRF token',

    description: 'Verify a CSRF token, given a secret.',

    sync: true, // not async

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
