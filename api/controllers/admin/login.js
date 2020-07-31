module.exports = {
    friendlyName: 'Admin Login',

    description: 'Basic authentication for admin panel.',

    inputs: {
        email: {
            type: 'string',
            required: true,
            isEmail: true,
            maxLength: 191 // max length of UTF8MB4 varchar
        },

        password: {
            type: 'string',
            required: true,
            maxLength: 191
        }
    },

    exits: {
        ok: {
            responseType: 'ok'
        },
        badRequest: {
            responseType: 'badRequest'
        },
        serverError: {
            responseType: 'serverError'
        }
    },

    fn: (inputs, exits) => {


        return exits.ok();
    }
};
