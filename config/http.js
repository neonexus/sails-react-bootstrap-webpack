/**
 * HTTP Server Settings
 * (sails.config.http)
 *
 * Configuration for the underlying HTTP server in Sails.
 * (for additional recommended settings, see `config/env/production.js`)
 *
 * For more information on configuration, check out:
 * https://sailsjs.com/config/http
 */

module.exports.http = {

    /****************************************************************************
     *                                                                           *
     * Sails/Express middleware to run for every HTTP request.                   *
     * (Only applies to HTTP requests -- not virtual WebSocket requests.)        *
     *                                                                           *
     * https://sailsjs.com/documentation/concepts/middleware                     *
     *                                                                           *
     ****************************************************************************/

    middleware: {

        /***************************************************************************
         *                                                                          *
         * The order in which middleware should be run for HTTP requests.           *
         * (This Sails app's routes are handled by the "router" middleware below.)  *
         *                                                                          *
         ***************************************************************************/

        order: [
            'cookieParser',
            // 'session', // we are using our own custom handling of sessions
            'bodyParser',
            'compress',
            'customPoweredBy',
            'router', // custom Sails middleware handler (config/routes.js)
            'assetLog', // the request wasn't caught by any of the above middleware, must be assets
            'www', // default hook to serve static files
            'favicon' // default hook to serve favicon
        ],

        customPoweredBy: (req, res, next) => {
            // set our own custom "X-Powered-By" header
            res.set('X-Powered-By', 'Awesome Sauce');

            return next();
        },

        assetLog: async (req, res, next) => {
            await sails.helpers.finalizeRequestLog(req, res, {body: 'asset likely'});

            return next();
        }

        /***************************************************************************
         *                                                                          *
         * The body parser that will handle incoming multipart HTTP requests.       *
         *                                                                          *
         * https://sailsjs.com/config/http#?customizing-the-body-parser             *
         *                                                                          *
         ***************************************************************************/

        // bodyParser: (function _configureBodyParser(){
        //   var skipper = require('skipper');
        //   var middlewareFn = skipper({ strict: true });
        //   return middlewareFn;
        // })(),

    },

    /****************************************************************************************
     *                                                                                      *
     * These are custom configuration options, designed so the `keep-models-safe` helper    *
     * can standardize date formats for you. This also means you can customize how you      *
     * see date data from your API on your local machine, if you were so inclined.          *
     *                                                                                      *
     ****************************************************************************************/
    dateOutput: {
        format: '', // empty string defaults to ISO-8601
        tz: 'UTC' // timezone coercion
    }
};
