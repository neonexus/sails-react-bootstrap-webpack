/**
 * Built-in Log Configuration
 * (sails.config.log)
 *
 * Configure the log level for your app, as well as the transport
 * (Underneath the covers, Sails uses Winston for logging, which
 * allows for some pretty neat custom transports/adapters for log messages)
 *
 * For more information on the Sails logger, check out:
 * https://sailsjs.com/docs/concepts/logging
 */

module.exports.log = {

    /***************************************************************************
     *                                                                          *
     * Valid `level` configs: i.e. the minimum log level to capture with        *
     * sails.log.*()                                                            *
     *                                                                          *
     * The order of precedence for log levels from lowest to highest is:        *
     * silly, verbose, info, debug, warn, error                                 *
     *                                                                          *
     * You may also set the level to "silent" to suppress all logs.             *
     *                                                                          *
     ***************************************************************************/

    level: 'info',


    /********************************************************************
     *                                                                  *
     * This is a custom configuration option, for the request logger    *
     * hook (api/hook/request-logger.js) and the finalize request log   *
     * helper (api/helpers/finalize-request-log.js).                    *
     *                                                                  *
     * When enabled, the hook and helper will automatically log all     *
     * incoming requests using the RequestLog model.                    *
     *                                                                  *
     ********************************************************************/

    captureRequests: true,

    /********************************************************************
     * This will ignore logging of asset requests                       *
     * (things like `.js`, `.css`, etc.), when capturing request data.  *
     *                                                                  *
     * Turning this off could make request logs balloon very quickly.   *
     ********************************************************************/
    ignoreAssets: true
};
