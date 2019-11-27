const { override, fixBabelImports, addLessLoader, addBabelPlugin } = require('customize-cra')

// const rootImport = [
//   'root-import',
//   {
//     rootPathPrefix: '~',
//     rootPathSuffix: 'src'
//   }
// ]
// module.exports = config => injectBabelPlugin(rootImport, config)

module.exports = override(
  fixBabelImports('import', {
    libraryName: 'antd',
    libraryDirectory: 'es',
    style: true
  }),
  addLessLoader({
    javascriptEnabled: true,
    modifyVars: { '@body-background': '#eee' }
    // modifyVars: { '@primary-color': '#1DA57A' }
  }),
  addBabelPlugin('babel-plugin-root-import', {
    rootPathSuffix: './',
    rootPathPrefix: '~/'
  })
)
