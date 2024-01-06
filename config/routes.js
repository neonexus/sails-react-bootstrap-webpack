/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes tell Sails what to do each time it receives a request.
 *
 * For more information on configuring custom routes, check out:
 * https://sailsjs.com/anatomy/config/routes-js
 */

const path = require('path');
const fs = require('fs');
const express = require('express'); // Express is a requirement of Sails.

module.exports.routes = {
    'GET /': {
        skipAssets: true,
        fn: (req, res) => {
            return res.redirect(302, '/main'); // redirect to the "main" React app (the marketing site)
        }
    },

    'GET /*': { // default route used to auto switch React apps
        skipAssets: false,
        fn: [
            express.static(path.resolve(__dirname, '../.tmp/public/')),
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
            return res.redirect(302, '/admin/dashboard');
        }
    },

    'GET /api/v1/users': 'admin/get-users',
    'GET /api/v1/users/deleted': 'admin/get-deleted-users',
    'POST /api/v1/user': 'admin/create-user',
    'PUT /api/v1/user/:id': 'admin/edit-user',
    'DELETE /api/v1/user/:id': 'admin/delete-user',
    'PUT /api/v1/user/:id/reactivate': 'admin/reactivate-user',
    'POST /api/v1/token': 'admin/create-api-token',

    'POST /api/v1/login': 'common/login',
    'GET /api/v1/logout': 'common/logout',
    'GET /api/v1/me': 'common/get-me',
    'POST /api/v1/password': 'common/change-password',

    'POST /api/v1/2fa/enable': 'common/enable-2fa',
    'POST /api/v1/2fa/finalize': 'common/finalize-2fa',
    'POST /api/v1/2fa/disable': 'common/disable-2fa',

    'GET /_ping': (req, res) => {
        return res.ok('pong');
    }
};
