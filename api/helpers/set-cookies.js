module.exports = {
    sync: true, // this is a synchronous helper

    friendlyName: 'Set Cookies',

    description: 'Removes `cookies` from `data`, and attaches them to `res`.',

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
        success: {}
    },

    fn: function(inputs, exits) {
        if (!inputs.data.cookies) {
            return exits.success(inputs.data);
        }

        const cookies = (_.isArray(inputs.data.cookies))
                        ? inputs.data.cookies
                        : [inputs.data.cookies];

        cookies.map((cookie) => {
            const defaultCookie = {
                signed: true,
                httpOnly: true,
                secure: sails.config.session.cookie.secure
            };

            if (cookie.value === null) {
                return inputs.res.clearCookie(cookie.name, defaultCookie);
            }

            const newCookie = (cookie.isSession)
                              ? _.merge({}, defaultCookie, {maxAge: sails.config.session.cookie.maxAge})
                              : defaultCookie;

            return inputs.res.cookie(cookie.name, cookie.value, newCookie);
        });

        return exits.success(_.omit(inputs.data, ['cookies']));
    }
};

