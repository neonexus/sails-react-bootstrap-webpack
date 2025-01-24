// This file is used to configure Webpack to run the self-updating dev frontend server.

const {merge} = require('webpack-merge');
const baseConfig = require('./common.config.js');
const path = require('path');

module.exports = merge(baseConfig, {
    devServer: {
        historyApiFallback: {
            rewrites: [ // these force Webpack to only use the first parts of the URL, so it can retrieve the correct index
                {from: /^\/admin\//, to: '/admin'},
                {from: /^\/main\//, to: '/main'},
                {from: /^\/$/, to: '/main'}
            ]
        },
        static: path.join(__dirname, '../assets')
    },
    module: {
        rules: [
            {
                test: /\.s?[ac]ss$/i,
                use: [
                    {
                        loader: 'style-loader',
                        options: {
                            // injectType: 'singletonStyleTag'
                        }
                    },
                    // Translates CSS into CommonJS
                    {
                        loader: 'css-loader',
                        options: {
                            sourceMap: true
                        }
                    },
                    // Compiles Sass to CSS
                    {
                        loader: 'sass-loader',
                        options: {
                            sourceMap: true,
                            // https://github.com/webpack-contrib/sass-loader#sassoptions
                            sassOptions: {
                                // If set to true, Sass won’t print warnings that are caused by dependencies (like Bootstrap):
                                // https://sass-lang.com/documentation/js-api/interfaces/options/#quietDeps
                                quietDeps: true,
                                silenceDeprecations: ['import', 'global-builtin']
                            }
                        }
                    }
                ]
            }
        ]
    },
    mode: 'development'
});
