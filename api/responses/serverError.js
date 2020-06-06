module.exports = async function serverError(msg){
    const req = this.req;
    const res = this.res;

    if (!msg) {
        msg = 'Unknown server error occurred';
    }

    const out = {
        success: false,
        errors: await sails.helpers.simplifyErrors(msg),
        errorMessages: await sails.helpers.getErrorMessages(msg)
    };

    res.status(500).json(out);

    await sails.helpers.finalizeRequestLog(req, res, out);
};
