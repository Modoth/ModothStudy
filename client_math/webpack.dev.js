const merge = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    historyApiFallback: true,
    proxy: {
      '/api': 'http://localhost:5000',
      '/files': 'http://localhost:5000'
    },
    port: 9080
  }
});
