module.exports = {

    friendlyName: 'Get error messages',

    description: '',

    inputs: {
        err: {
            type: 'ref'
        }
    },

    exits: {},

    fn: async function(inputs, exits){
        let errors = [],
            err = inputs.err;

        if (err) {
            if (err.invalidAttributes && err.Errors) {
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

