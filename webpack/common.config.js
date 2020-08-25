const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const webpack = require('webpack');
const fs = require('fs');
const _ = require('lodash');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

let configPath = path.resolve(__dirname, '../config/local.js'), // try to get local config if it exists
    baseUrl = 'http://localhost:1337', // default baseUrl (should point to Sails)
    frontendUrl = 'http://localhost:8080', // default frontendUrl, points to Webpack dev server (external customer domain, https://example.com)
    assetUrl = ''; // used for CDN prefixing on assets (https://cdn.example.com/)

try {
    let config;

    // if local.js exists, use it
    if (fs.existsSync(configPath)) {
        config = require(configPath);
    } else {
        // no local.js, find our environmental configuration
        const environment = process.env.NODE_ENV || 'development';

        switch (environment.toLowerCase()) {
            case 'dev':
            case 'development':
                configPath = path.resolve(__dirname, '../config/env/development.js');
                break;
            case 'prod':
            case 'production':
                configPath = path.resolve(__dirname, '../config/env/production.js');
                break;
            default:
                configPath = path.resolve(__dirname, '../config/env/' + environment + '.js');
                break;
        }

        // now we can read our configuration
        config = require(configPath);
    }

    // Setup variables to inject into compiled apps, like which URL to use as a base for API / websocket connections, or CRN URLs.
    baseUrl = config.baseUrl;
    frontendUrl = config.frontendUrl;
    assetUrl = config.assetsUrl ? config.assetsUrl : '/'; // used for CDN rewrites on asset URLs
} catch (err) {
    return console.error(err);
}

const baseHtmlConfig = {
    template: 'assets/entry_template.html',
    inject: true,
    hash: true, // add hashes to the end of compiled assets, to help bust cache
    minify: process.env.NODE_ENV === 'production',
    publicPath: assetUrl
};

const entryPoints = [
    {
        name: 'admin',
        entry: path.join(__dirname, '/../assets/src/admin.jsx'),
        outfile: 'admin/index.html',
        title: 'My Admin',
        template: 'assets/webapp_entry_template.html'
    },
    {
        // this entry is mainly for local development, and won't be served by Sails
        name: 'index',
        entry: path.join(__dirname, '/../assets/src/index.jsx'),
        outfile: 'index.html',
        title: 'My Application'
    },
    {
        name: 'main',
        entry: path.join(__dirname, '/../assets/src/main.jsx'),
        outfile: 'main/index.html',
        title: 'My Application'
    }
];

let entry = {},
    plugins = [];

// loop through all of our entry points
for (let i = 0; i < entryPoints.length; ++i) {
    // which template are we using?
    const template = (entryPoints[i].template) ? entryPoints[i].template : baseHtmlConfig.template;

    // Does this entrypoint not include other entry points? (for code splitting) If not, we need to make sure it includes itself for things to work down the line.
    if (!entryPoints[i].include) {
        entryPoints[i].include = [entryPoints[i].name];
    }

    // setup Webpack entry points
    entry[entryPoints[i].name] = entryPoints[i].entry;

    // add our HTML Webpack plugin to render the entry point
    plugins.push(new HtmlWebpackPlugin(_.merge({}, baseHtmlConfig, {filename: entryPoints[i].outfile, chunks: entryPoints[i].include, template})));
}

// Inject "environment" variables into our JavaScript bundle.
// For example, in our React code, we can use `process.env.baseUrl` to get our base API URL (see the top of: ../assets/src/index.jsx)
plugins.push(
    new webpack.DefinePlugin({
        'process.env': JSON.stringify({
            baseUrl,
            frontendUrl
        })
    })
);

// Add in the Favicons plugin, which handles a lot more meta data than just Favicons...
// See: https://www.npmjs.com/package/favicons-webpack-plugin
plugins.push(new FaviconsWebpackPlugin({
    logo: path.join(__dirname, '/../assets/images/favicon.png'), // svg works too!
    mode: 'webapp', // 'webapp' or 'light' - 'webapp' by default
    devMode: 'light', // 'webapp' or 'light' - 'light' by default
    favicons: {
        appName: 'sails-react-bootstrap-webpack',
        appDescription: 'A great start to an awesome application.',
        developerName: null,
        developerURL: null, // prevent retrieving from the nearest package.json
        display: 'standalone', // Preferred display mode: "fullscreen", "standalone", "minimal-ui" or "browser".
        background: '#fff',
        // eslint-disable-next-line camelcase
        theme_color: '#fff',
        icons: {
            coast: false,
            yandex: false
        }
    }
}));

// Copy our fonts to the .tmp/public folder.
plugins.push(
    new CopyPlugin({
        patterns: [
            {from: path.join(__dirname, '/../assets/fonts'), to: path.join(__dirname, '/../.tmp/public/assets/fonts')}
        ]
    })
);

// Copy any asset dependencies we might have, like sails.io to the .tmp/public folder.
plugins.push(
    new CopyPlugin({
        patterns: [
            {from: path.join(__dirname, '/../assets/dependencies'), to: path.join(__dirname, '/../.tmp/public/assets/dependencies')}
        ]
    })
);

// Finally, export our Webpack configuration.
module.exports = {
    entry,
    plugins,
    output: {
        path: path.join(__dirname, '/../.tmp/public'),
        filename: '[name]/bundle.js',
        publicPath: baseHtmlConfig.publicPath
    },
    module: {
        rules: [
            {
                test: /\.jsx$/,
                use: 'babel-loader',
                exclude: /node_modules/
            },
            {
                test: /\.(png|jpe?g|gif)$/i,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            outputPath: 'assets/images'
                        }
                    }
                ]
            }
        ]
    },
    resolve: {
        extensions: ['.js', '.jsx'],
        modules: ['node_modules', path.join(__dirname, '/../assets')]
    },
    optimization: {
        splitChunks: {
            // chunks: 'all',
            cacheGroups: {
                styles: {
                    test: /\.(css|scss|sass)$/,
                    enforce: true // force css in new chunks (ignores all other options)
                }
            }
        }
    }
};
