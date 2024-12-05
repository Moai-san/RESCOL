const { provideplugin } = require('webpack');

module.exports = {
  configurewebpack: {
    resolve: {
      fallback: {
        buffer: require.resolve('buffer/'),
      },
    },
    plugins: [
      new provideplugin({
        buffer: ['buffer', 'buffer'],
      }),
    ],
  },
};