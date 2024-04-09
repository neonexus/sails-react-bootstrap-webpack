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

    return afterChecks();
} catch {
    try {
        const prompts = require('prompts');
        const { spawn } = require('child_process');

        (async function() {
            const answer = await prompts({
                type: 'confirm',
                name: 'installNgrok',
                message: 'Ngrok is NOT installed. Would you like to install now?',
                initial: false
            });

            if (answer.installNgrok) {
                function installNgrok() {
                    return new Promise((resolve, reject) => {
                        const ngrokInstall = spawn('npm', ['install', '@ngrok/ngrok@v0.9.1', '--save-dev', '--save-exact'], {cwd: __dirname, stdio: 'inherit'});

                        ngrokInstall.on('error', (err) => {
                            return reject(err);
                        });

                        ngrokInstall.on('close', (code) => {
                            if (code === 0) {
                                return resolve();
                            }

                            return reject('npm install failed with code: ' + code);
                        });
                    });
                }

                await installNgrok();

                ngrok = require('@ngrok/ngrok');

                return afterChecks();
            }
        })();
    } catch {
        console.error('Looks like you need to `npm install`');

        return process.exit(1);
    }
}

function afterChecks() {
    const sails = require('sails');
    const rc = require('sails/accessible/rc');
    const {spawn} = require('child_process');
    const path = require('path');
    const moduleLoader = require('sails/lib/hooks/moduleloader');
    const merge = require('lodash/merge');

    // Load configuration the way Sails would.
    moduleLoader({
        config: {
            environment: process.env.NODE_ENV || 'development',
            paths: {
                config: path.join(__dirname, 'config')
            }
        }
    }).loadUserConfig((err, config) => {
        if (err) {
            console.error('');
            console.error('There was an issue loading user configuration:');
            console.error('');
            console.error(err);
            console.error('');

            return process.exit(1);
        }

        // Set Ngrok defaults. These can be overwritten in `config/ngrok.js` or `config/local.js`.
        // Basically, this is just a safety net, should one delete the `config/ngrok.js` file.
        config = merge({
            ngrok: {
                auth: process.env.NGROK_BASIC || undefined,
                token: process.env.NGROK_AUTHTOKEN || process.env.NGROK_TOKEN || undefined,
                buildAssets: true,
                domain: process.env.NGROK_DOMAIN || undefined,
                region: process.env.NGROK_REGION || undefined,
                port: process.env.PORT || 4242
            },
            ...config
        });

        // Boolean coercion
        switch (config.ngrok.buildAssets) {
            case true:
            case 'true':
            case '1':
            case 1:
                config.ngrok.buildAssets = true;
                break;
            case false:
            case 'false':
            case '0':
            case 0:
                config.ngrok.buildAssets = false;
                break;
            default:
                console.error('Invalid value set for `buildAssets`. Expected boolean-like, got: ' + config.ngrok.buildAssets);
                return process.exit(1);
        }

        // Read our console config flags.
        for (let i = 2; i < process.argv.length; ++i) {
            const thisFlag = process.argv[i].toLowerCase();

            if (thisFlag === 'nobuild') {
                config.ngrok.buildAssets = false;
            } else if (thisFlag === 'build') {
                config.ngrok.buildAssets = true;
            } else if (thisFlag.startsWith('auth=')) {
                config.ngrok.auth = process.argv[i].substring(5); // this.flag is lower cased; have to use the raw input
            } else if (thisFlag.startsWith('domain=')) {
                config.ngrok.domain = thisFlag.substring(7);
            } else if (thisFlag.startsWith('port=')) {
                config.ngrok.port = thisFlag.substring(5);
            } else if (thisFlag.startsWith('region=')) {
                config.ngrok.region = thisFlag.substring(7);
            } else if (thisFlag.startsWith('token=')) {
                config.ngrok.token = process.argv[i].substring(6); // this.flag is lower cased; have to use the raw input
            }
        }

        ngrok.forward({
            addr: config.ngrok.port, // This is actually the port we'll use for Sails. Ngrok will handle its own ports.
            authtoken: config.ngrok.token,
            basic_auth: config.ngrok.auth, // eslint-disable-line
            domain: config.ngrok.domain,
            region: config.ngrok.region,
            schemes: ['HTTPS']
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

                if (!config.security.cors.allowOrigins.includes(ngrokUrl)) {
                    origins.push(ngrokUrl);
                }
            } else {
                origins = [ngrokUrl];
            }

            // Small safety trigger, to help prevent use of `sails lift`, as that circumvents our custom error handlers / configuration overrides.
            process.env.NOT_FROM_SAILS_LIFT = 'true'; // Can't use booleans with environment variables. That's just silly!

            // Start Sails.
            sails.lift({
                ...rc('sails'),
                baseUrl: ngrokUrl,
                http: {...config.http, trustProxy: true}, // See: https://sailsjs.com/documentation/reference/configuration/sails-config-http
                port: config.ngrok.port,
                security: {
                    cors: {
                        allowOrigins: origins
                    }
                }
            }, (err) => {
                if (err) {
                    switch (err.code) {
                        case 'E_INVALID_DATA_ENCRYPTION_KEYS':
                            console.error(
                                '\nSails is complaining about bad DEK\'s (Data Encryption Keys).'
                                + '\nThis is likely caused by running on PRODUCTION without a DATA_ENCRYPTION_KEY environment variable set.'
                                + '\n\nThe DEK ID that is being reported as invalid: ' + err.dekId
                                + '\n\nTo generate a new DEK:    npm run generate:dek\n'
                            );
                            break;
                        default:
                            console.error(err);
                            break;
                    }

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
            console.log('');
            console.log('There was an error starting the Ngrok tunnel. Here is the error:');
            console.log('');
            console.log(e.message);
            console.log('');
        });
    });
}
