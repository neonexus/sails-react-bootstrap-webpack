module.exports = async function iAmATeaPot() {
    // Used as a trigger to an iPhone / Android app to update.
    const res = this.res;
    const req = this.req;
    const out = {
        success: false,
        errorMessages: [
            'The app requires an update to be compatible with this API.'
        ]
    };

    res.status(418).json(out);

    await sails.helpers.finalizeRequestLog(req, res, out);
};
