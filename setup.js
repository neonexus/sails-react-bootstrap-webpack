#!/usr/bin/env node

/**
 *
 * WELCOME TO THE SETUP FILE!
 *
 * This file requires a template `config/local.js.sample` file in order to work.
 * It is meant to create a `config/local.js` file, which is a "master" file, if you will; dictating any configuration overrides.
 *
 * While `config/env/DEVELOPMENT.js` (or `config/env/PRODUCTION.js`) override the general configuration files,
 * `config/local.js` takes precedence over all other files, including the `config/env` files.
 *
 */

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const {spawn} = require('child_process');

let prompts;
try {
    prompts = require('prompts');
} catch {
    return console.error('Looks like you need to `npm install`');
}

const configPath = path.join(__dirname, 'config/local.js');
const modelsConfigPath = path.join(__dirname, 'config/models.js');
const sampleConfigPath = path.join(__dirname, 'config/local.js.sample');
const sessionConfigPath = path.join(__dirname, 'config/session.js');

if (!fs.existsSync(sampleConfigPath)) {
    console.error('The template file for the `local.js` config file (config/local.js.sample) is missing. Can not continue.');

    return process.exit(1);
}

if (fs.existsSync(configPath)) {
    (async () => {
        const answer = await prompts({
            type: 'confirm',
            name: 'moveOn',
            message: 'A `local.js` config file already exists. Continuing will completely rewrite this file. Are you sure you want to continue?',
            initial: false
        });

        if (!answer.moveOn) {
            return process.exit(0);
        }

        const localConf = require(configPath);
        const useAuth = (localConf.ngrok.auth && localConf.ngrok.auth.length && localConf.ngrok.auth.includes(':'));

        runPrompts({
            appName: localConf.appName,
            sailsPort: localConf.port,
            dbHost: localConf.datastores.default.host,
            dbUser: localConf.datastores.default.user,
            dbPass: localConf.datastores.default.password,
            dbName: localConf.datastores.default.database,
            dbPort: localConf.datastores.default.port,
            dbSsl: localConf.datastores.default.ssl,
            forceIndividual: true,
            ngrok: {
                useAuth: useAuth,
                authUser: (useAuth) ? localConf.ngrok.auth.split(':')[0] : 'vip',
                authPass: (useAuth) ? localConf.ngrok.auth.split(':')[1] : '',
                buildAssets: (typeof localConf.ngrok.buildAssets === 'boolean') ? localConf.ngrok.buildAssets : true,
                domain: localConf.ngrok.domain || 'my-ngrok-domain.ngrok-free.app',
                token: (localConf.ngrok.token && !localConf.ngrok.token.includes('authtoken')) ? localConf.ngrok.token : ''
            },
            pwnedPasswords: (localConf.security && typeof localConf.security.checkPwnedPasswords === 'boolean') ? localConf.security.checkPwnedPasswords : true,
            sessionSecret: localConf.session.secret,
            defaultDek: localConf.models.dataEncryptionKeys.default
        });
    })();
} else {
    runPrompts();
}

