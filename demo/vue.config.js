const path = require('path')

module.exports = {
  publicPath: process.env.NODE_ENV === 'production'
    ? '/eigen-js/'
    : '/',
  transpileDependencies: [
    "vuetify"
  ],
  chainWebpack: config => {
    config.resolve.symlinks(false);
    config.module
      .rule('wasm')
      .type('javascript/auto')
      .test(/\.wasm$/)
      .use('arraybuffer-loader')
      .loader('arraybuffer-loader')
      .end()

    config.resolve.alias.set('@src', path.resolve(__dirname, 'src'))
    config.resolve.alias.set('@assets', path.resolve(__dirname, 'src/assets'))
    config.resolve.alias.set('@eigen', path.resolve(__dirname, '../dist/index.js'))
    config.resolve.alias.set('@docs', path.resolve(__dirname, '../docs'))
  }
}