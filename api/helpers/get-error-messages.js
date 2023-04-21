/**
 * Get Error Messages
 *
 * @function sails.helpers.getErrorMessages
 * @param {Object} err - The error object to smash down into an array of strings.
 *
 * @returns {Array} An array of crunched-down errors.
 */
module.exports = {
    friendlyName: 'Get Error Messages',

    description: 'This condenses down ugly error syntax into a flat array.',

    sync: true,

    inputs: {
        err: {
            type: 'ref'
        }
    },

    exits: {},

    fn: (inputs, exits) => {
        let errors = [],
            err = inputs.err;

        if (err) {
            if (err.problems) {
                errors = err.problems;
            } else if (err.invalidAttributes && err.Errors) {
                err = _.merge({}, err.invalidAttributes, err.Errors);

                _.forEach(err, (error) => {
                    error.forEach((errMessage) => {
                        errors.push(errMessage.message);
                    });
                });
            } else if (err.invalidAttributes) {
                _.forEach(err.invalidAttributes, (error) => {
                    error.forEach((errMessage) => {
                        errors.push(errMessage.message);
                    });
                });
            } else if (err.Errors) {
                _.forEach(err.Errors, (error) => {
                    error.forEach((errMessage) => {
                        errors.push(errMessage.message);
                    });
                });
            } else if (err.message) {
                errors = [err.message];
            } else {
                if (typeof err === 'string') {
                    errors = [err];
                } else {
                    errors = err;
                }
            }
        }

        return exits.success(errors);
    }

};

