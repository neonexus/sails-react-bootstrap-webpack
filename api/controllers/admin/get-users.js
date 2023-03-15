module.exports = {
    friendlyName: 'Get Users',

    description: 'Get paginated list of users',

    inputs: {
        page: {
            description: 'The page number to return',
            type: 'number',
            defaultsTo: 1,
            min: 1
        },

        limit: {
            description: 'The amount of users to return',
            type: 'number',
            defaultsTo: 25,
            min: 1,
            max: 500
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

    fn: async (inputs, exits) => {
        const query = sails.helpers.paginateForQuery.with({
            limit: inputs.limit,
            page: inputs.page
        });

        let out = await sails.helpers.paginateForJson.with({
            model: sails.models.user,
            // This is the object that will contain the pagination info.
            objToWrap: {users: []},
            query
        });

        // We assign the users to the object afterward, so we can run our safety checks.
        // Otherwise, if we were to put the users object into "objToWrap", they would be transformed,
        // and the "customToJSON" feature would no longer work, and hashed passwords would leak.
        out.users = await sails.models.user.find(_.omit(query, ['page']));

        return exits.ok(out);
    }
};
