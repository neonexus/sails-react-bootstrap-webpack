const moment = require('moment-timezone');

module.exports = async function(req, res, next) {
    const sessionId = req.signedCookies[sails.config.session.name] || null; // signed cookies: https://sailsjs.com/documentation/reference/request-req/req-signed-cookies

    // Do we have a signed cookie?
    if (sessionId) {
        const foundSession = await sails.models.session.findOne({id: sessionId}).decrypt().populate('user');

        // Has the session expired?
        if (moment(foundSession.expiresAt).isBefore(moment(new Date()))) {
            res.clearCookie(sails.config.session.name, {signed: true, secure: sails.config.session.cookie.secure});

            await sails.models.session.destroy({id: sessionId});

            return res.forbidden('You are not logged in');
        }

        // If the session was found...
        if (foundSession && foundSession.user) {
            req.session = {id: sessionId, user: foundSession.user, data: foundSession.data};

            if (req.method !== 'GET') {
                const csrf = req.headers['x-csrf-token'];

                // verify the CSRF token is still valid
                if (csrf && sails.helpers.verifyCsrfToken.with({token: csrf, secret: foundSession.csrfSecret})) {
                    return next();
                }
            } else {
                return next();
            }
        }

        // Doesn't look like this session is valid, remove the cookie.
        /* istanbul ignore next */
        res.clearCookie(sails.config.session.name, {signed: true, secure: sails.config.session.cookie.secure});
    } else {
        // We couldn't find a session via cookies, let's check headers...
        let token = req.headers['authorization'] || null;

        if (token) {
            if (token.includes('Bearer ')) {
                token = token.substring(7);
            }

            if (!token.includes(':')) {
                return res.forbidden('Invalid credentials.');
            }

            token = token.split(':');

            const foundToken = await sails.models.apitoken.findOne({id: token[0]}).decrypt().populate('user');

            if (!foundToken || token[1] !== foundToken.token) {
                return res.forbidden('Invalid credentials.');
            }

            if (foundToken) {
                await sails.models.apitoken.updateOne({id: foundToken.id}).set({updatedAt: new Date()});

                req.session = {id: foundToken.id, user: foundToken.user, data: foundToken.data, isAPIToken: true};

                return next();
            }
        }
    }

    return res.forbidden('You are not logged in');
};
