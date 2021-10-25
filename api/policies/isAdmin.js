// This policy requires the isLoggedIn policy run before hand, as it is where the custom session handling lives.

module.exports = function(req, res, next){
    if (req.session && req.session.user && req.session.user.role && req.session.user.role === 'admin') {
        return next();
    }

    return res.forbidden('You are not an admin');
};
