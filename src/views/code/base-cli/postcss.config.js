module.exports = {
  plugins: [
    require('autoprefixer')(),
    // 'postcss-px2rem': { remUnit: 19.2 }
    require('postcss-pxtorem')({
      rootValue: 100,
      unitPrecision: 5,
      propList: ['*'],
      selectorBlackList: [],
      replace: true,
      mediaQuery: false,
      minPixelValue: 0,
      exclude: /node_modules/i
    })
  ]
}
