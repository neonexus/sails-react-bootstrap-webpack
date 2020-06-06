const crypto = require('crypto'),
    moment = require('moment-timezone');

module.exports = {
    sync: true, // this is a synchronous helper

    friendlyName: 'Generate token',

    description: 'Generate generic token for generic use, generically. (64 characters)',

    inputs: {
        extra: {
            type: 'string',
            defaultsTo: 'Evil will always triumph, because good is dumb. -Lord Helmet'
        }
    },

    exits: {},

    fn: function(inputs, exits) {
        return exits.success(
            crypto.createHmac('sha256', sails.config.session.secret)
            .update(
                crypto.randomBytes(21)
                + moment(new Date()).format()
                + 'I am a little tea pot'
                + inputs.extra
                + crypto.randomBytes(21)
            )
            .digest('hex')
        );
    }
};

