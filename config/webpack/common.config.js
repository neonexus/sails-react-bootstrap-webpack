const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const webpack = require('webpack');
const fs = require('fs');
const _ = require('lodash');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

let configPath = path.resolve(__dirname, '../local.js'),
    baseUrl = 'http://localhost:1337',
    frontendUrl = 'http://localhost:8080',
    assetUrl = '';

try {
    let config = {};

    if (fs.existsSync(configPath)) {
        config = require(configPath);
    } else {
        configPath = (process.env.NODE_ENV !== 'production')
                     ? path.resolve(__dirname, '../env/development.js')
                     : path.resolve(__dirname, '../env/production.js');

        config = require(configPath);
    }

    baseUrl = config.baseUrl;
    frontendUrl = config.frontendUrl;
    assetUrl = config.assetsUrl ? config.assetsUrl : '/';
} catch (err) {
    return console.error(err);
}

const baseHtmlConfig = {
    template: 'assets/entry_template.html',
    inject: true,
    hash: true,
    minify: process.env.NODE_ENV === 'production',
    publicPath: assetUrl
};

const entryPoints = [
    {
        name: 'admin',
        entry: path.join(__dirname, '/../../assets/src/admin.jsx'),
        outfile: 'admin/index.html',
        title: 'My Admin',
        template: 'assets/webapp_entry_template.html'
    },
    {
        // this entry is mainly for local development, and won't be served by Sails
        name: 'index',
        entry: path.join(__dirname, '/../../assets/src/index.jsx'),
        outfile: 'index.html',
        title: 'My Application'
    },
    {
        name: 'main',
        entry: path.join(__dirname, '/../../assets/src/main.jsx'),
        outfile: 'main/index.html',
        title: 'My Application'
    }
];

let entry = {},
    plugins = [];

for (let i = 0; i < entryPoints.length; ++i) {
    const template = (entryPoints[i].template) ? entryPoints[i].template : baseHtmlConfig.template;

    if (!entryPoints[i].include || !_.isArray(entryPoints[i])) {
        entryPoints[i].include = [entryPoints[i].name];
    }

    entry[entryPoints[i].name] = entryPoints[i].entry;
    plugins.push(new HtmlWebpackPlugin(_.merge({}, baseHtmlConfig, {filename: entryPoints[i].outfile, chunks: entryPoints[i].include, template})));
}

plugins.push(
    new webpack.DefinePlugin({
        'process.env': JSON.stringify({
            baseUrl,
            frontendUrl
        })
    })
);

plugins.push(new FaviconsWebpackPlugin({
    logo: path.join(__dirname, '/../../assets/images/favicon.png'), // svg works too!
    mode: 'webapp', // 'webapp' or 'light' - 'webapp' by default
    devMode: 'light', // 'webapp' or 'light' - 'light' by default
    favicons: {
        appName: 'sails-react-bootstrap-webpack',
        appDescription: 'A great start to an awesome application.',
        developerName: null,
        developerURL: null, // prevent retrieving from the nearest package.json
        display: 'standalone', // Preferred display mode: "fullscreen", "standalone", "minimal-ui" or "browser".
        background: '#fff',
        theme_color: '#fff',
        icons: {
            coast: false,
            yandex: false
        }
    }
}));

plugins.push(
    new CopyPlugin({
        patterns: [
            {from: path.join(__dirname, '/../../assets/fonts'), to: path.join(__dirname, '/../../.tmp/public/assets/fonts')}
        ]
    })
);

module.exports = {
    entry,
    plugins,
    output: {
        path: path.join(__dirname, '/../../.tmp/public'),
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
        modules: ['node_modules', path.join(__dirname, '/../../assets')]
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
