const { merge } = require('webpack-merge');
const path = require('path');
const baseConfig = require('react-scripts/config/webpack.config');

module.exports = function (env) {
  const appConfig = {
    module: {
      rules: [
        {
          test: /\.js$/,
          enforce: 'pre',
          use: ['source-map-loader'],
          include: path.resolve(__dirname, 'src'),
        },
      ],
    },
  };

  return merge(baseConfig(env), appConfig);
};
