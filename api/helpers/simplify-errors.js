/**
 * Simplify Errors
 *
 * @function sails.helpers.simplifyErrors
 * @param {Object} err - The error object to smash down into an array of strings.
 *
 * @returns {Array} An array of crunched-down errors.
 */
module.exports = {
    friendlyName: 'Simplify errors',

    description: 'This helper smashes down error messages, into a single object.',

    sync: true, // not async

    inputs: {
        err: {
            type: 'ref'
        }
    },

    exits: {},

    fn: (inputs, exits) => {
        let errors = {},
            err = inputs.err;

        if (err.invalidAttributes && err.Errors) {
            errors = _.merge({}, err.invalidAttributes, err.Errors);
        } else if (err.invalidAttributes) {
            errors = err.invalidAttributes;
        } else if (err.Errors) {
            errors = err.Errors;
        } else {
            if (typeof err === 'string') {
                errors = {
                    Unknown: [
                        {
                            rule: 'unknown',
                            message: err
                        }
                    ]
                };
            } else {
                errors = err;
            }
        }

        return exits.success(errors);
    }

};