function runPrompts(defaults = {
    appName: 'My App (LOCAL)',
    sailsPort: 1337,
    dbHost: 'localhost',
    dbUser: 'root',
    dbPass: '',
    dbName: 'myapp',
    dbPort: 3306,
    dbSsl: true,
    forceIndividual: false, // Trigger to skip DB connection string input.
    ngrok: {
        useAuth: false,
        authUser: 'vip',
        authPass: '',
        buildAssets: true,
        domain: '',
        token: ''
    },
    pwnedPasswords: true,
    sessionSecret: generateToken(),
    defaultDek: generateDEK()
}) {
    prompts([
        {
            message: 'Name of the application',
            name: 'appName',
            type: 'text',
            initial: defaults.appName,
            validate: (val) => {
                if (!val || !val.length) {
                    return 'This is required.';
                }

                return true;
            }
        }, {
            message: 'What port should the API attach to?',
            name: 'sailsPort',
            type: 'number',
            initial: defaults.sailsPort,
            min: 1,
            max: 65535
        }, {
            message: 'How do you want to enter your database credentials?',
            name: 'uriOrIndividual',
            type: () => !defaults.forceIndividual ? 'select' : null,
            choices: [
                {
                    title: 'Individually (more secure)',
                    value: 'ind',
                    description: 'I\'ll prompt you for each parameter.'
                },
                {
                    title: 'Database URI',
                    value: 'uri',
                    description: 'mysql://user:pass@localhost:3306/db_name'
                }
            ],
            initial: 0
        }, {
            message: 'Database URI',
            name: 'dbUri',
            type: (prev, ans) => (!defaults.forceIndividual && ans.uriOrIndividual === 'uri') ? 'text' : null,
            validate: (val) => {
                if (!/^mysql:\/\/[^:]+:[^@]+@[^/]+\/[^?]+(\?[^#]+)?(#.*)?$/.test(val)) {
                    return 'This does not appear to be a valid URI (mysql://user:pass@host:port/name)';
                }

                return true;
            }
        }, {
            message: 'Database Username',
            name: 'dbUser',
            type: (prev, ans) => (defaults.forceIndividual || ans.uriOrIndividual === 'ind') ? 'text' : null,
            initial: defaults.dbUser,
            validate: (val) => {
                if (!val || !val.length) {
                    return 'This is required.';
                }

                return true;
            }
        }, {
            message: 'Database Password',
            name: 'dbPass',
            type: (prev, ans) => (defaults.forceIndividual || ans.uriOrIndividual === 'ind') ? 'password' : null,
            initial: defaults.dbPass,
            validate: (val) => {
                if (!val || !val.length) {
                    return 'This is required.';
                }

                return true;
            }
        }, {
            message: 'Database Host',
            name: 'dbHost',
            type: (prev, ans) => (defaults.forceIndividual || ans.uriOrIndividual === 'ind') ? 'text' : null,
            initial: defaults.dbHost,
            validate: (val) => {
                if (!val || !val.length || val.length < 3) {
                    return 'This is required.';
                }

                return true;
            }
        }, {
            message: 'Database Port',
            name: 'dbPort',
            type: (prev, ans) => (defaults.forceIndividual || ans.uriOrIndividual === 'ind') ? 'number' : null,
            initial: defaults.dbPort,
            min: 1,
            max: 65535
        }, {
            message: 'Database Name',
            name: 'dbName',
            type: (prev, ans) => (defaults.forceIndividual || ans.uriOrIndividual === 'ind') ? 'text' : null,
            initial: defaults.dbName,
            validate: (val) => {
                if (!val || !val.length) {
                    return 'This is required.';
                }

                return true;
            }
        }, {
            message: 'Does this database use SSL?',
            name: 'dbSsl',
            type: 'toggle',
            initial: defaults.dbSsl,
            active: 'Yes',
            inactive: 'No'
        }, {
            message: 'Do you want to configure Ngrok?',
            name: 'useNgrok',
            type: 'toggle',
            initial: defaults.ngrok.token.length > 0 && !defaults.ngrok.token.includes('authtoken'),
            active: 'Yes',
            inactive: 'No'
        }, {
            message: 'Ngrok is not installed. Would you like to install it now?',
            name: 'installNgrok',
            type: () => {
                try {
                    require('@ngrok/ngrok');

                    return null;
                } catch {
                    return 'toggle';
                }
            },
            initial: false,
            active: 'Yes',
            inactive: 'No'
        }, {
            message: 'Ngrok Auth Token',
            name: 'ngrokToken',
            type: async (prev, ans) => {
                if (ans.installNgrok) {
                    await installNgrok();
                }

                return (ans.useNgrok) ? 'password' : null;
            },
            initial: defaults.ngrok.token,
            validate: (val) => {
                if (!val || !val.length) {
                    return 'This is required.';
                }

                return true;
            }
        }, {
            message: 'Ngrok Domain',
            name: 'ngrokDomain',
            type: (prev, ans) => (ans.useNgrok) ? 'text' : null,
            initial: defaults.ngrok.domain,
            validate: (val) => {
                if (!val || !val.length || val.length < 3) {
                    return 'This is required.';
                }

                return true;
            }
        }, {
            message: 'Do you want to set a basic username/password for your Ngrok tunnel?',
            name: 'useNgrokAuth',
            type: (prev, ans) => (ans.useNgrok) ? 'toggle' : null,
            initial: defaults.ngrok.useAuth,
            active: 'Yes',
            inactive: 'No'
        }, {
            message: 'Ngrok Tunnel Username',
            name: 'ngrokAuthUser',
            type: (prev, ans) => (ans.useNgrok && ans.useNgrokAuth) ? 'text' : null,
            initial: defaults.ngrok.authUser
        }, {
            message: 'Ngrok Tunnel Password',
            name: 'ngrokAuthPass',
            type: (prev, ans) => (ans.useNgrok && ans.useNgrokAuth) ? 'password' : null,
            initial: defaults.ngrok.authPass,
            validate: (val) => {
                // Validate password meets Ngrok's password requirements.
                if (!val || !val.length || val.length < 8) {
                    return 'Must be at least 8 characters long.';
                }

                if (val.length > 128) {
                    return 'Password is too long. Must be 128 characters or less.';
                }

                return true;
            }
        }, {
            message: 'Should assets be built on each start of `ngrok.js`?',
            name: 'ngrokBuild',
            type: (prev, ans) => (ans.useNgrok) ? 'toggle' : null,
            initial: defaults.ngrok.buildAssets,
            active: 'Yes',
            inactive: 'No'
        }, {
            message: 'Do you want to use the PwnedPasswords.com integration locally?',
            name: 'pwnedPasswords',
            type: 'toggle',
            initial: defaults.pwnedPasswords,
            active: 'Yes',
            inactive: 'No'
        }
    ], {
        onCancel: () => {
            console.error('Canceled setup.');

            return process.exit(1);
        }
    }).then(async (answers) => {
        if (answers.uriOrIndividual === 'uri') {
            // Breakdown the URI into its different parts.
            const parsedUri = new URL(answers.dbUri);

            answers.dbUser = parsedUri.username;
            answers.dbPass = parsedUri.password;
            answers.dbHost = parsedUri.hostname;
            answers.dbName = parsedUri.pathname.substring(1);
            answers.dbPort = parsedUri.port;
        }

        // Read the content of the local.js.sample file.
        const sampleConfigContent = fs.readFileSync(sampleConfigPath, 'utf8');

        // Replace placeholders in the sample file with user input.
        let filledConfigContent = sampleConfigContent
            .replace('My App (LOCAL)',                  answers.appName)
            .replace('port: 1337',                      'port: ' + answers.sailsPort)
            .replace('localhost:1337',                  'localhost:' + answers.sailsPort)
            .replace('host: \'localhost',               'host: \'' + answers.dbHost)
            .replace('user: \'root',                    'user: \'' + answers.dbUser)
            .replace('password: \'my@w3s0m3password',   'password: \'' + answers.dbPass)
            .replace('database: \'myapp',               'database: \'' + answers.dbName)
            .replace('port: 3306',                      'port: ' + answers.dbPort)
            .replace('ssl: false',                      (answers.dbSsl) ? 'ssl: true' : 'ssl: false')
            .replace('{{session secret here}}',         defaults.sessionSecret)
            .replace('{{DEK here}}',                    defaults.defaultDek)
        ; // eslint-disable-line

        // Setup Ngrok configuration if needed.
        if (answers.useNgrok) {
            filledConfigContent = filledConfigContent
                .replace('{{ngrok authtoken}}', answers.ngrokToken)
                .replace('my-ngrok-domain.ngrok-free.app', answers.ngrokDomain)
            ; // eslint-disable-line

            if (answers.useNgrokAuth) {
                filledConfigContent = filledConfigContent.replace('// auth: \'username:notSoSecretPassword', 'auth: \'' + answers.ngrokAuthUser + ':' + answers.ngrokAuthPass);
            }

            if (!answers.ngrokBuild) {
                filledConfigContent = filledConfigContent.replace('// buildAssets: false', 'buildAssets: false');
            }
        }

        if (!answers.pwnedPasswords) {
            filledConfigContent = filledConfigContent.replace('// checkPwnedPasswords', 'checkPwnedPasswords');
        }

        // Remove the "copy this file..." comment block at the top of the sample file.
        filledConfigContent = filledConfigContent.split('\n');
        filledConfigContent = filledConfigContent.splice(9);
        filledConfigContent = filledConfigContent.join('\n');

        // Write the filled configuration to the local.js file.
        fs.writeFileSync(configPath, filledConfigContent);

        console.log(''); // blank line

        // TODO: Maybe make this an option for the user...
        // Generate a default session secret if it hasn't been done already.
        let sessionConfigContent = fs.readFileSync(sessionConfigPath, 'utf8');
        const sessionSearch = '{{session secret here}}';
        if (sessionConfigContent.includes(sessionSearch)) {
            console.log('Default session secret hasn\'t been created yet... Generating a new one...');

            sessionConfigContent = sessionConfigContent.replace(sessionSearch, generateToken());

            fs.writeFileSync(sessionConfigPath, sessionConfigContent);
        }

        // Generate a default DEK if it hasn't been done already.
        let modelsConfigContent = fs.readFileSync(modelsConfigPath, 'utf8');
        const dekSearch = '{{DEK here}}';
        if (modelsConfigContent.includes(dekSearch)) {
            console.log('Default data encryption key hasn\'t been created yet... Generating a new one...');

            modelsConfigContent = modelsConfigContent.replace(dekSearch, generateDEK());

            fs.writeFileSync(modelsConfigPath, modelsConfigContent);
        }

        console.log('');
        console.log('Setup complete!');
        console.log('`' + sampleConfigPath.replace(__dirname, '') + '` copied to -> `' + configPath.replace(__dirname, '') + '`');
        console.log('');

        return process.exit(0);
    });
}

function generateToken() {
    return crypto.createHmac('sha256', crypto.randomBytes(42))
        .update(crypto.randomBytes(42) + new Date())
        .digest('hex');
}

function generateDEK(){
    return crypto.randomBytes(32).toString('base64');
}

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
