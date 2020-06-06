module.exports = {

    friendlyName: 'Simplify errors',

    description: '',

    inputs: {
        err: {
            type: 'ref'
        }
    },

    exits: {},

    fn: async function(inputs, exits){
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

