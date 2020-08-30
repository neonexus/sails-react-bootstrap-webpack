module.exports = {
    friendlyName: 'Create API Token',

    description: 'Get an API token, which replaces CSRF token / session cookie usage.',

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

    fn: async (inputs, exits, env) => {
        const newToken = await ApiToken.create({
            id: 'c', // required, auto-generated
            user: env.req.session.user.id
        }).fetch();

        return exits.ok({
            token: newToken.token,
            __skipCSRF: true
        });
    }
};
