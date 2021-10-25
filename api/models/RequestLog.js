module.exports = {
    primaryKey: 'id',

    attributes: {
        id: {
            type: 'string',
            columnType: 'varchar(36)',
            required: true // this is required, but commenting out because it's auto-generated on creation, and will help cleanup useless code
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
            columnType: 'varchar(191)'
        },

        path: {
            type: 'string',
            required: true,
            columnType: 'varchar(191)'
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
            columnType: 'datetime',
            autoCreatedAt: true
        },

        updatedAt: false
    },

    beforeCreate: async function(reqlog, next) {
        reqlog.id = sails.helpers.generateUuid();

        return next();
    }
};
