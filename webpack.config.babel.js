import webpack from 'webpack';
import path from 'path';
import PeerDependenciesExternalsPlugin from 'peer-deps-externals-webpack-plugin';

const config = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'lib'),
    filename: 'index.js',
  },
  module: {
    rules: [{ test: /\.js$/, include: path.resolve(__dirname, 'src'), use: ['babel-loader'] }],
  },
  plugins: [new PeerDependenciesExternalsPlugin()],
};

module.exports = config;
