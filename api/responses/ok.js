module.exports = async function sendOK(data) {
    const res = this.res;
    const req = this.req;

    if (!data) {
        data = {};
    }

    if (typeof data === 'string') {
        data = {message: data};
    }

    data = sails.helpers.keepModelsSafe(data);

    const out = _.merge({success: true}, data);

    res.status(200);
    res.json(out);

    await sails.helpers.finalizeRequestLog(req, res, out);
};
