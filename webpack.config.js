const path = require('path');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = (env, {mode}) => ({
    entry: './src/index.ts',

    output: {
        filename: 'mock-backend.js',
        path: path.join(__dirname, '/dist')
    },

    devtool: mode === 'development' ? 'source-map' : false,

    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.json']
    },

    module: {
        rules: [
            {
              test: /\.tsx?$/,
              loader: 'ts-loader',
              options: {
                transpileOnly: true,
                happyPackMode: true,
                experimentalWatchApi: true,
              }
            },
            ... mode === 'development' ? [{
              enforce: 'pre',
              test: /\.js$/,
              loader: 'source-map-loader'
            }] : [],
        ]
    },

  plugins: [
    new ForkTsCheckerWebpackPlugin(),

    // Uncomment to debug bundle size
    //new BundleAnalyzerPlugin(),
  ],

  devServer: {
      contentBase: [__dirname],
      open: true,
      openPage: 'example/index.html',
      compress: true,
      port: 9000
  }
});
