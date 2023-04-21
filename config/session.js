/**
 * Session Configuration
 * (sails.config.session)
 *
 * Use the settings below to configure session integration in your app.
 * (for additional recommended settings, see `config/env/production.js`)
 *
 * For all available options, see:
 * https://sailsjs.com/config/session
 */

module.exports.session = {

    /***************************************************************************
     *                                                                          *
     * Session secret is automatically generated when your new app is created   *
     * Replace at your own risk in production-- you will invalidate the cookies *
     * of your users, forcing them to log in again.                             *
     *                                                                          *
     ***************************************************************************/
    // sails run generate:token
    secret: '44b22a25bad8f610e2a378b24a21d5aa6234ef5e',

    name: 'myapp-session',

    /***************************************************************************
     *                                                                          *
     * Customize when built-in session support will be skipped.                 *
     *                                                                          *
     * (Useful for performance tuning; particularly to avoid wasting cycles on  *
     * session management when responding to simple requests for static assets, *
     * like images or stylesheets.)                                             *
     *                                                                          *
     * https://sailsjs.com/config/session                                       *
     *                                                                          *
     ***************************************************************************/

    // We are using custom session handling, and this does not apply.

    // isSessionDisabled: function(req) {
    //     return !!req.path.match(req._sails.LOOKS_LIKE_ASSET_RX);
    // },

    /************************************************************************************************
     *                                                                                              *
     * This is a custom configuration option, used to set when sessions expire in the datastore.    *
     * If a user is active, the `expiresAt` will be updated to prevent accidental logouts.          *
     *                                                                                              *
     ************************************************************************************************/
    expiresAt: {
        amount: 30,
        unit: 'days'
    },

    cookie: {
        // If all cookies should be HTTPs only.
        secure: false,
        // This age is when we choose not to use "session" cookies, and want max-age instead.
        maxAge: 1000 * 60 * 60 * 24 * 7  // 1 week
    }
};
