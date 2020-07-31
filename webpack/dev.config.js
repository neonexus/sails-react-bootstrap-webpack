const {merge} = require('webpack-merge');
const baseConfig = require('./common.config.js');
const path = require('path');

module.exports = merge(baseConfig, {
    devServer: {
        historyApiFallback: true,
        contentBase: path.join(__dirname, '../../assets')
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
                            sourceMap: true
                        }
                    }
                ]
            }
        ]
    }
});
