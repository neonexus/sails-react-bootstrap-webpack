module.exports = function(req, res, next){
    if (req.session && req.session.user && req.session.user.role && req.session.user.role === 'admin') {
        return next();
    }

    return res.forbidden('You are not an admin');
};
