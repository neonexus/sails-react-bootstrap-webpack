module.exports = async function forbidden(msg) {
    const res = this.res;
    const req = this.req;

    if (!msg) {
        msg = 'You are not permitted to perform this action.';
    }

    const out = {
        success: false,
        errors: sails.helpers.simplifyErrors(msg),
        errorMessages: sails.helpers.getErrorMessages(msg)
    };

    res.status(403).json(out);

    await sails.helpers.finalizeRequestLog(req, res, out);
};
