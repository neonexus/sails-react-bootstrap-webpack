module.exports = async function(req, res, next) {
    const sessionId = req.signedCookies[sails.config.session.name] || null;

    if (sessionId) {
        const foundSession = await sails.models.session.findOne({id: sessionId});

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

        // Doesn't look like this session is valid, remove the cookie.
        res.clearCookie(sails.config.session.name, {signed: true, httpOnly: true, secure: sails.config.session.cookie.secure});
    } else {
        let token = req.headers['authorization'];

        if (token) {
            if (token.includes('Bearer ')) {
                token = token.substring(7);
            }

            const foundToken = await sails.models.apitoken.findOne({
                token
            }).populate('user');

            if (foundToken) {
                await sails.models.apitoken.updateOne({
                    token
                }).set({updatedAt: new Date()});

                req.session = {user: foundToken.user};

                return next();
            }
        }
    }

    return res.forbidden('You are not logged in');
};
