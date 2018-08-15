const path = require('path'),
    webpack = require('webpack'),
    HtmlWebpackPlugin = require('html-webpack-plugin'),
    CleanWebpackPlugin = require('clean-webpack-plugin'),
    MiniCssExtractPlugin = require('mini-css-extract-plugin');

/* DIRS */
const nm = path.resolve(__dirname, 'node_modules'), srcPath = path.resolve(__dirname, 'src'),
    assetsPath = path.resolve(__dirname, 'assets'),
    stylesPath = path.resolve(__dirname, 'assets', 'styles'),
    fontsPath = path.resolve(__dirname, 'assets', 'fonts'),
    imagesPath = path.resolve(__dirname, 'assets', 'images'),
    videosPath = path.resolve(__dirname, 'assets', 'videos');

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
        include: [ fontsPath, imagesPath, videosPath ],
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
