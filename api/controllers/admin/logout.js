module.exports = {
    friendlyName: 'Logout',

    description: 'Destroy current user session.',

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
        const foundSession = await Session.findOne({id: env.req.session.id});

        if (!foundSession) {
            return exits.ok();
        }

        await Session.destroy({id: foundSession.id});

        return exits.ok({
            cookies: [
                {
                    name: sails.config.session.name,
                    value: null, // setting null will tell sails.helpers.setCookies to remove it
                    isSession: true
                }
            ]
        });
    }
};
