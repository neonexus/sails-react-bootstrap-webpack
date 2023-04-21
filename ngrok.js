/**
 * This is the file used to lift Sails, build assets, and start Ngrok.
 */
let ngrok;

try {
    ngrok = require('ngrok');
} catch (e) { // eslint-disable-line
    console.log('');
    console.log('In order to run this script, you must either install `Ngrok`:');
    console.log('npm i ngrok --save-dev');
    console.log('');
    console.log('Or install all the optional dependencies (will also install sails-hook-autoreload):');
    console.log('npm i --include=optional');
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
config.authtoken = process.env.NGROK_AUTH || null;
config.buildAssets = true;
config.port = process.env.PORT || config.port || 1337;

// Read our console config flags.
for (let i = 2; i < process.argv.length; ++i) {
    if (process.argv[i].toLowerCase() === 'nobuild') {
        config.buildAssets = false;
    } else if (process.argv[i].toLowerCase().startsWith('auth=')) {
        config.authtoken = process.argv[i].substring(5);
    }
}

ngrok.connect({
    authtoken: config.authtoken,
    addr: config.port,
    scheme: 'https' // Currently, this does nothing, but will force Ngrok to open ONLY an HTTPs tunnel, when v5 of `ngrok` package is released.
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

    function sendUrls() {
        console.log('');
        console.log('Ngrok URL: ' + ngrokUrl);
        console.log('Ngrok Dashboard: http://localhost:4040');
        console.log('');
    }

    if (config.buildAssets) {
        // Build our assets in the background.
        const assetBuilderProcess = spawn('npm', ['run', 'build'], {env: {...process.env, NGROK_URL: ngrokUrl}});

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

    if (config.security && config.security.cors && config.security.cors.allowOrigins) {
        origins = [...config.security.cors.allowOrigins, ngrokUrl];
    } else {
        origins = [ngrokUrl];
    }

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
