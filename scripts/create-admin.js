module.exports = {
    friendlyName: 'Create Admin User',

    description: 'Create an admin user via `sails run create-admin`. Only 1 admin user can be created this way; the API must be used otherwise.',

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
            description: 'Success message if admin user was created.'
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
        const foundUsers = await User.count({role: 'admin', deletedAt: null});

        if (foundUsers) {
            return exits.canNotBeUsed();
        }

        const passwordErrors = sails.helpers.isPasswordValid(inputs.password);

        if (passwordErrors !== true) {
            return exits.badPassword(passwordErrors);
        }

        const foundUser = await User.findOne({email: inputs.email, deletedAt: null});

        if (foundUser) {
            return exits.userExists(foundUser.toJSON());
        }

        const newUser = await User.create({
            id: 'c', // required, but auto-generated
            email: inputs.email,
            password: inputs.password,
            firstName: inputs.firstName,
            lastName: inputs.lastName,
            role: 'admin'
        }).fetch();

        return exits.success(`Admin user ${inputs.firstName} ${inputs.lastName} (${inputs.email}) created; ID: ${newUser.id}.`);
    }
};
