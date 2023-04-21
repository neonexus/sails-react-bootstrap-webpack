/**
 * Blueprint API Configuration
 * (sails.config.blueprints)
 *
 * For background on the blueprint API in Sails, check out:
 * https://sailsjs.com/docs/reference/blueprint-api
 *
 * For details and more available options, see:
 * https://sailsjs.com/config/blueprints
 */

module.exports.blueprints = {

    /***************************************************************************
     *                                                                          *
     * Automatically expose implicit routes for every action in your app?       *
     *                                                                          *
     ***************************************************************************/

    // This is shut-off by default, to encourage explicit API design, to help prevent confusion in the future.
    actions: false,


    /***************************************************************************
     *                                                                          *
     * Automatically expose RESTful routes for your models?                     *
     *                                                                          *
     ***************************************************************************/

    // This is shut-off by default, to encourage explicit API design, to help prevent confusion in the future.
    rest: false,


    /***************************************************************************
     *                                                                          *
     * Automatically expose CRUD "shortcut" routes to GET requests?             *
     * (These are enabled by default in development only.)                      *
     *                                                                          *
     ***************************************************************************/

    // This is shut-off by default, to encourage explicit API design, to help prevent confusion in the future.
    shortcuts: false

};
