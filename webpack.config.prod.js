const path = require('path'),
    merge = require('webpack-merge'),
    webpackConfig = require('./webpack.config.js'),
    CleanWebpackPlugin = require('clean-webpack-plugin');

/* Webpack development config */
module.exports = merge(webpackConfig, {
  mode: 'production',
  devtool: 'hidden-source-map',
  output: {
    path: path.resolve(__dirname, "build"),
    filename: '[name].[chunckhash].bundle.js'
  },
  plugins: [
    new CleanWebpackPlugin(['build'])
  ],
  optimization: {
    splitChunks: {
      name: 'vendor',
      chunks: 'all',
      cacheGroups: {
        styles: {
          name: 'styles',
          test: /\.css$/,
          chunks: 'all',
          enforce: true
        }
      }
    }
  }
})
