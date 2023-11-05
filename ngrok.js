#!/usr/bin/env node

/**
 * This is the file used to lift Sails, build assets, and start Ngrok.
 *
 * Run it via node: `node ngrok` OR `node ngrok.js`
 * Run it directly: `./ngrok.js`
 */
let ngrok;

try {
    ngrok = require('@ngrok/ngrok');
} catch {
    console.log('');
    console.log('In order to run this script, you must install `Ngrok`:');
    console.log('');
    console.log('npm i @ngrok/ngrok --save-dev');
    console.log('');

    return process.exit(1);
}

const sails = require('sails');
const rc = require('sails/accessible/rc');
const {spawn} = require('child_process');
const {existsSync} = require('fs');
const path = require('path');

let config;

// Find / use the proper config file.
try {
    let configPath = path.resolve(__dirname, 'config/local.js');

    // If local.js exists, use it...
    if (existsSync(configPath)) {
        config = require(configPath);
    } else {
        // No local.js, find our environmental configuration.
        const environment = process.env.NODE_ENV || 'development';

        switch (environment.toLowerCase()) {
            case 'dev':
            case 'development':
                configPath = path.resolve(__dirname, 'config/env/development.js');
                break;
            case 'prod':
            case 'production':
                configPath = path.resolve(__dirname, 'config/env/production.js');
                break;
            default:
                configPath = path.resolve(__dirname, 'config/env/' + environment + '.js');
                break;
        }

        if (!existsSync(configPath)) {
            return console.error(
                'ERROR! Trying to load the environment configuration from "../config/env/'
                + environment + '.js", but no such file exists. NODE_ENV="' + process.env.NODE_ENV + '".'
            );
        }

        // Now we can read our configuration.
        config = require(configPath);
    }
} catch (err) {
    console.error(err);

    return process.exit(1);
}

// Set our defaults.
config.ngrok = {
    auth: process.env.NGROK_BASIC || null,
    token: process.env.NGROK_AUTHTOKEN || process.env.NGROK_TOKEN || null,
    buildAssets: true,
    domain: process.env.NGROK_DOMAIN || null,
    port: process.env.PORT || config.port || 1337,
    region: process.env.NGROK_REGION || null
};

// Read our console config flags.
for (let i = 2; i < process.argv.length; ++i) {
    const thisFlag = process.argv[i].toLowerCase();

    if (thisFlag === 'nobuild') {
        config.ngrok.buildAssets = false;
    } else if (thisFlag.startsWith('auth=')) {
        config.ngrok.auth = process.argv[i].substring(5); // don't use the lower-cased version
    } else if (thisFlag.startsWith('domain=')) {
        config.ngrok.domain = thisFlag.substring(7);
    } else if (thisFlag.startsWith('port=')) {
        config.ngrok.port = thisFlag.substring(5);
    } else if (thisFlag.startsWith('region=')) {
        config.ngrok.region = thisFlag.substring(7);
    } else if (thisFlag.startsWith('token=')) {
        config.ngrok.token = process.argv[i].substring(6);
    }
}

ngrok.connect({
    addr: config.ngrok.port, // Point to Sails
    authtoken: config.ngrok.token,
    basic_auth: config.ngrok.auth, // eslint-disable-line
    domain: config.ngrok.domain,
    region: config.ngrok.region,
    schemes: ['HTTPS'],
}).then((listener) => {
    let origins;
    const ngrokUrl = listener.url();

    // Smaller helper function, to output the Ngrok URLs.
    function sendUrls() {
        console.log('');
        console.log('Ngrok URL: ' + ngrokUrl);
        // console.log('Ngrok Dashboard: https://dashboard.ngrok.com');
        console.log('');
    }

    // Build our assets in the background.
    if (config.ngrok.buildAssets) {
        const assetBuilderProcess = spawn('npm', ['run', 'build'], {env: {...process.env, BASE_URL: ngrokUrl}});

        assetBuilderProcess.stderr.on('data', (data) => {
            console.log('Error:');
            console.error(data);
        });

        assetBuilderProcess.on('exit', (code, signal) => {
            if (code === 0) {
                console.log('Assets successfully built!');
                sendUrls();
            } else {
                console.error('An error occurred while trying to build assets. Signal: ' + signal);

                process.exit(1);
            }
        });

        console.log('');
        console.log('Assets are being built. Starting API...');
        console.log('');
    }

    // Add the Ngrok URL to our allowed origins.
    if (config.security && config.security.cors && config.security.cors.allowOrigins) {
        origins = [...config.security.cors.allowOrigins];

        if (!config.security.cors.allowOrigins.contains(ngrokUrl)) {
            origins.push(ngrokUrl);
        }
    } else {
        origins = [ngrokUrl];
    }

    // Start Sails.
    sails.lift({
        ...rc('sails'),
        baseUrl: ngrokUrl,
        port: config.ngrok.port,
        security: {
            cors: {
                allowOrigins: origins
            }
        }
    }, (err) => {
        if (err) {
            console.error(err);

            return process.exit(1);
        }

        // Sails tends to be faster at startup than asset building...
        // Assume we are still waiting for assets (which will output URLs when finished)...
        if (config.ngrok.buildAssets) {
            console.log('');
            console.log('Please wait for assets...');
        } else {
            sendUrls();
        }
    });
}).catch((e) => {
    console.log('There was an error starting the Ngrok tunnel. Likely a bad auth token. Here is the error:');
    console.log('');
    console.log(e);
});
