module.exports = {
    friendlyName: 'Keep Model Safe',

    description: 'Enforce custom .toJSON() is called recursively.',

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
        const dataCopy = _.merge({}, inputs.data);

        // force all objects to their JSON formats, if it has said function
        // this prevents accidental leaking of sensitive data, by utilizing customToJSON on models
        (function findTheJson(data) {
            _.forEach(data, (val, key) => {
                if (_.isObject(val)) {
                    return findTheJson(val);
                }

                if (val && val.toJSON && typeof val.toJSON === 'function') {
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
