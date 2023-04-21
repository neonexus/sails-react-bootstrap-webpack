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

    // `env` is an "escape hatch", to get at the current session `env.req.session`.
    // This requires the "isLoggedIn" policy is run beforehand.
    fn: async (inputs, exits, env) => {
        const foundUser = await sails.models.user.findOne({id: env.req.session.user.id}); // req.session.user is filled in by the isLoggedIn policy
        const foundOTP = await sails.models.otp.findOne({user: foundUser.id, isEnabled: true});

        /* istanbul ignore if */
        if (!foundUser) {
            // this should not happen
            return exits.serverError();
        }

        return exits.ok({
            user: _.merge(foundUser, {
                _isOTPEnabled: (!!foundOTP)
            })
        });
    }
};
