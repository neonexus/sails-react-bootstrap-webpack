/**
 * Create Log
 *
 * @function sails.helpers.createLog
 * @param {Object} [req={}] - The request object to associate with this log.
 * @param {*} data - The data to log.
 * @param {String} description - The description for the log.
 *
 * @returns {Object} The new log model.
 */
module.exports = {
    friendlyName: 'Create Log',

    description: 'Create a log to be stored in the database.',

    inputs: {
        req: {
            type: 'ref',
            defaultsTo: {},
            description: 'The current incoming request (req).'
        },
        data: {
            type: 'ref',
            required: true,
            description: 'The data to log.'
        },
        description: {
            type: 'string',
            required: true,
            description: 'Do you really need a description for a description?'
        }
    },

    exits: {
        success: {},
        error: {}
    },

    fn: (inputs, exits) => {
        const user = (inputs.req.session && inputs.req.session.user) ? inputs.req.session.user.id : null,
            request = (inputs.req.id) ? inputs.req.id : null;

        const newLog = {
            id: 'c', // required, but auto-generated
            data: inputs.data,
            user,
            request,
            description: inputs.description
        };

        sails.models.log.create(newLog).meta({fetch: true}).exec((err, newLog) => {
            /* istanbul ignore if */
            if (err) {
                console.error(err);

                return exits.error(err);
            }

            return exits.success(newLog);
        });
    }
};

