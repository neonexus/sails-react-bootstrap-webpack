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

    fn: async function(inputs, exits) {
        if (inputs.req.requestId) {
            const bleep = '*******';
            let out = _.merge({}, inputs.body),
                headers = _.merge({}, inputs.res.getHeaders()); // copy the object

            if (!sails.config.logSensitiveData) { // a custom configuration option, for the request logger hook
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

            const time = Number(process.hrtime.bigint() - inputs.req._requestStartTime) / 1000000; // convert the bigint nanoseconds into milliseconds
            const totalTime = time.toFixed(4) + 'ms';

            let log = {
                responseCode: inputs.res.statusCode,
                responseBody: out,
                responseHeaders: stringify(headers),
                responseTime: totalTime
            };

            sails.models.requestlog.update({id: inputs.req.requestId}).set(log).exec((err) => {
                /* istanbul ignore if */
                if (err) {
                    console.error(err);
                }

                return exits.success();
            });
        } else {
            return exits.success();
        }
    }
};

