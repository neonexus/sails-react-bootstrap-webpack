const stringify = require('json-stringify-safe');

module.exports = {

    friendlyName: 'Finalize request log',

    description: 'Used by response handlers to log final responses to requests.',

    inputs: {
        req: {
            type: 'ref',
            description: 'The current incoming request (req).',
            required: true
        },

        res: {
            type: 'ref',
            description: 'The current outgoing response (res).',
            required: true
        },

        body: {
            type: 'ref',
            description: 'The body of the response.',
            required: true
        }
    },

    exits: {
        success: {}
    },

    fn: async function(inputs, exits){
        if (inputs.req.requestId) {
            let out = _.merge({}, inputs.body),
                headers = _.merge({}, inputs.res._headers), // copy the object
                bleep = '*******';

            if (!sails.config.logSensitiveData) {
                if (out._csrf) {
                    out._csrf = bleep;
                }

                if (out.token) {
                    out.token = bleep;
                }

                if (out.access_token) {
                    // eslint-disable-next-line camelcase
                    out.access_token = bleep;
                }

                if (out.refresh_token) {
                    // eslint-disable-next-line camelcase
                    out.refresh_token = bleep;
                }
            }

            if (_.isObject(out)) {
                out = stringify(out);
            }

            const diff = process.hrtime(inputs.req._customStartTime),
                time = diff[0] * 1e3 + diff[1] * 1e-6,
                totalTime = time.toFixed(4) + 'ms';

            let log = {
                responseCode: inputs.res.statusCode,
                responseBody: out,
                responseHeaders: stringify(headers),
                responseTime: totalTime
            };

            if (inputs.req.viewer) {
                log.viewer = inputs.req.viewer.id;
            }

            sails.models.requestlog.update(inputs.req.requestId, log, (err) => {
                if (err) {
                    //utils.createLog(req, err, 'Error updating request audit log');
                    console.log(err);
                }
            });
        }

        // All done.
        return exits.success();
    }
};

