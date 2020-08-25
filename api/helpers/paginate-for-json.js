module.exports = {
    friendlyName: 'Paginate for JSON',

    description: 'Expects the query from sails.helpers.paginateForQuery().',

    inputs: {
        query: {
            description: 'This should be the value returned from sails.helpers.paginateForQuery()',
            type: 'json',
            required: true,
            // this is a custom validator, which returns true or false
            custom: (thisQuery) => (
                _.isObject(thisQuery) && _.isNumber(thisQuery.limit) &&
                _.isNumber(thisQuery.page) && _.isString(thisQuery.sort) &&
                _.isObject(thisQuery.where)
            )
        },

        model: { // must be a reference to a Sails model, like User or sails.models.user
            type: 'ref',
            required: true
        },

        objToWrap: { // the response to be given to the end-user
            type: 'json',
            required: true
        }
    },

    exits: {},

    fn: (inputs, exits) => {
        let query = inputs.query;

        const limit = query.limit;
        const page = query.page;
        const sort = query.sort;

        delete query.limit;
        delete query.page;
        delete query.skip;
        delete query.sort;

        inputs.model.count(query).exec((err, totalCount) => {
            if (err) {
                throw new Error(err);
            }

            let objToWrap = _.merge({}, inputs.objToWrap); // copy the object

            objToWrap.totalFound = totalCount;
            objToWrap.totalPages = Math.ceil(totalCount / limit);
            objToWrap.limit = limit;
            objToWrap.page = page;
            objToWrap.sort = sort;

            return exits.success(objToWrap);
        });
    }
};
