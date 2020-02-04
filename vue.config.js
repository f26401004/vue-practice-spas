const webpack = require('webpack')
const { GenerateSW } = require('workbox-webpack-plugin')
const ImageminPlugin = require('imagemin-webpack-plugin').default
const CompressionPlugin = require('compression-webpack-plugin')
const zopfli = require("@gfx/zopfli")
const BrotliPlugin = require("brotli-webpack-plugin")
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const TerserPlugin = require('terser-webpack-plugin')
// const glob = require('glob-all')
// const path = require("path")
// const PurgecssPlugin = require("purgecss-webpack-plugin")

module.exports = {
  parallel: require('os').cpus().length > 1,
  configureWebpack: config => {
    const plugins = [
      new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
      // new BundleAnalyzerPlugin(),
      new GenerateSW(),
      new CompressionPlugin({
        compressionOptions: {
          numiterations: 15
        },
        algorithm(input, compressionOptions, callback) {
          return zopfli.gzip(input, compressionOptions, callback);
        },
        test: /\.(js|css|json|txt|html|ico|svg)(\?.*)?$/i,
        minRatio: 0.01
      }),
      new BrotliPlugin({
        test: /\.(js|css|json|txt|html|ico|svg)(\?.*)?$/i,
        minRatio: 0.01
      }),
      new TerserPlugin({
        terserOptions: {
          extractComments: 'all',
          extractComments: /console\.log\(([^)]+)\)/,
        },
        sourceMap: false,
        parallel: true
      }),
      new ImageminPlugin({
        pngquant: {
          quality: '95-100'
        }
      })
    ]

    config.optimization = {
      splitChunks: {
        cacheGroups: {
          common: {
            name: "chunk-common",
            chunks: "initial",
            minChunks: 2,
            maxInitialRequests: 5,
            minSize: 0,
            priority: 1,
            reuseExistingChunk: true,
            enforce: true
          },
          vendors: {
            name: "chunk-vendors",
            test: /[\\/]node_modules[\\/]/,
            chunks: "initial",
            priority: 2,
            reuseExistingChunk: true,
            enforce: true
          },
          antDesignVue: {
            name: "chunk-antDesignVue",
            test: /[\\/]node_modules[\\/]ant-design-vue[\\/]/,
            chunks: "all",
            priority: 3,
            reuseExistingChunk: true,
            enforce: true
          },
        }
      }
    }

    config.plugins = [...config.plugins, ...plugins]
  }
}