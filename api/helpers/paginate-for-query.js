module.exports = {
    sync: true, // is a synchronous function

    friendlyName: 'Paginate for query',

    description: 'Takes in pagination options and a query, then returns a query for .find() calls.',

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
            type: 'ref',
            defaultsTo: 'createdAt DESC',
            custom: (val) => { // custom validator
                return _.isString(val) || _.isArray(val);
            }
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
            baseObj.where = {deletedAt: null}; // prevent soft-deleted records from showing in the collection
        } else if (baseObj.where.sort && baseObj.sort === 'createdAt DESC') { // if sort is the default, and the where contains a sort, use the where.sort, otherwise, use inputs.sort
            baseObj.sort = baseObj.where.sort;
            delete baseObj.where.sort;
        }

        return exits.success(baseObj);
    }
};
