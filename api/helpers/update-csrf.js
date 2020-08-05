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

    exits: {},

    fn: async (inputs, exits) => {
        if (inputs.req.method === 'GET' || !inputs.req.session || !inputs.req.session.user || !inputs.req.session.id) {
            return exits.success(inputs.data);
        }

        const foundSession = await Session.findOne({id: inputs.req.session.id});

        const csrf = sails.helpers.generateCsrfToken();
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
