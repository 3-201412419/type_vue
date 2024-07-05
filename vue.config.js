const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  devServer : {
    proxy: {
      '^/api/steam': {
        target : 'https://api.steampowered.com',
        changeOrigin : true,
        pathRewrite : {
          '^/api/steam': ''
        },
        logLevel : 'debug'
      },
      '^/api/youtube':  {
        target : 'http://localhost:3000',
        changeOrigin : true,
      }
    }
  },
  transpileDependencies: true
})
