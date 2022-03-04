/*
 * @Description: 
 * @Author: wangzhen
 * @Date: 2022-02-09 15:42:33
 * @LastEditTime: 2022-02-09 15:53:45
 * @LastEditors: wangzhen
 */
var loaderUtils = require('loader-utils')

module.exports = function (content) {
  var options = loaderUtils.getOptions(this)

  var data
  if (content instanceof Buffer) { data = content } else { data = Buffer.from(content) }

  return 'export default Buffer.from("' + data.toString('base64') + '", "base64")'
}

module.exports.raw = true
