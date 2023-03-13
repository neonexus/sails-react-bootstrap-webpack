/**
 * Paginate for Query
 *
 * @function sails.helpers.paginateForQuery
 * @param {Number} [page=1] - Page number.
 * @param {Number} [limit=25] - The page limit.
 * @param {String|String[]} [sort="createdAt DESC"] - Either a string, or an array of strings, of column names to sort and direction.
 * @param {Object} [where=null] - The criteria to limit the search by.
 *
 * @returns {Object} An object to send as the `.find()` input.
 */
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
            page: inputs.page, // this is used to pass to other pagination options; is ignored by Waterline / Sails
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
