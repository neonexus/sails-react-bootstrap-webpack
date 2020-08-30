module.exports = {
    primaryKey: 'id',

    attributes: {
        id: {
            type: 'string',
            columnType: 'varchar(36)',
            required: true
        },

        token: {
            type: 'string',
            unique: true
        },

        user: {
            model: 'user',
            required: true
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

    beforeCreate: (obj, next) => {
        obj.id = sails.helpers.generateUuid();
        obj.token = sails.helpers.generateToken();

        return next();
    }
};
