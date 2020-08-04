module.exports = {
    friendlyName: 'Create API Token',

    description: 'Get an API token, which replaces CSRF token usage.',

    inputs: {},

    exits: {
        ok: {
            responseType: 'ok'
        },
        badRequest: {
            responseType: 'badRequest'
        },
        serverError: {
            responseType: 'serverError'
        }
    },

    fn: (inputs, exits) => {

        return exits.ok();
    }
};
