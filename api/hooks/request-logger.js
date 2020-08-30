const stringify = require('json-stringify-safe');

module.exports = (sails) => {
    return {

        initialize: function(cb) {
            // Assign this hook object to the `hook` var.
            // This allows us to add/modify values that users of the hook can retrieve.
            //hook = this;
            // Initialize a couple of values on the hook.
            //hook.numRequestsSeen = 0;
            //hook.numUnhandledRequestsSeen = 0;
            // Signal that initialization of this hook is complete
            // by calling the callback.
            return cb();
        },

        routes: {
            before: {
                '*': function(req, res, next) {
                    if (req.method !== 'HEAD' && req.path !== '/__getcookie' && req.path !== '/') {
                        const bleep = '*******';

                        let body = _.merge({}, req.body),
                            query = _.merge({}, req.query),
                            headers = _.merge({}, req.headers); // copy the object

                        if (!sails.config.logSensitiveData) {
                            // don't log plain-text passwords
                            if (body.password) {
                                body.password = bleep;
                            }

                            if (body.password2) {
                                body.password2 = bleep;
                            }

                            if (body.currentPassword) {
                                body.currentPassword = bleep;
                            }

                            if (body.newPassword) {
                                body.newPassword = bleep;
                            }

                            if (body.newPassword2) {
                                body.newPassword2 = bleep;
                            }

                            if (body.pass) {
                                body.pass = bleep;
                            }

                            if (query.securityToken) {
                                query.securityToken = bleep;
                            }

                            if (headers.securityToken) {
                                headers.securityToken = bleep;
                            }
                        }

                        if (_.isObject(body)) {
                            body = stringify(body);
                        }

                        sails.models.requestlog.create({
                            direction: 'inbound',
                            method: req.method,
                            host: req.hostname || req.host || 'unknown',
                            path: req.path,
                            headers: headers,
                            getParams: query,
                            body: body
                        }).meta({fetch: true}).exec(async (err, newRequest) => {
                            if (err) {
                                console.log(err);

                                return next(); // don't stop the traffic if there is a problem
                            }

                            req.requestId = newRequest.id;
                            req._customStartTime = process.hrtime();

                            return next();
                        });
                    } else {
                        return next();
                    }
                }
            }
        }
    };
};
