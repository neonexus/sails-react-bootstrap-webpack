module.exports = {
    friendlyName: 'Create Admin User',

    description: 'Create an admin user.',

    inputs: {
        email: {
            type: 'string',
            isEmail: true,
            required: true
        },

        password: {
            type: 'string',
            required: true
        },

        firstName: {
            type: 'string',
            required: true
        },

        lastName: {
            type: 'string',
            required: true
        }
    },

    exits: {
        success: {
            description: 'Success. Admin user was created!'
        },
        badPassword: {
            description: 'Password does not meet security standards.'
        },
        userExists: {
            description: 'Email is already in-use.'
        },
        canNotBeUsed: {
            description: 'An active admin account already exists. Must use API to create new users.'
        }
    },

    fn: async (inputs, exits) => {
        const foundUsers = await sails.models.user.count({role: 'admin', deletedAt: null});

        if (foundUsers) {
            return exits.canNotBeUsed();
        }

        const passwordErrors = await sails.helpers.isPasswordValid(inputs.password);
        // const passwordErrors = await sails.helpers.isPasswordValid(inputs.password, true); // use this to disable the check with PwnedPasswords.com
        // const passwordErrors = await sails.helpers.isPasswordValid.with({password: inputs.password, skipPwned: true}); // the same as the line above

        if (passwordErrors !== true) {
            return exits.badPassword(passwordErrors);
        }

        const foundUser = await sails.models.user.findOne({email: inputs.email, deletedAt: null});

        if (foundUser) {
            return exits.userExists(foundUser.toJSON());
        }

        const newUser = await sails.models.user.create({
            id: 'c', // required, but auto-generated
            email: inputs.email,
            password: inputs.password,
            firstName: inputs.firstName,
            lastName: inputs.lastName,
            role: 'admin'
        }).fetch();

        return exits.success(`Admin user ${inputs.firstName} ${inputs.lastName} (${inputs.email}) created; ID: ${newUser.id}`);
    }
};
