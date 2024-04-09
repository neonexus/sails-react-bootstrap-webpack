#!/usr/bin/env node

/**
 * app.js
 *
 * Use `app.js` to run your app without `sails lift`.
 * To start the server, run: `node app.js`.
 * Or directly: `./app.js`.
 *
 * This is handy in situations where the sails CLI is not relevant or useful,
 * such as when you deploy to a server, or a PaaS like Heroku.
 *
 * For example:
 *   => `node app.js`
 *   => `npm start`
 *   => `forever start app.js`
 *   => `node debug app.js`
 *
 * The same command-line arguments and env vars are supported, e.g.:
 * `NODE_ENV=production node app.js --port=80 --verbose`
 *
 * For more information see:
 *   https://sailsjs.com/anatomy/app.js
 */


// Ensure we're in the project directory, so cwd-relative paths work as expected
// no matter where we actually lift from.
// > Note: This is not required in order to lift, but it is a convenient default.
process.chdir(__dirname);


// Attempt to import `sails` dependency, as well as `rc` (for loading `.sailsrc` files).
let sails;
let rc;

try {
    sails = require('sails');
    rc = require('sails/accessible/rc');
} catch (err) {
    console.error('Encountered an error when attempting to require(\'sails\'):');
    console.error(err.stack);
    console.error('--');
    console.error('Did you run `npm install`?');
}//-•

// Small safety trigger, to help prevent use of `sails lift`, as that circumvents our custom error handlers / configuration overrides.
process.env.NOT_FROM_SAILS_LIFT = 'true'; // Can't use booleans with environment variables... That's just silly!

// Start server
sails.lift(rc('sails'), (err, server) => {
    if (err) {
        switch (err.code) {
            case 'E_INVALID_DATA_ENCRYPTION_KEYS':
                return console.error(
                    '\nSails is complaining about bad DEK\'s (Data Encryption Keys).'
                    + '\nThis is likely caused by running as PRODUCTION without a DATA_ENCRYPTION_KEY environment variable set.'
                    + '\n\nThe DEK ID that is being reported as invalid:   ' + err.dekId
                    + '\n\nTo generate a new DEK:    npm run generate:dek\n'
                );
            default:
                return console.error(err);
        }
    }

    console.log('');
    console.log(server.config.baseUrl);
    console.log('');
});
