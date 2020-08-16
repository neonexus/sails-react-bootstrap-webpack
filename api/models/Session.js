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

    beforeCreate: (session, next) => {
        session.id = sails.helpers.generateUuid();

        return next();
    }
};
