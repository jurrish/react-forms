'use strict';

const ExtractPlugin = require('extract-text-webpack-plugin');
const HTMLPlugin = require('html-webpack-plugin');

module.exports = {
  devtool: 'eval',
  entry: `${__dirname}/src/main.js`,
  output: {
    //what to name the bundle
    filename: `bundle-[hash].js`,
    //where to put the file when it's done
    path: `${__dirname}/build`,
    //appends all of our src tags with this string. ie - <i src="locallySavedImage/useThis.jpg"> gets an appended local source
    publicPath: '/',
  },
  plugins: [
    new HTMLPlugin({ template: `${__dirname}/src/index.html` }),
    new ExtractPlugin('bundle-[hash].css'),
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
      {
        test: /\.scss$/,
        loader: ExtractPlugin.extract(['css-loader', 'sass-loader']),
      },
    ],
  },
}
