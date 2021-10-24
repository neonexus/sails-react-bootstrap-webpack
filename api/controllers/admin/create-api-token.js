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
        const newToken = await sails.models.apitoken.create({
            id: 'c', // required, auto-generated
            user: env.req.session.user.id
        }).fetch();

        return exits.ok({
            token: newToken.token,
            __skipCSRF: true // this tells our "ok" response to ignore the CSRF token update
        });
    }
};
