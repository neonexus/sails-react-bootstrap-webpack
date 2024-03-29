/**
 * This file is used to configure the `ngrok.js` script.
 *
 * See: https://github.com/neonexus/sails-react-bootstrap-webpack#working-with-ngrok
 */

module.exports.ngrok = {
    // Set an HTTP basic-auth wall for the app. Optional.
    auth: process.env.NGROK_BASIC || undefined, // Use a string of 'username:password' style (raw password)

    // Default Ngrok authtoken, to tie to your account.
    // https://dashboard.ngrok.com/get-started/your-authtoken
    token: process.env.NGROK_AUTHTOKEN || process.env.NGROK_TOKEN || undefined, // NEVER store PRODUCTION secrets in Git-controlled files!

    // Whether to build assets by default or not.
    buildAssets: true,

    // The static domain to use for the Ngrok tunnel. Something like: 'running-grey-gazelle.ngrok-free.app'. Optional; Ngrok can generate a single-use random domain.
    domain: process.env.NGROK_DOMAIN || undefined,

    // The default region for the Ngrok tunnel. Optional.
    region: process.env.NGROK_REGION || undefined,

    // The default port to start Sails for the Ngrok tunnel.
    port: process.env.PORT || 4242 // Use 4242 instead of 1337, so we can run 2 instances if we want.
};
