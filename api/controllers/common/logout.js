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

    // `env` is an "escape hatch", to get at the current session `env.req.session`.
    // This requires the "isLoggedIn" policy is run beforehand.
    fn: async (inputs, exits, env) => {
        if (env.req.session.isAPIToken) {
            await sails.models.apitoken.destroy({id: env.req.session.id});

            return exits.ok();
        }

        const foundSession = await sails.models.session.findOne({id: env.req.session.id});

        /* istanbul ignore if */
        if (!foundSession) {
            // should not happen
            return exits.ok();
        }

        await sails.models.session.destroy({id: foundSession.id});

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
