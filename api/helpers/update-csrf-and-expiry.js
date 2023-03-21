const moment = require('moment-timezone');

/**
 * Update CSRF and Session Expiry
 *
 * @function sails.helpers.updateCsrfAndExpiry
 * @param {Object} data The `data` object on its way to the end-user.
 * @param {Object} req The current `req` object.
 *
 * @returns {Object} The updated `data` object to return to the end-user.
 */
module.exports = {
    friendlyName: 'Update CSRF and Expiry',

    description: 'Update the CSRF secret, and append the token to the res.',

    inputs: {
        data: {
            type: 'ref',
            required: true
        },

        req: {
            type: 'ref',
            required: true
        }
    },

    exits: {
        success: {},

        serverError: {}
    },

    fn: async (inputs, exits) => {
        // Update session expiry time.
        const expiresAt = moment(new Date()).add(sails.config.session.expiresAt.amount, sails.config.session.expiresAt.unit).toDate();

        // Do nothing with CSRF if we don't have a session, this is a GET request, or we manually specified to skip (for API tokens for example).
        if (inputs.req.method === 'GET' || !inputs.req.session || !inputs.req.session.user || !inputs.req.session.id || inputs.data.__skipCSRF) {
            // Do we have a session? If so, update the `data` and `expiresAt`.
            if (inputs.req.session && inputs.req.session.id) {
                // If it's NOT an API token.
                if (!inputs.req.session.isAPIToken) {
                    // Update expiration date and data.
                    await sails.models.session.update({id: inputs.req.session.id}).set({expiresAt, data: inputs.req.session.data});
                } else if (inputs.req.session.isAPIToken) {
                    // If it is an API token, save the session data.
                    await sails.models.apitoken.update({id: inputs.req.session.id}).set({data: inputs.req.session.data});
                }
            }

            return exits.success(_.omit(inputs.data, ['__skipCSRF']));
        }

        // If this is a regular session.
        if (!inputs.req.session.isAPIToken) {
            const foundSession = await sails.models.session.findOne({id: inputs.req.session.id});

            if (!foundSession) {
                throw new exits.serverError('Session could not be found in Update CSRF helper.');
            }

            const csrf = sails.helpers.generateCsrfTokenAndSecret();

            await sails.models.session.update({id: inputs.req.session.id}).set({csrfSecret: csrf.secret, expiresAt, data: inputs.req.session.data});

            return exits.success(_.merge({}, inputs.data, {_csrf: csrf.token}));
        } else {
            // If this was an API token, save the session data.
            await sails.models.apitoken.update({id: inputs.req.session.id}).set({data: inputs.req.session.data});
        }

        return exits.success(inputs.data);
    }
};
