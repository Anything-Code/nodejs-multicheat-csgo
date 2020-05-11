const path = require('path')
const nodeExternals = require('webpack-node-externals')

const server = {
  mode: 'production',
  target: 'node',
  externals: [nodeExternals()],
  entry: {
    main: './src/main.js',
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'build')
  }
}

module.exports = [server]