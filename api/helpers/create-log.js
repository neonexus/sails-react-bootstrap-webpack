module.exports = {
    friendlyName: 'Create a log',

    description: 'Create a log to be stored in the database.',

    inputs: {
        req: {
            type: 'ref',
            defaultsTo: {}
        },
        data: {
            type: 'ref',
            required: true
        },
        description: {
            type: 'string',
            required: true
        }
    },

    exits: {
        success: {},
        error: {}
    },

    fn: function(inputs, exits){
        const user = (inputs.req.session && inputs.req.session.user) ? inputs.req.session.user.id : null,
            account = (inputs.req.session && inputs.req.session.account) ? inputs.req.session.account.id : null,
            request = (inputs.req.requestId) ? inputs.req.requestId : null;

        const newLog = {
            data: inputs.data,
            user: user,
            account: account,
            request: request,
            description: inputs.description
        };

        Log.create(newLog).meta({fetch: true}).exec((err, newLog) => {
            if (err) {
                console.error(err);

                return exits.error(err);
            }

            return exits.success({log: newLog});
        });
    }
};

