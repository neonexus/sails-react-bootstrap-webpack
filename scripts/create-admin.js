const prompts = require('prompts');

module.exports = {
    friendlyName: 'Create Admin User',

    description: 'Create an admin user.',

    inputs: {
        // email: {
        //     type: 'string',
        //     isEmail: true,
        //     required: true
        // },
        //
        // password: {
        //     type: 'string',
        //     required: true
        // },
        //
        // firstName: {
        //     type: 'string',
        //     required: true
        // },
        //
        // lastName: {
        //     type: 'string',
        //     required: true
        // }
    },

    exits: {
        success: {
            description: 'Success. Admin user was created!'
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

        const answers = await prompts([
            {
                message: 'Email Address',
                name: 'email',
                type: 'text',
                validate: (val) => {
                    if (!val || !val.length || !/.+?@.+?\..+?/.test(val)) {
                        return 'This is required.';
                    }

                    return true;
                }
            }, {
                message: 'Password',
                name: 'password',
                type: 'password',
                validate: async (val) => {
                    if (!val || !val.length) {
                        return 'This is required.';
                    }

                    let passwordErrors = await sails.helpers.isPasswordValid(val, true);

                    if (passwordErrors !== true) {
                        return passwordErrors.join(' ');
                    }

                    // This time, let's check with PwnedPasswords.com API.
                    passwordErrors = await sails.helpers.isPasswordValid(val, false);

                    if (passwordErrors !== true) {
                        return passwordErrors[0];
                    }

                    return true;
                }
            }, {
                message: 'First Name',
                name: 'firstName',
                type: 'text',
                validate: (val) => {
                    if (!val || !val.length) {
                        return 'This is required.';
                    }

                    return true;
                }
            }, {
                message: 'Last Name',
                name: 'lastName',
                type: 'text',
                validate: (val) => {
                    if (!val || !val.length) {
                        return 'This is required.';
                    }

                    return true;
                }
            }
        ], {
            onCancel: () => {
                console.error('Canceled admin creation.');

                return process.exit(1);
            }
        });

        const foundUser = await sails.models.user.findOne({email: answers.email, deletedAt: null});

        if (foundUser) {
            return exits.userExists(foundUser.toJSON());
        }

        const newUser = await sails.models.user.create({
            id: 'c', // required, but auto-generated
            email: answers.email,
            password: answers.password,
            firstName: answers.firstName,
            lastName: answers.lastName,
            role: 'admin'
        }).fetch();

        return exits.success(`\nAdmin user ${answers.firstName} ${answers.lastName} (${answers.email}) created!\nID: ${newUser.id}\n`);
    }
};
