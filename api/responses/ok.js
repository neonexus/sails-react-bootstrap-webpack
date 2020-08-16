module.exports = async function sendOK(data) {
    const res = this.res;
    const req = this.req;

    if (!data) {
        data = {};
    }

    if (typeof data === 'string') {
        data = {message: data};
    }

    // ensure our models stay safe out there
    data = sails.helpers.keepModelsSafe(data);

    // set or remove cookies
    data = sails.helpers.setOrRemoveCookies(data, res);

    // handle CSRF tokens
    data = await sails.helpers.updateCsrf(data, req);

    const out = _.merge({success: true}, data);

    res.status(200);
    res.json(out);

    await sails.helpers.finalizeRequestLog(req, res, out);
};
