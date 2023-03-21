module.exports = {
    friendlyName: 'Create API Token',

    description: 'Get an API token, which replaces CSRF token / session cookie usage.',

    inputs: {},

    exits: {
        created: {
            responseType: 'created'
        }
    },

    fn: async (inputs, exits, env) => {
        const newToken = await sails.models.apitoken.create({
            id: 'c', // required, auto-generated
            user: env.req.session.user.id,
            token: sails.helpers.generateToken(),
            data: {} // Used to store things that are temporary, or only apply to this session.
        }).fetch().decrypt();

        return exits.created({
            id: newToken.id,
            token: newToken.token,
            header: 'Bearer ' + newToken.id + ':' + newToken.token,
            __skipCSRF: true // this tells our "created" response to ignore the CSRF token update
        });
    }
};
