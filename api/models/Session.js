const moment = require('moment-timezone');

module.exports = {
    primaryKey: 'id',

    attributes: {
        id: {
            type: 'string',
            columnType: 'varchar(36)',
            required: true
        },

        user: {
            model: 'User',
            required: true
        },

        data: {
            type: 'json'
        },

        csrfSecret: {
            type: 'string',
            columnType: 'varchar(105)',
            required: true,
            encrypt: true
        },

        expiresAt: {
            type: 'ref',
            columnType: 'datetime',
            required: false // If we make this `true`, it will force controllers to have to supply an empty string on creation.
        },

        createdAt: {
            type: 'ref',
            columnType: 'datetime',
            autoCreatedAt: true
        },

        updatedAt: {
            type: 'ref',
            columnType: 'datetime',
            autoUpdatedAt: true
        }
    },

    customToJSON: function() { // DO NOT use => function!
        // This will be run by the "keep-models-safe" helper.
        return _.omit(this, [
            'csrfSecret'
        ]);
    },

    beforeCreate: (session, next) => {
        session.id = sails.helpers.generateUuid();
        session.expiresAt = moment(new Date()).add(sails.config.session.expiresAt.amount, sails.config.session.expiresAt.unit).toDate();

        return next();
    }
};
