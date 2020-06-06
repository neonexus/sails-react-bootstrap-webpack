module.exports = async function notFound(msg){
    const req = this.req;
    const res = this.res;

    if (!msg) {
        msg = 'Could not locate requested item';
    }

    const out = {
        success: false,
        errors: await sails.helpers.simplifyErrors(msg),
        errorMessages: await sails.helpers.getErrorMessages(msg)
    };

    res.status(404).json(out);

    await sails.helpers.finalizeRequestLog(req, res, out);
};
