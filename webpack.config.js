const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

/* DIRS */
const nm = path.resolve(__dirname, 'node_modules');
const srcPath = path.resolve(__dirname, 'src');
const assetsPath = path.resolve(__dirname, 'assets');
const stylesPath = path.resolve(__dirname, 'assets', 'styles');
const fontsPath = path.resolve(__dirname, 'assets', 'fonts');
const imagesPath = path.resolve(__dirname, 'assets', 'images');
const audioPath = path.resolve(__dirname, 'assets', 'audio');
const spritesheetsPath = path.resolve(__dirname, 'assets', 'spritesheets');

module.exports = {
  resolve: {
    modules: [
      nm,
      srcPath,
      assetsPath,
      stylesPath,
      fontsPath,
      imagesPath,
      audioPath,
      spritesheetsPath,
    ],
  },
  entry: {
    game: path.join(srcPath, 'game.js'),
    vendor: ['phaser'],
  },
  plugins: [
    new webpack.DefinePlugin({
      CANVAS_RENDERER: JSON.stringify(true),
      WEBGL_RENDERER: JSON.stringify(true),
    }),
    new MiniCssExtractPlugin({
      filename: '[name].css',
      chunkFilename: '[id].css',
    })
  ].concat(['index', 'signup', 'game'].map(name => new HtmlWebpackPlugin({
    template: path.resolve(srcPath, `${name}.html`),
    filename: `${name}.html`,
    inject: name === 'game' // We only inject the javascript into game.html
  }))),
  module: {
    rules: [
      {
        /* babel */
        test: /\.js$/,
        loader: 'babel-loader',
        include: srcPath,
        exclude: nm,
        options: {
          compact: true,
        },
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
              publicPath: '/css/',
            },
          },
          'css-loader',
        ],
      },
      {
        /* images and audio */
        test: /\.(jpe?g|png|gif|mp3|wav|ogg|xml|ttf)$/,
        loader: 'file-loader',
        include: [fontsPath, imagesPath, audioPath, spritesheetsPath],
        exclude: nm,
        options: {
          name: '[path][name].[ext]',
        },
      },
      {
        test: [/\.vert$/, /\.frag$/],
        use: 'raw-loader',
      },
    ],
  },
};
