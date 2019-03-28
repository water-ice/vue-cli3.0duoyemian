/* eslint-disable no-unused-vars */
const Mocks = require('./mock.config');
const path = require('path');
const multiPageConfig = require('./pages.config');

// 解析命令行传入的测试机器，参考自 platmis
const params = JSON.parse(process.env.npm_config_argv).original;
const testMachine = params[params.length - 1].match(/test\d*/) || 'test13';

module.exports = {
  productionSourceMap: false,
  baseUrl: process.env.VUE_APP_StaticUrl || './',
  devServer: {
    overlay: {
      warnings: true,
      errors: true,
    },
    // port: 4001,
    // 本地开发用mock
    // before: Mocks,
    // 联调用proxy
    proxy: {
      '/api': {
        target: `http://${testMachine}.suanshubang.com`,
        // target: 'http://yapi.afpai.com/mock/115/',
        changeOrigin: true,
        pathRewrite: { '/api': '' },
      },
    },
  },
  transpileDependencies: ['h2'],
  pwa: {
    // configure the workbox plugin
    workboxPluginMode: 'GenerateSW',
    workboxOptions: {
      skipWaiting: true,
      globDirectory: 'dist',
      ignoreUrlParametersMatching: [/./],
      globPatterns: ['**/*.{js,png,jpg,gif,ico,html,css,eot,svg,ttf,json}'],
      exclude: [/\.html$/],
      manifestTransforms: [
        // Basic transformation to remove a certain URL:
        (originalManifest) => {
          const manifest = originalManifest.filter((entry) => {
            const hashRegExp = /.html/;
            if (entry.url.match(hashRegExp)) {
              entry.url = `./${entry.url}`;
            } else {
              entry = false;
            }
            return entry;
          });
          // Optionally, set warning messages.
          const warnings = [];
          return { manifest, warnings };
        },
      ],
      // swSrc is required in InjectManifest mode.
      // swSrc: 'public/workbox-sw.js',
      importWorkboxFrom: 'local',
      // ...other Workbox options...
    },
  },
  pages: multiPageConfig, // 配置多页应用
  configureWebpack: {
    resolve: {
      alias: {
        'plat-utils': path.resolve('plat-utils'), // 配置别名
      },
    },
  },
  chainWebpack: (config) => {
    const pages = Object.keys(multiPageConfig);
    pages.forEach((name) => {
      // 配置压缩 html 中的 CSS、JS
      config
        .plugin(`html-${name}`)
        .tap((args) => {
          const option = {
            ...args[0],
            minify: {
              ...args[0].minify,
              minifyCSS: true,
              minifyJS: true,
            },
          };
          return [option];
        });
    });
    // vue剔除构建流程
    if (process.env.NODE_ENV === 'production') {
      config.externals({
        vue: 'Vue',
      });
    }
    const splitOptions = config.optimization.get('splitChunks');
    // manifest
    config.optimization.runtimeChunk({ name: 'manifest' });
    config.optimization.splitChunks(Object.assign({}, splitOptions, {
      // （缺省值5）按需加载时的最大并行请求数
      maxAsyncRequests: 16,
      // （默认值3）入口点上的最大并行请求数
      maxInitialRequests: 16,
      // （默认值：1）分割前共享模块的最小块数
      minChunks: 1,
      // （默认值：30000）块的最小大小
      minSize: 30000,
      // webpack 将使用块的起源和名称来生成名称: `vendors~main.js`,如项目与"~"冲突，则可通过此值修改，Eg: '-'
      automaticNameDelimiter: '~',
      // cacheGroups is an object where keys are the cache group names.
      name: true,
      cacheGroups: {
        default: false,
        vendors: {
          name: 'chunk-vendors',
          test: /[\\/]node_modules[\\/]/,
          minChunks: 2,
          priority: -10,
          chunks: 'initial',
          reuseExistingChunk: true,
        },
        commons: {
          name: 'chunk-commons',
          minChunks: 2,
          priority: -20,
          chunks: 'initial',
          reuseExistingChunk: true,
        },
        async: {
          name: 'chunk-async',
          minChunks: 2,
          priority: -30,
          chunks: 'async',
          reuseExistingChunk: true,
        },
        // element: {
        //   name: 'element',
        //   test: /[\\/]node_modules[\\/]element-ui[\\/]/,
        //   chunks: 'initial',
        //   // 默认组的优先级为负数，以允许任何自定义缓存组具有更高的优先级（默认值为0）
        //   priority: -30,
        // },
      },
    }));
  },
};
