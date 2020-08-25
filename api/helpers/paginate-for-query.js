module.exports = {
    sync: true, // is a synchronous

    friendlyName: 'Paginate for query',

    description: 'Takes in pagination options, and returns query for .find() calls.',

    inputs: {
        page: {
            type: 'number',
            defaultsTo: 1
        },
        limit: {
            type: 'number',
            defaultsTo: 25
        },
        sort: {
            type: 'string',
            defaultsTo: 'createdAt DESC'
        },
        where: {
            type: 'ref', // JavaScript reference to an object
            defaultsTo: null
        }
    },

    exits: {},

    fn: (inputs, exits) => {
        let baseObj = {
            limit: inputs.limit,
            page: inputs.page,
            skip: (inputs.page - 1) * inputs.limit,
            sort: inputs.sort,
            where: inputs.where
        };

        if (!baseObj.where) {
            baseObj.where = {deletedAt: null};
        } else if (baseObj.where.sort && baseObj.sort === 'createdAt DESC') { // if sort is the default, and the where contains a sort, use the where.sort, otherwise, use inputs.sort
            baseObj.sort = baseObj.where.sort;
            delete baseObj.where.sort;
        }

        return exits.success(baseObj);
    }
};
