module.exports = {
    sync: true, // this is a synchronous helper

    friendlyName: 'Is email',

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

    fn: function(inputs, exits) {
        // eslint-disable-next-line no-useless-escape
        const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

        return exits.success(emailRegex.test(inputs.email));
    }
};

