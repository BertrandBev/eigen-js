
const path = require('path');

const config = {
  mode: 'production',
  entry: './src/eigen.mjs',
  context: path.resolve(__dirname, "."),
  module: {
    rules: [
      // {
      //   test: /\.js?$/,
      //   exclude: /(node_modules)/,
      //   use: 'babel-loader',
      // },
      // {
      //   test: /\.wasm$/,
      //   type: "javascript/auto", // ← !!
      //   loader: "file-loader",
      //   options: {
      //     publicPath: "dist/"
      //   }
      // },
      {
        test: /\.wasm$/,
        type: "javascript/auto",
        loader: "arraybuffer-loader"
      }
    ],
  },
  resolve: {
    extensions: ['.js'],
  },
  // browser: {
  //   fs: false
  // }
};

const nodeConfig = {
  target: 'node',
  ...config,
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: 'index.js',
    libraryExport: 'default',
    library: 'eig',
    libraryTarget: 'umd'
  }
}

// const webConfig = {
//   target: 'web',
//   ...config,
//   output: {
//     path: path.resolve(__dirname, "dist"),
//     filename: 'index.js',
//     libraryExport: 'default',
//     library: 'eig',
//     libraryTarget: 'umd'
//   },
//   node: {
//     fs: 'empty'
//   },
// }

module.exports = [nodeConfig];
