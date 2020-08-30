/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes tell Sails what to do each time it receives a request.
 *
 * For more information on configuring custom routes, check out:
 * https://sailsjs.com/anatomy/config/routes-js
 */

const defaultStaticOptions = {
    maxAge: process.env.NODE_ENV !== 'production' ? 1 : 31557600000,
    extensions: ['html'],
    dotfiles: 'ignore'
};

const path = require('path');
const fs = require('fs');
const serveStatic = require('serve-static');

module.exports.routes = {
    'GET /': {
        skipAssets: true,
        fn: (req, res) => {
            return res.redirect('/main/'); // redirect to the "main" React app (the marketing site)
        }
    },

    'GET /*': { // default route used to auto switch React apps
        skipAssets: false,
        fn: [
            serveStatic(path.resolve(__dirname, '../.tmp/public/'), defaultStaticOptions),
            async (req, res) => {
                // This will determine which React app we need to serve.
                const parts = req.url.split('/');
                const pathToCheck = path.join(__dirname, '../.tmp/public/', parts[1], '/index.html');

                if (fs.existsSync(pathToCheck)) {
                    await sails.helpers.finalizeRequestLog(req, res, {body: 'view'});

                    return res.type('html').send(fs.readFileSync(pathToCheck));
                }

                res.status(404);

                await sails.helpers.finalizeRequestLog(req, res, {view: '404'});

                if (req.wantsJSON) {
                    return res.json({success: false, error: 'URL does not exist.'});
                }

                return res.view('404');
            }
        ]
    },

    'GET /admin': {
        fn: (req, res) => {
            return res.redirect('/admin/dashboard');
        }
    },

    'POST /api/v1/user': 'admin/create-user',
    'POST /api/v1/login': 'admin/login',
    'GET /api/v1/logout': 'admin/logout',
    'GET /api/v1/me': 'admin/get-me',
    'DELETE /api/v1/user': 'admin/delete-user',
    'POST /api/v1/token': 'admin/create-api-token',

    'GET /_ping': (req, res) => {
        return res.ok('pong');
    }
};
