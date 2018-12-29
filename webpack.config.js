const path = require('path');
const createStyledComponentsTransformer = require('typescript-plugin-styled-components').default;
const styledComponentsTransformer = createStyledComponentsTransformer();

module.exports = {
    entry: './src/index.ts',

    output: {
        filename: 'mock-backend.js',
        path: path.join(__dirname, '/dist')
    },

    devtool: 'source-map',

    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.json']
    },

    module: {
        rules: [
            {
              test: /\.tsx?$/,
              loader: 'awesome-typescript-loader',
              options: {
                getCustomTransformers: () => ({ before: [styledComponentsTransformer] })
              }
            },
            { enforce: 'pre', test: /\.js$/, loader: 'source-map-loader' }
        ]
    },

    devServer: {
        contentBase: [
          path.join(__dirname, 'example'),
          path.join(__dirname, 'dist')
        ],
        compress: true,
        port: 9000
    }
};
