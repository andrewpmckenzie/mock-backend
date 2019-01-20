module.exports = (config) => {
  config.set({
    frameworks: ['jasmine'],
    browsers: ['ChromeHeadless'],
    files: [
      'test/**_test.ts',
      {pattern: 'test/static/**.*', included: false, served: true},
    ],
    proxies: {
      '/static/': '/base/test/static/'
    },
    preprocessors: {
      'test/*_test.ts': ['webpack', 'sourcemap'],
    },
    webpack: Object.assign({},
      require('./webpack.config')({}, {mode: 'production'}),
      {
        mode: 'development',
        entry: null,
        output: null,
        devtool: 'inline-source-maps'
      }
    ),
    webpackMiddleware: {
      noInfo: true,
      stats: {chunks: false}
    }
  })
};
