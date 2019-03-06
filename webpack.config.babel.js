import webpack from 'webpack';
import path from 'path';
import PeerDependenciesExternalsPlugin from 'peer-deps-externals-webpack-plugin';
import supportedLocales from './src/supportedLocales';

const languagesToImport = supportedLocales.map(locale => locale.split('-')[0]);

const config = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'lib'),
    filename: 'index.js',
  },
  module: {
    rules: [{ test: /\.js$/, include: path.resolve(__dirname, 'src'), use: ['babel-loader'] }],
  },
  plugins: [
    new PeerDependenciesExternalsPlugin(),
    new webpack.ContextReplacementPlugin(/react-intl[/\\]locale-data$/, new RegExp(languagesToImport.join('|'))),
  ],
};

module.exports = config;
