module.exports = {
    friendlyName: 'Create API Token',

    description: 'Create an API token, which replaces CSRF token / session cookie usage.',

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

        const outToken = newToken.id + ':' + newToken.token;

        return exits.created({
            token: outToken,
            header: 'Bearer ' + outToken
        });
    }
};
