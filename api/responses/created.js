module.exports = async function created(data) {
    const res = this.res;
    const req = this.req;

    if (!data) {
        data = {};
    }

    if (typeof data === 'string') {
        data = {message: data};
    }

    data = sails.helpers.keepModelsSafe(data);
    data = sails.helpers.setOrRemoveCookies(data, res);
    data = await sails.helpers.updateCsrfAndExpiry(data, req);

    const out = _.merge({success: true}, data);

    res.status(201).json(out);

    await sails.helpers.finalizeRequestLog(req, res, out);
};
