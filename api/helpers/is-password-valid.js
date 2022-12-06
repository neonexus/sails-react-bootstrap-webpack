const sha1 = require('sha1');
const superagent = require('superagent');

module.exports = {
    friendlyName: 'Is password valid',

    description: 'Does the provided password conform to the given standards? Either returns true, or an array of errors. Also checks the PwndPasswords API.',

    inputs: {
        password: {
            type: 'string',
            required: true
        },

        skipPwned: {
            type: 'boolean',
            defaultsTo: false
        },

        user: {
            type: 'ref'
        }
    },

    fn: function(inputs, exits) {
        let errors = [],
            isPassPhrase = false;

        if (inputs.password.length < 7) {
            errors.push('Password must be at least 7 characters');
        }

        if (inputs.password.length > 70) {
            // this 70-character limit is not arbitrary, it is the max size of MySQL utf8mb4 encoding
            // (71 characters balloons past the 191-character limit of utf8mb4 varchar columns after hashing)
            errors.push('WOW. Password length is TOO good. Max is 70 characters. Sorry.');
        }

        if (inputs.password.length >= 20 && inputs.password.indexOf(' ') > 0) { // I am a teapot, short and stout
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
            if (sails.config.security.checkPwnedPasswords && !inputs.skipPwned) {
                const sha1pass = sha1(inputs.password).toUpperCase();
                const passChunk1 = sha1pass.substring(0, 5);
                const passChunk2 = sha1pass.substring(5);

                superagent.get('https://api.pwnedpasswords.com/range/' + passChunk1).end((err, res) => {
                    /* istanbul ignore if */
                    if (err) {
                        console.error(err);

                        return exits.success(err);
                    }

                    if (res.text && res.text.length) {
                        const chunks = res.text.split('\r\n');
                        const matches = chunks.filter(s => s.includes(passChunk2));

                        if (matches.length) {
                            const bits = matches[0].split(':');

                            return exits.success(
                                ['Provided password has been found in ' + bits[1] + ' known security breaches. Please choose a new one for safety. We HIGHLY recommend using a password manager!']
                            );
                        }

                        return exits.success(true);
                    }

                    /* istanbul ignore next */
                    return exits.success(['Unknown internal error']);
                });
            } else {
                return exits.success(true);
            }
        } else {
            return exits.success(errors);
        }
    }
};

