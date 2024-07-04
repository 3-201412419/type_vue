const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  devServer : {
    proxy: {
      '/api': {
        target : 'https://api.steampowered.com',
        changeOrigin : true,
        pathRewrite : {
          '^/api': ''
        },
        logLevel : 'debug'
      }
    }
  },
  transpileDependencies: true
})
