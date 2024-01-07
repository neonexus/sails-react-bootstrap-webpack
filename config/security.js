/**
 * Security Settings
 * (sails.config.security)
 *
 * These settings affect aspects of your app's security, such
 * as how it deals with cross-origin requests (CORS) and which
 * routes require a CSRF token to be included with the request.
 *
 * For an overview of how Sails handles security, see:
 * https://sailsjs.com/documentation/concepts/security
 *
 * For additional options and more information, see:
 * https://sailsjs.com/config/security
 */

module.exports.security = {

    /***************************************************************************
     *                                                                          *
     * CORS is like a more modern version of JSONP-- it allows your application *
     * to circumvent browsers' same-origin policy, so that the responses from   *
     * your Sails app hosted on one domain (e.g. example.com) can be received   *
     * in the client-side JavaScript code from a page you trust hosted on _some *
     * other_ domain (e.g. trustedsite.net).                                    *
     *                                                                          *
     * For additional options and more information, see:                        *
     * https://sailsjs.com/docs/concepts/security/cors                          *
     *                                                                          *
     ***************************************************************************/

    cors: {
        allRoutes: true,
        // allowOrigins: '*', // no longer allowed cross-origin with websockets
        allowRequestHeaders: 'content-type,x-csrf-token',
        allowOrigins: [
            'http://localhost:8080'
        ],
        allowCredentials: true
    },


    /****************************************************************************
     *                                                                           *
     * By default, Sails' built-in CSRF protection is disabled to facilitate     *
     * rapid development.  But be warned!  If your Sails app will be accessed by *
     * web browsers, you should _always_ enable CSRF protection before deploying *
     * to production.                                                            *
     *                                                                           *
     * To enable CSRF protection, set this to `true`.                            *
     *                                                                           *
     * For more information, see:                                                *
     * https://sailsjs.com/docs/concepts/security/csrf                           *
     *                                                                           *
     ****************************************************************************/

    csrf: false, // This disables Sails' CSRF; this repo has custom CSRF behavior.
    // See the api/policies files for more.


    /********************************************************************************
     *                                                                              *
     * This is a custom config option, for the PwnedPasswords.com API Integration.  *
     * See: ../api/helpers/is-password-valid.js                                     *
     *                                                                              *
     * When enabled, sails.helpers.isPasswordValid() will check with the            *
     * PwnedPasswords.com API (v3), using a k-Anonymity model, preventing           *
     * third parties, including the PwnedPasswords.com API, from knowing            *
     * which password we are searching for.                                         *
     *                                                                              *
     * See this for more details:                                                   *
     *      https://haveibeenpwned.com/API/v3#PwnedPasswords                        *
     *                                                                              *
     ********************************************************************************/
    checkPwnedPasswords: true,

    /********************************************************************
     *                                                                  *
     * This is a custom configuration option, for the request logger    *
     * hook (api/hook/request-logger.js) and the finalize request log   *
     * helper (api/helpers/finalize-request-log.js).                    *
     *                                                                  *
     * If for some reason you need you debug sensitive info in your     *
     * request logs, you can set this to `true`. Will ALWAYS be `false` *
     * on PRODUCTION environments.                                      *
     *                                                                  *
     ********************************************************************/
    requestLogger: {
        logSensitiveData: false
    }
};
