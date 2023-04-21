module.exports = {
    primaryKey: 'id',

    attributes: {
        id: {
            type: 'string',
            columnType: 'varchar(36)',
            required: true
        },

        user: {
            model: 'user',
            required: true
        },

        data: {
            type: 'json'
        },

        token: {
            type: 'string',
            columnType: 'text',
            encrypt: true,
            allowNull: false
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
            'token'
        ]);
    },

    beforeCreate: (obj, next) => {
        obj.id = sails.helpers.generateUuid();
        // obj.token = sails.helpers.generateToken(); // Can't be used here, because encryption happens before this is called...

        return next();
    }
};
