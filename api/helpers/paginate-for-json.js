/**
 * Paginate for JSON
 *
 * @function sails.helpers.paginateForJson
 * @param {JSON} query - This should be the value returned from `sails.helpers.paginateForQuery()`.
 * @param {Object} model - A reference to the Sails model that was paginated, like `User` or `sails.model.user`.
 * @param {Object} objToWrap - The object to be modified with pagination info, to return to the end-user.
 *
 * @returns {Object} A modified copy of the `objToWrap` input, which includes pagination data.
 */
module.exports = {
    friendlyName: 'Paginate for JSON',

    description: 'A pagination helper to modify output with pagination data.',

    inputs: {
        query: {
            description: 'This should be the value returned from sails.helpers.paginateForQuery().',
            type: 'json',
            required: true,
            // this is a custom validator, which returns true or false
            custom: (thisQuery) => (
                _.isObject(thisQuery) && _.isNumber(thisQuery.limit) &&
                _.isNumber(thisQuery.page) && (_.isString(thisQuery.sort) || _.isArray(thisQuery.sort)) &&
                _.isObject(thisQuery.where)
            )
        },

        model: {
            description: 'A reference to the Sails model that was paginated, like User or sails.model.user.',
            type: 'ref',
            required: true
        },

        objToWrap: {
            description: 'The object to be modified with pagination info, to return to the end-user.',
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

            inputs.objToWrap.totalFound = totalCount;
            inputs.objToWrap.totalPages = Math.ceil(totalCount / limit);
            inputs.objToWrap.limit = limit;
            inputs.objToWrap.page = page;
            inputs.objToWrap.sort = sort;

            return exits.success(inputs.objToWrap);
        });
    }
};
