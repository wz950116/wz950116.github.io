module.exports = {
  presets: ['@vue/cli-plugin-babel/preset'],
  plugins: [
    // pc
    // [
    //   'component',
    //   {
    //     libraryName: 'element-ui',
    //     style: false
    //   }
    // ]
    // h5
    [
      'import',
      {
        libraryName: 'vant',
        libraryDirectory: 'es',
        style: true
      },
      'vant'
    ],
    // this.demo = res.data?.data?.demo 防止无字段报错
    '@babel/plugin-proposal-optional-chaining'
  ]
}
