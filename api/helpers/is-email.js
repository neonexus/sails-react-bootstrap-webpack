/**
 * Is Email
 *
 * @function sails.helpers.isEmail
 * @param {String} email - The string to check if it looks like an email address.
 *
 * @returns {Boolean} True if the string appears to be an email address.
 */
module.exports = {
    sync: true, // this is a synchronous helper

    friendlyName: 'Is Email',

    description: 'Does the provided string look like an email?',

    inputs: {
        email: {
            type: 'string',
            required: true
        }
    },

    exits: {
        success: {}
    },

    fn: (inputs, exits) => {
        // eslint-disable-next-line no-useless-escape
        const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

        return exits.success(emailRegex.test(inputs.email));
    }
};

