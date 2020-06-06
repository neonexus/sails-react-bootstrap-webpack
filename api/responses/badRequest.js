module.exports = async function badRequest(msg){
    const res = this.res;
    const req = this.req;

    if (!msg) {
        msg = 'Could not understand request';
    }

    const  out = {
        success: false,
        errors: await sails.helpers.simplifyErrors(msg),
        errorMessages: await sails.helpers.getErrorMessages(msg)
    };

    res.status(400).json(out);

    await sails.helpers.finalizeRequestLog(req, res, out);
};
