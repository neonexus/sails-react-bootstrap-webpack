module.exports = {
    primaryKey: 'id',

    attributes: {
        id: {
            type: 'number',
            autoIncrement: true
        },

        user: {
            model: 'user'
        },

        request: {
            model: 'requestlog'
        },

        description: {
            type: 'string',
            columnType: 'varchar(191)'
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
    }
};
