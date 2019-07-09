/** 区分打包环境与开发环境
 * process.env.NODE_ENV==='production'  (打包环境)
 * process.env.NODE_ENV==='development' (开发环境)
 * 只列出部分 其它请查看 https://cli.vuejs.org/zh/config/
 */

module.exports = {
  /**
   * 部署应用包时的基本 URL。
   * 例如，如果你的应用被部署在 https://www.my-app.com/my-app/，则设置 publicPath 为 /my-app/。
   * @default '/'
   * */
  publicPath: process.env.NODE_ENV === 'production' ? '/vue-cli-3.x/' : '/',

  /**
   * 当运行 vue run build 时生成的生产环境构建文件的目录
   * 注意目标目录在构建之前会被清除 (构建时传入 --no-clean 可关闭该行为)。
   * @default 'dist'
   * */
  outputDir: '../vue-cli-3.x',

  /**
   * 放置生成的静态资源 (js、css、img、fonts) 的 (相对于 outputDir 的) 目录。
   * 从生成的资源覆写 filename 或 chunkFilename 时，assetsDir 会被忽略
   * @default ''
   * */
  assetsDir: 'static',

  /**
   * 指定生成的 index.html 的输出路径 (相对于 outputDir)。也可以是一个绝对路径。
   * @default 'index.html'
   * */
  indexPath: 'index.html',

  /**
   * 生成的静态资源在它们的文件名中包含了 hash
   * @default true
   * */
  filenameHashing: true,

  /**
   * 开发服务器 相关配置
   * */
  devServer: {
    host: '12.12.12.58',
    port: '8282',
    // proxy: {}, // 代理
  },

  /**
   * 分包设置
   * */
  configureWebpack: {
    resolve: {
      extensions: ['.js', '.json', '.vue', '.scss', '.css'],
    },
    externals: {
      'vue': 'Vue',
      'vuex': 'Vuex',
      'vue-router': 'VueRouter',
      // 'element-ui': 'ELEMENT',
      'Axios': 'axios'
    }
  }
};
