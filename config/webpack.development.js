'use strict';

var path = require('path');
var webpack = require('webpack');

module.exports = {
  devtool: 'eval-source-map',
  entry: [
    path.join(__dirname, '../admin/assets/main.js')
  ],
  output: {
    path: path.join(__dirname, '../admin/dist'),
    filename: 'app.js',
    publicPath: '/admin/static/'
  },
  plugins: [
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin()
  ],
  resolve: {
    alias: {
        'velvet-react': path.join(__dirname, '../lib/VelvetReact.js')
    },
    modulesDirectories: [
      'node_modules',
      path.join(__dirname, '../lib/core_modules')
    ]
  },
  module: {
    loaders: [
      {
        test: /\.js|\.tag$/,
        exclude: /node_modules/,
        loaders: ['react-hot', 'babel']
      }, {
        test: /\.html$/,
        loader: "html-loader"
      }, {
        test: /\.json?$/,
        loader: 'json'
      }, {
        test: /\.css$/,
        loader: 'style!css?modules&localIdentName=[name]---[local]---[hash:base64:5]'
      }, {
        test: /\.scss$/,
        loader: 'style!css!sass'
      }
    ]
  }
};
