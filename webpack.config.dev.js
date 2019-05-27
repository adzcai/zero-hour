const path = require('path');
const merge = require('webpack-merge');
const webpackConfig = require('./webpack.config.js');

/* Webpack development config */
module.exports = merge(webpackConfig, {
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    contentBase: 'build',
    publicPath: '/',
    progress: true,
    compress: true,
    port: 8080,
  },
  watch: true,
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: '[name].bundle.js',
  },
  optimization: {
    splitChunks: {
      name: 'vendor',
      chunks: 'all',
    },
  },
});
