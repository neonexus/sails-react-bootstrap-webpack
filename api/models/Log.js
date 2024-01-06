const stringify = require('json-stringify-safe');

module.exports = {
    primaryKey: 'id',

    attributes: {
        id: {
            type: 'string',
            columnType: 'varchar(36)',
            required: true
        },

        user: {
            model: 'user'
        },

        request: {
            model: 'requestlog'
        },

        description: {
            type: 'string',
            columnType: 'varchar(191)' // 191 is the max length to safely use the utf8mb4 varchar.
        },

        data: {
            type: 'json'
        },

        createdAt: {
            type: 'ref',
            columnType: 'datetime(3)',
            autoCreatedAt: true
        },

        updatedAt: false
    },

    beforeCreate: async function(log, next) {
        log.id = sails.helpers.generateUuid();

        if (_.isObject(log.data)) {
            // Here we are using `json-stringify-safe` to make complex objects
            // serializable / readable going to the database and back.
            log.data = JSON.parse(stringify(log.data));
        }

        return next();
    }
};
