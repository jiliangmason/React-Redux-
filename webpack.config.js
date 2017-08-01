/**
 * Created by Administrator on 2017/7/12 0012.
 */
var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var OpenBrowserPlugin = require('open-browser-webpack-plugin');

module.exports = function () {

    let config = {
        entry: {
            main: './src/index.jsx',
            vendor: ['react', 'react-dom', 'react-router-dom', 'react-redux'], //第三方库整合
            polyfills: 'babel-polyfill' //解决es6不转换新API的问题
        },

        output: {
            path: path.resolve(__dirname, 'dist/'),
            filename: '[name].bundle.js',
            publicPath: '/'
        },

        module: {
            rules: [
                {
                    test: /\.(js|jsx)$/,
                    use: ['babel-loader'],
                    exclude: /node_modules/
                },

                {
                    test: /\.less$/,
                    use: ExtractTextPlugin.extract({
                        fallback: 'style-loader',
                        use: ['css-loader', 'less-loader']
                    })
                },

                {
                    test: /\.css$/,
                    use: ['style-loader', 'css-loader']
                },

                {
                    test: /\.(png|gif|jpg|jpeg|bmp)$/i,
                    use: [{
                        loader: 'url-loader',
                        options: {
                            limit: 5000
                        }
                    }]
                },

                {
                    test:  /\.(png|woff|woff2|svg|ttf|eot)($|\?)/i,
                    use: [{
                        loader: 'url-loader',
                        options: {
                            limit: 5000
                        }
                    }]
                }
            ]
        },

        resolve: {
            extensions: ['.js', '.jsx']
        },

        plugins: [
            new HtmlWebpackPlugin({
                filename: path.resolve(__dirname, 'dist/index.html'),
                template: path.join(__dirname, 'src/index.tmpl.html'),
                title: 'Redux-Payment',
                inject: true,
                minify: {
                    removeComments: false,
                    collapseWhitespace: true,
                    removeAttributeQuotes: true
                },
                // necessary to consistently work with multiple chunks via CommonsChunkPlugin
                chunksSortMode: 'dependency' //在js文件中按依赖顺序引用
            }),

            new ExtractTextPlugin({
                filename: '[name].min.css',
                allChunks: true
            }),

            new webpack.optimize.CommonsChunkPlugin({
                name: 'common',
                chunks: ['main', 'vendor', 'polyfills']
            }),  //提取entry下的公共代码

            new webpack.DefinePlugin({
                __DEV__: JSON.stringify(JSON.parse(process.env.NODE_ENV === 'production') || 'false')
            }),

            new OpenBrowserPlugin({
                url: 'http://localhost:8080'
            }),

            new webpack.HotModuleReplacementPlugin()
        ]
    };

    if (process.env.NODE_ENV == 'production') {  //prod
        config.plugins.push(new webpack.optimize.UglifyJsPlugin({
            sourceMap: true,
            compress: {
                warnings: false,
                drop_console: false
            }
        }));
    }
    else {
        config.devServer = {
            port: 8080,
            contentBase: './build',
            hot: true,
            historyApiFallback: true,
            publicPath: "",
            stats: {
                colors: true
            }
        };

        config.devtool = 'source-map';
    }

    return config;
};