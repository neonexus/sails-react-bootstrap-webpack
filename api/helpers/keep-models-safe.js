const moment = require('moment-timezone');

/**
 * Keep Models Safe
 *
 * @function sails.helpers.keepModelsSafe
 * @param {*} data - An object to traverse recursively, running .toJSON() when possible.
 *
 * @returns {*}
 */
module.exports = {
    friendlyName: 'Keep Models Safe',

    description: 'Enforce custom .toJSON(), called recursively on the input data object to prevent data leaking to outside world.',

    sync: true, // function is not async

    inputs: {
        data: {
            type: 'ref',
            required: true
        }
    },

    exits: {
        success: {}
    },

    fn: (inputs, exits) => {
        /* istanbul ignore if */
        if (!inputs.data) {
            // If it's falsy, then skip everything else.
            return exits.success(inputs.data);
        }

        // Force all objects to their JSON formats, if it has .toJSON() function.
        // This prevents accidental leaking of sensitive data, by utilizing .customToJSON() in model definitions.
        (function findTheJson(data) {
            _.forEach(data, (val, key) => {
                // If it's a date, use Moment.js to standardize output.
                if (val instanceof Date) {
                    data[key] = moment(val).tz(sails.config.http.dateOutput.tz).format(sails.config.http.dateOutput.format);

                    return data[key];
                }

                // If this is a moment.js object, force it to .format().
                if (val && val._isAMomentObject && val._isAMomentObject === true) {
                    data[key] = val.tz(sails.config.http.dateOutput.tz).format(sails.config.http.dateOutput.format);

                    return data[key];
                }

                if (val && val.toJSON && typeof val.toJSON === 'function') {
                    // This will call customToJSON function in models.
                    // See models/user.js for an example.
                    data[key] = val.toJSON();

                    return data[key];
                }

                if (_.isObject(val)) {
                    return findTheJson(val);
                }
            });
        })(inputs.data);

        if (inputs.data && inputs.data.toJSON && typeof inputs.data.toJSON === 'function') {
            // This will call customToJSON function in models.
            // See models/user.js for an example.
            inputs.data = inputs.data.toJSON();

            return exits.success(inputs.data);
        }

        return exits.success(inputs.data);
    }
};
