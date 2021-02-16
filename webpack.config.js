const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const WebpackMd5Hash = require('webpack-md5-hash');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const isDev = process.env.NODE_ENV === 'development';

module.exports = {
    entry: {
      index: './src/index.js',
      personal: './src/saved-articles/index.js'
    },
    output: {
        filename: 'js_files/[name].[chunkhash].js',
        path: path.resolve(__dirname, 'dist'),
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                use: { loader: "babel-loader" },
                exclude: /node_modules/
            },
            {
                test: /\.css$/i,
                use: [
                    (isDev ? 'style-loader' : MiniCssExtractPlugin.loader),
                    {
                        loader:'css-loader',
                        options: {
                            importLoaders: 2,
                        },
                    },
                    'postcss-loader'
                ]
            },
            {
                test: /\.(eot|ttf|woff|woff2)$/,
                use: {
                    loader: 'file-loader',
                    options: {
                        name: './vendor/[name].[ext]'
                    }
                }
            },
            {
                test: /\.(png|jpg|gif|ico|svg)$/,
                use: [
                    'file-loader?name=./images/[name].[ext]',
                    {
                        loader: 'image-webpack-loader',
                        options: {}
                    },
                ]
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
          template: './src/index.html',
          inject: 'body',
          chunks: ['index'],
          filename: 'index.html'
        }),

        new HtmlWebpackPlugin({
          template: './src/personal.html',
          inject: 'body',
          chunks: ['personal'],
          filename: 'personal.html'
      }),

        new MiniCssExtractPlugin({
          filename: "css_files/[name].[contenthash].css",
          chunkFilename: "[id].[contenthash].css"
      }),

        new OptimizeCssAssetsPlugin({
          assetNameRegExp: /\.css$/g,
          cssProcessor: require('cssnano'),
          cssProcessorPluginOptions: {
          preset: ['default'],
        },
          canPrint: true
    }),

        new WebpackMd5Hash(),

        new webpack.DefinePlugin({
          'NODE_ENV': JSON.stringify(process.env.NODE_ENV)
        }),

        new CleanWebpackPlugin()
    ]
};