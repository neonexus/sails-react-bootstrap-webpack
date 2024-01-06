module.exports = {
    primaryKey: 'id',

    attributes: {
        id: {
            type: 'string',
            columnType: 'varchar(36)',
            required: true
        },

        direction: {
            type: 'string',
            isIn: [
                'inbound',
                'outbound'
            ],
            required: true,
            columnType: 'varchar(8)'
        },

        method: {
            type: 'string',
            isIn: [
                'GET',
                'POST',
                'PUT',
                'DELETE',
                'PATCH'
            ],
            required: true,
            columnType: 'varchar(6)'
        },

        host: {
            type: 'string',
            required: true,
            columnType: 'varchar(191)' // 191 is the max length to safely use the utf8mb4 varchar.
        },

        path: {
            type: 'string',
            required: true,
            columnType: 'varchar(191)' // 191 is the max length to safely use the utf8mb4 varchar.
        },

        headers: {
            type: 'json'
        },

        getParams: {
            type: 'json'
        },

        body: {
            type: 'string',
            columnType: 'longtext',
            allowNull: true
        },

        responseCode: {
            type: 'number',
            allowNull: true,
            columnType: 'int(4) unsigned'
        },

        responseBody: {
            type: 'string',
            columnType: 'longtext',
            allowNull: true
        },

        responseHeaders: {
            type: 'string',
            columnType: 'longtext',
            allowNull: true
        },

        responseTime: {
            type: 'string',
            allowNull: true,
            columnType: 'varchar(15)'
        },

        createdAt: {
            type: 'ref',
            columnType: 'datetime(3)',
            autoCreatedAt: true
        },

        updatedAt: false
    },

    beforeCreate: async function(reqlog, next) {
        reqlog.id = sails.helpers.generateUuid();

        return next();
    }
};
