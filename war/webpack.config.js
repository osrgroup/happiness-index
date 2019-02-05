const path = require('path');
const webpack = require('webpack');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
require('babel-register'); // replace nodes require with babels on-the-fly c.
require('babel-polyfill');

module.exports = {
	bail: true,
	mode: process.env.NODE_ENV || 'development',
	devtool: 'none',
	optimization: {
		splitChunks: {
			name: 'uni1-happy',
			minChunks: 1
		},
		noEmitOnErrors: true,
		minimizer: [
			new UglifyJsPlugin({
				cache: true,
				parallel: true,
				sourceMap: true
			}),
			new OptimizeCSSAssetsPlugin({})
		]
	},
	entry: {
		index: './assets/js/pages/index/index.js',
		'service-worker/sw': './assets/js/service-worker/sw.js'
	},
	resolve: {
		alias: {
			jquery: path.join(__dirname, './assets/js/jquery-stub.js'),
			endpoints: path.resolve(__dirname, './assets/js/common/endpoints'),
			modals: path.resolve(__dirname, './assets/js/common/modals'),
			common: path.resolve(__dirname, './assets/js/common'),
			components: path.resolve(__dirname, './components')
		}
	},
	output: {
		path: path.resolve('./dist'),
		filename: '[name].dist.js'
	},
	externals: {
		// require("jquery") is external and available
		//  on the global var jQuery
		//react: "React"
	},
	module: {
		rules: [
			{
				test: path.join(__dirname, 'assets/js'),
				use: {
					loader: 'babel-loader',
					options: {
						cacheDirectory: 'babel-cache',
						presets: ['env', 'react']
					}
				}
			},
			{
				test: /\.css$/,
				use: [MiniCssExtractPlugin.loader, 'css-loader']
			},
			{
				test: /\.((png|jpg|gif|svg|eot|ttf|woff|woff2)(\?|=|.|[a-z]|[0-9])*)$/,
				use: [
					{
						loader: 'url-loader',
						options: {
							limit: 10000
						}
					}
				]
			}
		]
	},

	plugins: [
		// Avoid publishing files when compilation fails
		new webpack.DefinePlugin({
			'process.env': {
				NODE_ENV: JSON.stringify('production')
			}
		}),

		new MiniCssExtractPlugin({
			filename: 'styles.css',
			chunkFilename: '[id].css'
		}),
		new webpack.ProvidePlugin({
			FontAwesomeIcon: ['@fortawesome/react-fontawesome', 'FontAwesomeIcon']
		})
	],
	stats: {
		// Nice colored output
		colors: true,
		// Adds time to completion when bundling
		timings: true
	}
	// Create Sourcemaps for the bundle
};
