module.exports = async function(req, res, next) {
    const sessionId = req.signedCookies[sails.config.session.name] || null;

    if (sessionId) {
        const foundSession = await Session.findOne({id: sessionId});

        if (foundSession && foundSession.data.user) {
            req.session = {id: sessionId, user: foundSession.data.user};

            if (req.method !== 'GET') {
                const csrf = req.headers['x-csrf-token'];

                if (csrf && sails.helpers.verifyCsrfToken.with({token: csrf, secret: foundSession.data._csrfSecret})) {
                    return next();
                }
            } else {
                return next();
            }
        }
    }

    return res.forbidden('You are not logged in');
};
