const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

/* DIRS */
const nm = path.resolve(__dirname, 'node_modules');
const srcPath = path.resolve(__dirname, 'src');
const assetsPath = path.resolve(__dirname, 'assets');
const stylesPath = path.resolve(__dirname, 'assets', 'styles');
const fontsPath = path.resolve(__dirname, 'assets', 'fonts');
const imagesPath = path.resolve(__dirname, 'assets', 'images');
const videosPath = path.resolve(__dirname, 'assets', 'videos');

/* Webpack development config */
module.exports = {
  mode: 'production',
  devtool: 'hidden-source-map',
  resolve: {
    modules: [
      nm,
      srcPath,
      assetsPath,
      stylesPath,
      fontsPath,
      imagesPath,
      videosPath
    ]
  },
  entry: {
    game: path.resolve(srcPath, 'game.js'),
    vendor: ['phaser']
  },
  output: {
    path: path.resolve(__dirname, "build"),
    filename: '[name].[chunckhash].bundle.js'
  },
  plugins: [
    new webpack.DefinePlugin({
      'CANVAS_RENDERER': JSON.stringify(true),
      'WEBGL_RENDERER': JSON.stringify(true)
    }),
    new HtmlWebpackPlugin({
      template: path.resolve(srcPath, 'index.html'),
      title: "Phaser3 Heroku ready"
    }),
    new CleanWebpackPlugin(['build']),
    new MiniCssExtractPlugin({
      filename: "[name].css",
      chunkFilename: "[id].css"
    })
  ],
  module: {
    rules: [
      {
        /* babel */
        test: /\.js$/,
        loader: 'babel-loader',
        include: srcPath,
        exclude: nm,
        options: {
          compact: true
        }
      },
      {
        /* css */
        test: /\.css$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              // you can specify a publicPath here
              // by default it use publicPath in webpackOptions.output
              publicPath: '/css/'
            }
          },
          "css-loader"

        ]
      },
      {
        /* images */
        test: /\.(jpe?g|png|gif)$/,
        loader: 'file-loader',
        include: imagesPath,
        exclude: nm,
        options: {
          name: '[path][name].[ext]'
        }
      },
      {
        test: [ /\.vert$/, /\.frag$/ ],
        use: 'raw-loader'
      }
    ]
  },
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
}
