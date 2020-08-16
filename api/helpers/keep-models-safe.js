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
        const dataCopy = _.merge({}, inputs.data); // don't modify the object given

        // Force all objects to their JSON formats, if it has .toJSON() function.
        // This prevents accidental leaking of sensitive data, by utilizing .customToJSON() in model definitions.
        (function findTheJson(data) {
            _.forEach(data, (val, key) => {
                if (_.isObject(val)) {
                    return findTheJson(val);
                }

                if (val && val.toJSON && typeof val.toJSON === 'function') {
                    // If this is a moment.js object, force it to .format() instead of .toJSON().
                    if (val.toDate && typeof val.toDate === 'function' && typeof val.format === 'function') {
                        data[key] = val.format();
                    } else {
                        data[key] = val.toJSON();
                    }
                }
            });
        })(dataCopy);

        return exits.success(dataCopy);
    }
};
