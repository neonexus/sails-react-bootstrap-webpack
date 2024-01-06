/**
 * This is the config file for the `sails-hook-autoreload` package.
 * THIS IS NOT PRE-INSTALLED! You must manually install it: npm i sails-hook-autoreload --save-dev
 *
 * When you make changes to your API files, the hook will reload the server (without re-running the bootstrap).
 *
 * For more info, see: https://www.npmjs.com/package/sails-hook-autoreload
 */

module.exports.autoreload = {
    active: true,

    dirs: [
        'api/controllers',
        'api/helpers',
        'api/hooks',
        'api/models',
        'api/policies',
        'api/responses',
        'config'
    ],

    ignored: [
        '**.md'
    ],

    overrideMigrateSetting: false
};
