const path = require('path')
const CompressionPlugin = require('compression-webpack-plugin')
const pkg = require('./package.json')

module.exports = {
  productionSourceMap: false,
  configureWebpack: function() {
    return {
      resolve: {
        alias: {
          '@': path.resolve(__dirname, './src'),
          'views': path.resolve(__dirname, './src/views')
        }
      },
      externals: {
        'AMap': 'AMap'
      },
      plugins: [
        new CompressionPlugin({
          test: /\.js$|\.html$|\.css/,
          threshold: 10240,
          deleteOriginalAssets: false
        })
      ]
    }
  },
  chainWebpack: function(config) {
    if (pkg && pkg.version) {
      config.plugin('define')
        .tap(([options]) => {
          options['process.env']['VUE_APP_NAME'] = `"${pkg.name}"`
          options['process.env']['VUE_APP_VERSION'] = `"${pkg.version}"`
          return [options]
        })
    }
    config
      .when(process.env.NODE_ENV !== 'development',
        config => {
          config
            .optimization.splitChunks({
              chunks: 'all',
              cacheGroups: {
                elementUI: {
                  name: 'chunk-elementUI', // split elementUI into a single package
                  priority: 20, // the weight needs to be larger than libs and app or it will be packaged into libs or app
                  test: /[\\/]node_modules[\\/]_?element-ui(.*)/ // in order to adapt to cnpm
                },
                vueDist: {
                  name: 'chunk-vue', // split elementUI into a single package
                  priority: 20, // the weight needs to be larger than libs and app or it will be packaged into libs or app
                  test: /[\\/]node_modules[\\/]_?(vue|vue-router|vuex)(.*)/ // in order to adapt to cnpm
                }
              }
            })
        })
        
    config.module
      .rule('eslint')
      .use('eslint-loader')
      .loader('eslint-loader')
      .tap(options => {
        options.fix = true
        return options
      })
  },
  css: {
    loaderOptions: {
      // 给 sass-loader 传递选项
      scss: {
        // @/ 是 src/ 的别名
        // 所以这里假设你有 `src/variables.sass` 这个文件
        // 注意：在 sass-loader v7 中，这个选项名是 "data"
        prependData: `@import "~@/common/css/el-variable.scss";`
      }
    }
  },
  devServer: {
    https: false,
    port: '8064',
    clientLogLevel: 'warning',
    overlay: {
      warnings: false,
      errors: false
    },
    proxy: {
      '^/v1': {
        target: process.env.VUE_APP_API_URL,
        changeOrigin: true,
        onProxyReq: function(proxyReq) {
          proxyReq.removeHeader('origin')
        }
      }
    }
  }
}
