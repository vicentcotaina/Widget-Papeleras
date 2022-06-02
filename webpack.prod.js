const path = require('path');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
module.exports = {
  experiments: {
    topLevelAwait: true,
  },
  entry: {
    main: './src/js/main.js',
    bussinesLogic: './src/js/bussinesLogic.js',
    globalParams: './src/js/globalParams.js',
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist'),
  },
  mode: 'development',
  devServer: {
    static: './dist',
  },
  devtool: 'inline-source-map',
  performance: {
    hints: false,
    maxEntrypointSize: 512000,
    maxAssetSize: 512000,
  },
  plugins: [new CleanWebpackPlugin()],
};
