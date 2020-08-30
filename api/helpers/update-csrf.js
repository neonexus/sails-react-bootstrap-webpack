module.exports = {
    friendlyName: 'Update CSRF',

    description: 'Update the CSRF secret, and append the token to the res.',

    inputs: {
        data: {
            type: 'ref',
            required: true
        },

        req: {
            type: 'ref',
            required: true
        }
    },

    exits: {
        success: {},

        serverError: {}
    },

    fn: async (inputs, exits) => {
        // Do nothing if we don't have a session, or this is a GET request.
        if (inputs.req.method === 'GET' || !inputs.req.session || !inputs.req.session.user || !inputs.req.session.id || inputs.data.__skipCSRF) {
            return exits.success(_.omit(inputs.data, ['__skipCSRF']));
        }

        const foundSession = await Session.findOne({id: inputs.req.session.id});

        if (!foundSession) {
            throw new exits.serverError('Session could not be found in Update CSRF helper.');
        }

        const csrf = sails.helpers.generateCsrfTokenAndSecret();

        // Update stored session data, so we can compare our token to the secret on the next request (handled in the isLoggedIn policy).
        const newData = _.merge({}, foundSession.data, {_csrfSecret: csrf.secret});

        Session.update({id: inputs.req.session.id}).set({
            data: newData
        }).exec((err) => {
            if (err) {
                throw new Error(err);
            }

            return exits.success(_.merge({}, inputs.data, {_csrf: csrf.token}));
        });
    }
};
