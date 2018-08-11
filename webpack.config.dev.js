const path = require('path'), webpack = require('webpack'), HtmlWebpackPlugin = require('html-webpack-plugin'), CleanWebpackPlugin = require('clean-webpack-plugin'), MiniCssExtractPlugin = require('mini-css-extract-plugin'), CopyWebpackPlugin = require('copy-webpack-plugin');

/* DIRS */
const nm = path.join(__dirname, 'node_modules'), srcPath = path.join(__dirname, 'src'), assetsPath = path.join(__dirname, 'assets');

/* Webpack development config */
module.exports = {
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    contentBase: "build",
    publicPath: '/',
    progress: true,
    compress: true,
    port: 3000
  },
  watch: true,
  resolve: {
    modules: [
      nm,
      srcPath,
      assetsPath
    ]
  },
  entry: {
    game: path.resolve(srcPath, 'game.js'),
    vendor: ['phaser']
  },
  output: {
    path: path.resolve(__dirname, "build"),
    filename: '[name].bundle.js'
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
    new MiniCssExtractPlugin({
      filename: "[name].css",
      chunkFilename: "[id].css"
    }),
    new CleanWebpackPlugin(['build'])
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
        include: assetsPath,
        use: [
          {
            loader: MiniCssExtractPlugin.loader
          },
          "css-loader"
        ]
      },
      {
        /* images */
        test: /\.(jpe?g|png|gif|fnt)$/,
        loader: 'file-loader',
        include: assetsPath,
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
      chunks: 'all'
    }
  }
}
