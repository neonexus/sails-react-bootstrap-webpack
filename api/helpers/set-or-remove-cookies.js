/**
 * Set or Remove Cookies
 *
 * @function sails.helpers.setOrRemoveCookies
 * @param {Object} data The `data` object, to return to the end-user, containing a `cookies` object.
 * @param {Object} res The current `res` object.
 *
 * @returns {Object} The modified `data` object, minus the `cookies` (which are now attached to `res`).
 */
module.exports = {
    friendlyName: 'Set or Remove Cookies',

    description: 'Removes `cookies` from `data`, and attaches them to `res`.',

    sync: true, // this is a synchronous helper

    inputs: {
        data: {
            type: 'ref',
            required: true
        },

        res: {
            type: 'ref',
            required: true
        }
    },

    exits: {
        success: {
            description: 'Returns `data` input, minus the cookies object.'
        },

        missingName: {
            description: 'Cookie name is missing.'
        },

        missingValue: {
            description: 'Cookie value is not defined.'
        }
    },

    fn: (inputs, exits) => {
        if (!inputs.data.cookies) {
            return exits.success(inputs.data);
        }

        const cookies = (_.isArray(inputs.data.cookies))
                        ? inputs.data.cookies
                        : [inputs.data.cookies];

        cookies.map((cookie) => {
            if (_.isUndefined(cookie.name) || !_.isString(cookie.name) || _.isEmpty(cookie.name)) {
                throw 'missingName';
            }

            if (_.isUndefined(cookie.value)) {
                throw 'missingValue';
            }

            const defaultCookie = {
                signed: true, // Sign the cookie to prevent tampering.
                httpOnly: true, // Prevent JS from being able to read / write to this cookie in most browsers.
                secure: sails.config.session.cookie.secure // Only allow over HTTPS.
            };

            if (cookie.value === null) {
                return inputs.res.clearCookie(cookie.name, defaultCookie);
            }

            const newCookie = (!cookie.isSession) // If we don't want to use the default "session" to expire the cookie, we use the maxAge.
                              ? _.merge({}, defaultCookie, {maxAge: sails.config.session.cookie.maxAge})
                              : defaultCookie;

            return inputs.res.cookie(cookie.name, cookie.value, newCookie);
        });

        return exits.success(_.omit(inputs.data, ['cookies']));
    }
};

