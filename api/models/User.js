const scrypt = require('scrypt-kdf');
const crypto = require('crypto');

function forceUppercaseOnFirst(name) {
    const trimName = name.trim();

    return trimName.charAt(0).toUpperCase() + trimName.slice(1);
}

function getGravatarUrl(email) {
    return 'https://www.gravatar.com/avatar/' + crypto.createHash('md5').update(email).digest('hex');
}

async function hashPassword(pass) {
    const hash = await scrypt.kdf(pass, {logN: 15});

    return hash.toString('base64');
}

async function updatePassword(password) {
    // "binary to ASCII" aka base64
    // btoa('scrypt') = c2NyeXB0
    if (password && password.length > 1 && password.substring(0, 8) !== 'c2NyeXB0') {
        password = await hashPassword(password);
    }

    return password;
}

module.exports = {
    primaryKey: 'id',

    attributes: {
        id: {
            type: 'string',
            columnType: 'varchar(36)',
            required: true
        },

        role: {
            type: 'string',
            isIn: [
                'user',
                'manager',
                'admin'
            ],
            required: true,
            columnType: 'varchar(7)'
        },

        email: {
            type: 'string',
            isEmail: true,
            required: true,
            // unique: true, // can NOT be unique, if we are using soft-deleted users; controller must deal with uniqueness
            columnType: 'varchar(191)' // 191 is the max length to safely use the utf8mb4 varchar.
        },

        firstName: {
            type: 'string',
            allowNull: true,
            columnType: 'varchar(70)'
        },

        lastName: {
            type: 'string',
            allowNull: true,
            columnType: 'varchar(70)'
        },

        password: {
            type: 'string',
            allowNull: true,
            columnType: 'varchar(191)', // 191 is the max length to safely use the utf8mb4 varchar.
            // see: https://sailsjs.com/documentation/reference/waterline-orm/queries/decrypt
            // You will need to "decrypt" the user object before you can check if the password is valid.
            // encrypt: true // currently, does not work as intended, as password is encrypted before we can hash it
        },

        verificationKey: { // placeholder for something like email verification
            type: 'string',
            allowNull: true,
            columnType: 'varchar(191)' // 191 is the max length to safely use the utf8mb4 varchar.
        },

        avatar: {
            type: 'string',
            isURL: true,
            columnType: 'varchar(191)' // 191 is the max length to safely use the utf8mb4 varchar.
        },

        isGravatar: {
            type: 'boolean',
            defaultsTo: true
        },

        deletedBy: {
            model: 'user'
        },

        deletedAt: {
            type: 'ref',
            columnType: 'datetime'
        },

        createdBy: {
            model: 'user'
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

    customToJSON: function() { // DO NOT use => function
        // This will be run by the "keep-models-safe" helper.
        return _.omit(this, [
            'password',
            'verificationKey'
        ]);
    },

    doPasswordsMatch: (raw, hashed) => {
        if (!raw || !hashed) {
            throw new Error('Both "raw" and "hashed" passwords are required.');
        }

        const hashBuffer = Buffer.from(hashed, 'base64');

        return scrypt.verify(hashBuffer, raw).then((isAMatch) => isAMatch);
    },

    fullName: (user) => {
        /* istanbul ignore if */
        if (!user.firstName) {
            throw new Error('User has no firstName attribute.');
        }

        /* istanbul ignore if */
        if (!user.lastName) {
            throw new Error('User has no lastName attribute.');
        }

        return user.firstName + ' ' + user.lastName;
    },

    beforeCreate: async function(user, next) {
        const email = user.email.toLowerCase().trim();

        user.id = sails.helpers.generateUuid();
        user.email = email;
        user.avatar = getGravatarUrl(email);
        user.firstName = forceUppercaseOnFirst(user.firstName);
        user.lastName = forceUppercaseOnFirst(user.lastName);
        user.password = await updatePassword(user.password);

        return next();
    },

    beforeUpdate: async function(user, next) {
        if (user.email && user.email.trim().length) {
            const email = user.email.toLowerCase().trim();

            user.email = email;
            user.avatar = getGravatarUrl(email);
        }

        if (user.firstName && user.firstName.trim().length) {
            user.firstName = forceUppercaseOnFirst(user.firstName.trim());
        }

        if (user.lastName && user.lastName.trim().length) {
            user.lastName = forceUppercaseOnFirst(user.lastName.trim());
        }

        if (user.password && user.password !== '' && user.password.length > 7) {
            user.password = await updatePassword(user.password.trim());
        }

        return next();
    }
};
