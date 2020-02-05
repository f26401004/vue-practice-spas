const webpack = require('webpack')
const { GenerateSW } = require('workbox-webpack-plugin')
const ImageminPlugin = require('imagemin-webpack-plugin').default
const CompressionPlugin = require('compression-webpack-plugin')
const zopfli = require('@gfx/zopfli')
const BrotliPlugin = require('brotli-webpack-plugin')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const TerserPlugin = require('terser-webpack-plugin')

// const LodashModuleReplacementPlugin = require('lodash-webpack-plugin')
// const glob = require('glob-all')
const path = require('path')
// const PurgecssPlugin = require('purgecss-webpack-plugin')

const IS_PROD = ['production', 'prod'].includes(process.env.NODE_ENV)

module.exports = {
  publicPath: IS_PROD ? process.env.VUE_APP_PUBLIC_PATH : './',
  runtimeCompiler: true,
  productionSourceMap: !IS_PROD,
  parallel: require('os').cpus().length > 1,
  pwa: {},
  css: {
    extract: true,
    sourceMap: false,
    loaderOptions: {
      less: {
        javascriptEnabled: true 
      },
      css: {
        localsConvention: 'camelCaseOnly',
        modules: {
          localIdentName: IS_PROD
            ? '[hash:base64:5]'
            : 'app-[hash:base64:5]-[local]'
        }
      }
    },
    requireModuleExtension: true 
  },
  configureWebpack: config => {

    config.module.rules.push({
      test: /\.worker\.js$/,
      use: {
        loader: 'worker-loader',
        options: {
          inline: true,
          fallback: false
          // publicPath: '/scripts/workers/'
        }
      }
    })
    const plugins = [
      new GenerateSW()
      // new LodashModuleReplacementPlugin()
    ]

    config.optimization = {
      splitChunks: {
        cacheGroups: {
          common: {
            name: 'chunk-common',
            chunks: 'initial',
            minChunks: 2,
            maxInitialRequests: 5,
            minSize: 0,
            priority: 1,
            reuseExistingChunk: true,
            enforce: true
          },
          vendors: {
            name: 'chunk-vendors',
            test: /[\\/]node_modules[\\/]/,
            chunks: 'initial',
            priority: 2,
            reuseExistingChunk: true,
            enforce: true
          },
          antDesignVue: {
            name: 'chunk-ant-design-vue',
            test: /[\\/]node_modules[\\/]ant-design-vue[\\/]/,
            chunks: 'all',
            minChunks: 2,
            priority: 3,
            reuseExistingChunk: true,
            enforce: true
          },
        }
      }
    }

    config.resolve.alias['@ant-design/icons/lib/dist$'] = path.resolve(__dirname, './src/antDesignVueIconImport.js')

    plugins.push(new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/))
    if (!IS_PROD) {
      plugins.push(new BundleAnalyzerPlugin())
    } else {
      plugins.push(new CompressionPlugin({
        compressionOptions: {
          numiterations: 15
        },
        algorithm(input, compressionOptions, callback) {
          return zopfli.gzip(input, compressionOptions, callback);
        },
        test: /\.(js|css|json|txt|html|ico|svg)(\?.*)?$/i,
        minRatio: 0.99
      }))

      plugins.push(new BrotliPlugin({
        test: /\.(js|css|json|txt|html|ico|svg)(\?.*)?$/i,
        minRatio: 0.99
      }))

      plugins.push(new TerserPlugin({
        terserOptions: {
          extractComments: 'all',
          extractComments: /console\.log\(([^)]+)\)/,
        },
        sourceMap: false,
        parallel: true
      }))

      plugins.push(new ImageminPlugin({
        pngquant: {
          quality: '95-100'
        }
      }))

    }

    config.plugins = [...config.plugins, ...plugins]

  }
}