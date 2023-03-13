module.exports = {
    friendlyName: 'Generate Token',

    description: 'Runs the generateToken helper.',

    fn: (inputs, exits) => {
        return exits.success(sails.helpers.generateToken());
    }
};
