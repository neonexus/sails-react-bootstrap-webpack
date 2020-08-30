module.exports = {
    friendlyName: 'Is password valid',

    description: 'Does the provided password conform to the given standards?',

    inputs: {
        password: {
            type: 'string',
            required: true
        },

        user: {
            type: 'ref'
        }
    },

    sync: true,

    fn: function(inputs, exits) {
        let errors = [],
            isPassPhrase = false;

        if (inputs.password.length < 7) {
            errors.push('Password must be at least 7 characters');
        }

        if (inputs.password.length > 70) {
            errors.push('WOW. Password length is TOO good. Max is 70 characters. Sorry.');
        }

        if (inputs.password.length >= 20) {
            isPassPhrase = true;
        }

        if (inputs.user) {
            if (inputs.user.email && inputs.password.indexOf(inputs.user.email) >= 0) {
                errors.push('Password can not contain your email address');
            }

            if (inputs.user.firstName && inputs.password.indexOf(inputs.user.firstName) >= 0) {
                errors.push('Password can not contain your first name');
            }

            if (inputs.user.lastName && inputs.password.indexOf(inputs.user.lastName) >= 0) {
                errors.push('Password can not contain your last name');
            }
        }

        if (/(.)\1{2,}/.test(inputs.password)) {
            errors.push('Password can not contain 3 or more repeated characters');
        }

        if (!isPassPhrase) {
            if (!/(?=[a-z])/.test(inputs.password)) {
                errors.push('Password must have at least 1 lowercase character');
            }

            if (!/(?=[A-Z])/.test(inputs.password)) {
                errors.push('Password must have at least 1 uppercase character');
            }

            if (!/(?=[0-9])/.test(inputs.password)) {
                errors.push('Password must have at least 1 digit');
            }

            if (!/(?=[^a-zA-Z0-9])/.test(inputs.password)) {
                errors.push('Password must have at least 1 special character');
            }
        }

        if (!errors.length) {
            return exits.success(true);
        }

        return exits.success(errors);
    }
};

