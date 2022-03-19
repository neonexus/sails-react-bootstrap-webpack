const moment = require('moment-timezone');

module.exports = {
    friendlyName: 'Delete User',

    description: 'Delete a user, given its ID',

    inputs: {
        id: {
            type: 'string',
            required: true,
            isUUID: true
        }
    },

    exits: {
        ok: {
            responseType: 'ok'
        },
        badRequest: {
            responseType: 'badRequest'
        },
        serverError: {
            responseType: 'serverError'
        }
    },

    fn: async (inputs, exits, env) => {
        const foundUser = await sails.models.user.findOne({id: inputs.id, deletedAt: null});

        if (!foundUser) {
            return exits.badRequest('User does not exist');
        }

        await sails.models.session.destroy({user: foundUser.id}); // force logout any active sessions user might have

        await sails.models.user.update({id: foundUser.id}).set(_.merge({}, foundUser, {
            deletedAt: moment.tz(sails.config.datastores.default.timezone).toDate(),
            deletedBy: env.req.session.user.id
        }));

        return exits.ok();
    }
};
