#!/usr/bin/env node

/**
 * This is the file used to lift Sails, build assets, and start Ngrok.
 *
 * Run it via node: `node ngrok` OR `node ngrok.js`
 * Run it directly: `./ngrok.js`
 */
let ngrok;

try {
    ngrok = require('ngrok');
} catch (e) { // eslint-disable-line
    console.log('');
    console.log('In order to run this script, you must install `Ngrok`:');
    console.log('');
    console.log('npm i ngrok --save-dev');
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
config.auth = null;
config.token = process.env.NGROK_TOKEN || null;
config.buildAssets = true;
config.domain = null;
config.port = process.env.PORT || config.port || 1337;
config.region = null;

// Read our console config flags.
for (let i = 2; i < process.argv.length; ++i) {
    const thisFlag = process.argv[i].toLowerCase();

    if (thisFlag === 'nobuild') {
        config.buildAssets = false;
    } else if (thisFlag.startsWith('auth=')) {
        config.auth = process.argv[i].substring(5);
    } else if (thisFlag.startsWith('domain=')) {
        config.domain = thisFlag.substring(7);
    } else if (thisFlag.startsWith('region=')) {
        config.region = thisFlag.substring(7);
    } else if (thisFlag.startsWith('token=')) {
        config.token = process.argv[i].substring(6);
    }
}

ngrok.connect({
    auth: config.auth, // HTTP Basic auth
    authtoken: config.token,
    addr: config.port,
    subdomain: config.domain,
    region: config.region,
    scheme: 'https' // Currently, this does nothing, but will force Ngrok to open ONLY an HTTPS tunnel, when v5 of `ngrok` package is released.
}).then((ngrokUrl) => {
    // Close our "http" tunnel (leaving our "https" tunnel open). Hacky, but required until v5.
    const ngrokApi = ngrok.getApi();
    ngrokApi.listTunnels().then((current) => {
        current.tunnels.forEach((tunnel) => {
            if (tunnel.proto === 'http') {
                ngrokApi.stopTunnel(tunnel.name).then();
            }
        });
    });

    let origins;

    // Smaller helper function, to output the Ngrok URLs.
    function sendUrls() {
        console.log('');
        console.log('Ngrok URL: ' + ngrokUrl);
        console.log('Ngrok Dashboard: http://localhost:4040');
        console.log('');
    }

    // Build our assets in the background.
    if (config.buildAssets) {
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
        origins = [...config.security.cors.allowOrigins, ngrokUrl];
    } else {
        origins = [ngrokUrl];
    }

    // Start Sails.
    sails.lift({
        ...rc('sails'),
        baseUrl: ngrokUrl,
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
        if (config.buildAssets) {
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
