module.exports = {
    primaryKey: 'id',
    description: 'One-Time Password Secrets',

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

        isEnabled: {
            type: 'boolean',
            defaultsTo: false
        },

        secret: {
            type: 'string',
            columnType: 'varchar(191)', // 191 is the max length to safely use the utf8mb4 varchar.
            encrypt: true,
            required: true
        },

        backupTokens: {
            type: 'string',
            columnType: 'text',
            encrypt: true,
            allowNull: true
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
            'secret',
            'backupTokens'
        ]);
    },

    beforeCreate: (obj, next) => {
        obj.id = sails.helpers.generateUuid();

        return next();
    }
};
