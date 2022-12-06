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
            columnType: 'varchar(191)' // 191 is the max length to safely use the utf8mb4 charset
        },

        data: {
            type: 'json'
        },

        createdAt: {
            type: 'ref',
            columnType: 'datetime',
            autoCreatedAt: true
        },

        updatedAt: false
    },

    beforeCreate: async function(log, next) {
        log.id = sails.helpers.generateUuid();

        return next();
    }
};
