const {v4: uuidv4} = require('uuid');

module.exports = {
    friendlyName: 'Generate UUID',

    description: 'Generate a v4 UUID.',

    sync: true, // not async

    fn: (inputs, exits) => {
        return exits.success(uuidv4());
    }
};
