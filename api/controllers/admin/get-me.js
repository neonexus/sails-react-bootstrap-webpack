module.exports = {
    friendlyName: 'Get me',

    description: 'Get the currently logged in user.',

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
        const foundUser = await User.findOne({id: env.req.session.user.id}); // req.session.user is filled in by the isLoggedIn policy

        if (!foundUser) {
            // this should not happen
            return exits.serverError();
        }

        return exits.ok({user: foundUser});
    }
};
