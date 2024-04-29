const stringify = require('json-stringify-safe');

module.exports = (sails) => {
    return {
        initialize: function(cb) {
            return cb();
        },

        routes: {
            before: {
                '*': function(req, res, next) {
                    if (
                        req.method !== 'HEAD'
                        && req.path !== '/__getcookie'
                        && req.path !== '/_ping'
                        && req.path !== '/'
                        && sails.config.log.captureRequests === true
                    ) {
                        if (sails.config.log.ignoreAssets && req.path.includes('.')) {
                            req.id = 'IGNORE';

                            return next();
                        }

                        const bleep = '*******';

                        let body = _.merge({}, req.body),
                            query = _.merge({}, req.query),
                            headers = _.merge({}, req.headers); // copy the object

                        // Regardless of what our configuration option is set to, NEVER log sensitive info on PRODUCTION!
                        if (sails.config.security.requestLogger.logSensitiveData !== true || process.env.NODE_ENV.toUpperCase() === 'PROD' || process.env.NODE_ENV.toUpperCase() === 'PRODUCTION') {
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

                            if (body.otp) {
                                body.otp = bleep;
                            }

                            if (query.securityToken) {
                                query.securityToken = bleep;
                            }

                            if (headers.authorization) {
                                headers.authorization = bleep;
                            }

                            if (headers.cookie) {
                                headers.cookie = bleep;
                            }

                            if (headers.securityToken) {
                                headers.securityToken = bleep;
                            }

                            if (headers['x-csrf-token']) {
                                headers['x-csrf-token'] = bleep;
                            }
                        }

                        if (_.isObject(body)) {
                            body = stringify(body);
                        }

                        sails.models.requestlog.create({
                            id: 'c', // required, but is auto-generated
                            direction: 'inbound',
                            method: req.method,
                            host: req.hostname || 'unknown',
                            path: req.path,
                            headers: headers,
                            getParams: query,
                            body: body
                        }).meta({fetch: true}).exec(async (err, newRequest) => {
                            if (err) {
                                console.log(err);

                                return next(); // don't stop the traffic if there is a problem
                            }

                            req.id = newRequest.id;
                            req._requestStartTime = process.hrtime.bigint();

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
