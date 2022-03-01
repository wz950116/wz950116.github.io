## 相关模块
``` bash
import CryptoJS from 'crypto-js'
import MD5 from 'crypto-js/md5'
import gcoord from 'gcoord'
import Bowser from 'bowser'
import { Decimal } from 'decimal.js'
import NP from 'number-precision'
import CreateAPI from 'vue-create-api';
import ClipboardJS from 'clipboard';
```
## 微信语音转换功能
``` bash
function wechatSign(jsApiList = ['getLocation']) {
  const hostUrl = /(Android)/i.test(navigator.userAgent) ? location.href.split('#')[0] : window.entryUrl;
  var nonceStr = (function() {
    return Math.random().toString(36).substr(2, 16);
  })();
  var timestamp = (function() {
    return parseInt(new Date().getTime() / 1000) + '';
  })();
  return new Promise((resolve) => {
    getWechatSign({ hostUrl, nonceStr, timestamp }).then(({ success, data, message }) => {
      if (success) {
        wx.config({
          debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
          appId: process.env.VUE_APP_APPID, // 必填，公众号的唯一标识
          timestamp, // 必填，生成签名的时间戳
          nonceStr, // 必填，生成签名的随机串
          signature: data, // 必填，签名
          jsApiList: jsApiList // 必填，需要使用的JS接口列表
        });
      }
      resolve();
    });
  });
}
export async function getWx() {
  await wechatSign([
    'translateVoice',
    'startRecord',
    'stopRecord',
    'onVoiceRecordEnd',
    'playVoice',
    'onVoicePlayEnd',
    'stopVoice',
    'uploadVoice'
  ]);
  return new Promise((resolve, reject) => {
    console.log(wx);
    wx.ready(() => {
      resolve();
    });
  })
}
```
## 引入第三方小型组件或者全局注册公共组件
``` bash
import Reality from 'xxxx';
Vue.use(CreateAPI);
Vue.createAPI(Reality, true);
# 调用该组件内部AAA方法
this.$createReality().show()
```
## 解决加减乘除精度丢失问题
``` bash
export function numberFixed(a, b, symbol = '+') {
  let result = ''
  switch (symbol) {
    case '+':
      result = new Decimal(a).add(new Decimal(b))
      break
    case '-':
      result = new Decimal(a).sub(new Decimal(b))
      break
    case '*':
      result = new Decimal(a).mul(new Decimal(b))
      break
    case '/':
      result = new Decimal(a).div(new Decimal(b))
      break
  }
  return result
}
export function numberFixed(a, b, symbol = '+') {
  let result = ''
  switch (symbol) {
    case '+':
      result = NP.add(a, b)
      break
    case '-':
      result = NP.sub(a, b)
      break
    case '*':
      result = NP.multi(a, b)
      break
    case '/':
      result = NP.divide(a, b)
      break
  }
  return result
}
```
## 复制插件
``` bash
export function initClipboardJS() {
  const clipboard = new ClipboardJS('#description')
  clipboard.on('success', function() {
    this.$message.success('复制成功')
    e.clearSelection()
  })
}
```
## 时间相关
* 格式化
``` bash
export function formatTime(time, pattern) {
  if (arguments.length === 0) {
    return null
  }
  if (!time) return ''
  const _pattern = pattern || 'yyyy-MM-dd hh:mm:ss'
  const date = new Date(time)
  if (date.toString() === 'Invalid Date') {
    return ''
  }
  const timeObj = {
    yyyy: date.getFullYear(),
    MM: `0${date.getMonth() + 1}`.slice(-2),
    M: date.getMonth() + 1,
    dd: `0${date.getDate()}`.slice(-2),
    d: date.getDate(),
    hh: `0${date.getHours()}`.slice(-2),
    h: date.getHours(),
    mm: `0${date.getMinutes()}`.slice(-2),
    m: date.getMinutes(),
    ss: `0${date.getSeconds()}`.slice(-2),
    s: date.getSeconds()
  }
  const timeStr = _pattern.replace(/(yyyy|MM|M|dd|d|hh|h|mm|m|ss|s)+/g, function(match, p) {
    const value = timeObj[p]
    return value
  })
  return timeStr
}
```
* 获取每个月第一天0时时间戳
``` bash
export function getFirstDay() {
  // 获取当天0点时间戳
  const todayStart = +new Date().setHours(0, 0, 0, 0)
  return new Date(todayStart).setDate(1)
}
```
* 距离指定日期剩余时间
``` bash
export function remainTime(endTime) {
  if (endTime === '' || endTime === undefined) return ''
  // 现在时间
  const now = new Date()
  // 截止时间
  const until = new Date(endTime)
  // 计算时会发生隐式转换，调用valueOf()方法，转化成时间戳的形式
  const days = (until - now) / 1000 / 3600 / 24
  // 下面都是简单的数学计算
  const day = Math.floor(days)
  const hours = (days - day) * 24
  const hour = Math.floor(hours)
  const minutes = (hours - hour) * 60
  const minute = Math.floor(minutes)
  const seconds = (minutes - minute) * 60
  const second = Math.floor(seconds)
  const back = day + '天' + hour + '小时' + minute + '分钟' + second + '秒'
  return day < 0 ? '' : back
}
```
* 获取某个月的日历表
``` bash
export function initCalendar(year = new Date().getFullYear(), month = new Date().getMonth() + 1) {
  const calendars2 = [];
  const riliStyle2 = [];
  const cale = [], riliStyle = [];
  const firstDay = new Date(`${year}-${month}`);
  for (let i = 0; i < firstDay.getDay(); i++) {
    cale.unshift({ day: new Date(firstDay.getTime() - 86400000 * (i + 1)).getDate() });
    riliStyle.unshift('dis');
  }
  let n = firstDay.getTime();
  let nextMM = '';
  if (this.month === 12) {
    nextMM = new Date(`${year + 1}/${1}`).getTime();
  } else {
    nextMM = new Date(`${year}/${month + 1}`).getTime();
  }

  const newDate = new Date();
  while (n < nextMM) {
    const currentData = new Date(n);
    const _f = currentData > newDate;
    const getDate = currentData.getDate();
    const getDay = currentData.getDay();
    let riliStyleItem = '';
    let isWork = 0;

    if (getDay === 0 || getDay === 6) {
      isWork = 0;
    } else {
      isWork = 1;
    }

    if (isWork === 0) {
      riliStyleItem = _f ? 'holiday' : 'holiday-no';
    }

    if (isWork === 1) {
      riliStyleItem = _f ? 'nomal' : 'nomal-no';
    }

    riliStyle.push(riliStyleItem);
    cale.push({ day: getDate, isWork: isWork });
    n = n + 86400000;
  }
  for (let i = new Date(n).getDay(); i < 7; i++) {
    cale.push({ day: new Date(n).getDate() });
    n = n + 86400000;
    riliStyle.push('dis');
  }
  for (let i = 0; i < cale.length; i += 7) {
    const arr = [], arr0 = [];
    for (let j = 0; j < 7; j++) {
      arr.push(cale[i + j]);
      arr0.push(riliStyle[i + j]);
    }
    calendars2.push(arr);
    riliStyle2.push(arr0);
  }
  console.log(calendars2, riliStyle2, 0);
  this.$forceUpdate();
}
```
## 导出excel
* 返回blob转base64形式
``` bash
export function _downloadFile(resBlob, fileName) {
  const reader = new FileReader()
  // 转换为base64，可以直接放入a标签href
  reader.readAsDataURL(resBlob)
  reader.onload = e => {
    // 转换完成，创建一个a标签用于下载
    const a = document.createElement('a')
    a.download = `${fileName}.xlsx`
    a.href = e.target.result
    document.body.append(a)
    a.click()
    document.body.removeChild(a)
  }
}
```
* 返回二进制流转blob形式 reponseType: arraybuffer
``` bash
export function downloadFile(resBlob, fileName) {
  // 获取文件流,将流转换为excle
  const blob = new Blob([resBlob], {
    type: "application/vnd.ms-excel"
  })
  const a = document.createElement("a")
  const reg = /filename=(.*.xls)/
  const _fileName = res.headers ? decodeURIComponent(reg.exec(res.headers['content-disposition'])[1]) : '新建文件'
  // 正则匹配获取文件名
  a.download = fileName || _fileName
  a.href = URL.createObjectURL(blob)
  a.click()
  a = null
  URL.revokeObjectURL(a.href)
}
```
## 深拷贝
``` bash
export function deepCopy(obj) {
  var result = Array.isArray(obj) ? [] : {}
  for (var key in obj) {
    if (obj.hasOwnProperty(key)) {
      if (typeof obj[key] === 'object' && obj[key] !== null) {
        result[key] = deepCopy(obj[key])
      } else {
        result[key] = obj[key]
      }
    }
  }
  return result
}
```
## 根据ID获取该节点的所有父节点的数组对象
``` bash
export function getParentId(list, value, children = 'children', key = 'id', extraKey = 'userId') {
  for (const i in list) {
    if (list[i][key] === value || list[i][extraKey] === value) {
      return [list[i]]
    }
    if (list[i][children] && list[i][children].length) {
      const node = getParentId(list[i][children], value, children, key, extraKey)
      if (node !== undefined) {
        return node.concat(list[i])
      }
    }
  }
}
```
## 根据ID获取该节点的对象
``` bash
export function getId(list, value, children = 'children', key = 'id', extraKey = 'userId') {
  for (const i in list) {
    if (list[i][key] === value || list[i][extraKey] === value) {
      return list[i]
    }
    if (list[i][children]) {
      const node = getId(list[i][children], value, children, key, extraKey)
      if (node !== undefined) {
        return node
      }
    }
  }
}
```
## 精确到指定小数点 解决了toFixed不精确的js BUG
``` bash
export function toFixed(num, iCount) {
  // iCount 保留几位小数
  var srcValue = num;
  var zs = true;

  // 判断是否小数长度不大于iCount
  var floatValue = srcValue.toString().split(".");
  if (floatValue[1].length <= iCount) {
    return Number(srcValue).toFixed(iCount);
  }

  // 判断是否是负数
  if (srcValue < 0) {
    srcValue = Math.abs(srcValue);
    zs = false;
  }
  var iB = Math.pow(10, iCount);

  // 有时乘100结果也不精确
  var value1 = srcValue * iB;
  var anumber = new Array();
  var anumber1 = new Array();
  var fvalue = value1;
  var value2 = value1.toString();
  var idot = value2.indexOf(".");

  // 如果是小数
  if (idot != -1) {
    anumber = srcValue.toString().split(".");
    // 如果是科学计数法结果
    if (anumber[1].indexOf("e") != -1) {
      return Math.round(value1) / iB;
    }
    anumber1 = value2.split(".");
    if (anumber[1].length <= iCount) {
      return parseFloat(num, 10);
    }
    var fvalue3 = parseInt(anumber[1].substring(iCount, iCount + 1), 10);
    if (fvalue3 >= 5) {
      fvalue = parseInt(anumber1[0], 10) + 1;
    }
    else {
      // 对于传入的形如111.834999999998 的处理（传入的计算结果就是错误的，应为111.835）
      if (fvalue3 == 4 && anumber[1].length > 10 && parseInt(anumber[1].substring(iCount + 1, iCount + 2), 10) == 9) {
        fvalue = parseInt(anumber1[0], 10) + 1;
      }
      else {
        fvalue = parseInt(anumber1[0], 10);
      }
    }
  }
  
  // 如果是负数就用0减四舍五入的绝对值
  if (zs) {
    return fvalue / iB;
  }
  else {
    return 0 - fvalue / iB;
  }
}
```
## 坐标转换（WGS84：天地图、 GCJ02：高德、 BD09：百度）
``` bash
export function transformPoint(target, type = 'WGS84', targetType = 'GCJ02') {
  return gcoord.transform(target, gcoord[type], gcoord[targetType])
}
```
## 防抖动
``` bash
export function debounce(func, delay) {
  let timer
  return function (...args) {
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(() => {
      func.apply(this, args)
    }, delay)
  }
}
```
## 节流
``` bash
export function throttle(func, delay) {
  var timer = null;
  return function () {
    var context = this;
    var args = arguments;
    if (!timer) {
      timer = setTimeout(function () {
        func.apply(context, args);
        timer = null;
      }, delay);
    }
  }
}
```
## 加密
* Base64
``` bash
export const base64 = {
  en: (data) => CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(data)),
  de: (data) => CryptoJS.enc.Base64.parse(data).toString(CryptoJS.enc.Utf8)
}
```
* MD5加密
``` bash
export function encryptMD5(password) {
  return MD5(password).toString()
}
```
* AES
``` bash
# 加密 需要约定好盐值keyStr
export function encrypt(word, keyStr) {
  keyStr = keyStr || 'abcdefgabcdefg12'
  var key = CryptoJS.enc.Utf8.parse(keyStr)
  var srcs = CryptoJS.enc.Utf8.parse(word)
  var encrypted = CryptoJS.AES.encrypt(srcs, key, { mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7 })
  return encrypted.toString()
}
# 解密
export function decrypt(word, keyStr) {
  keyStr = keyStr || 'abcdefgabcdefg12'
  var key = CryptoJS.enc.Utf8.parse(keyStr)
  var decrypt = CryptoJS.AES.decrypt(word, key, { mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7 })
  return CryptoJS.enc.Utf8.stringify(decrypt).toString()
}
```
## 验证浏览器版本
``` bash
const browser = Bowser.getParser(window.navigator.userAgent)
export const isValidBrowser = browser.satisfies({
  windows: {
    'internet explorer': '>11',
    'Microsoft Edge': '>51'
  },
  macos: {
    safari: '>10.1'
  },
  firefox: '>53',
  opera: '>=56',
  chrome: '>51'
})
```
## 判断是否为JSON对象
``` bash
export function isJSON(val) {
  // 传入JSON字符串
  if (typeof val !== 'string') {
    return false
  }
  try {
    const obj = JSON.parse(val.replace(/\s*/g, ""))
    if (Object.prototype.toString.call(obj) === '[object Object]') {
      return true
    } else {
      return false
    }
  } catch (e) {
    return false
  }
}
```
## 判断设备
``` bash
export function equip() {
  if (navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i)) {
    return '移动端'
  }
  return 'PC端'
}
```
## 判断对象是否一致
``` bash
export function isObjectValueEqual(a, b) {
  var aProps = Object.keys(a);
  var bProps = Object.keys(b);
  if (aProps.length != bProps.length) {
    return false;
  }
  for (var i = 0; i < aProps.length; i++) {
    var propName = aProps[i];
    if (Object.prototype.toString.call(a[propName]) === "[object Object]" && Object.prototype.toString.call(a[propName]) === "[object Object]") {
      if (!isObjectValueEqual(a[propName], b[propName])) {
        return false
      }
    } else if (a[propName] !== b[propName]) {
      return false;
    }
  }
  return true;
}
```
## 本地存储
``` bash
export const storage = {
  get(key) {
    return localStorage.getItem(key);
  },
  set(key, value) {
    if (Object.prototype.toString.call(value) === '[object Object]') {
      localStorage.setItem(key, JSON.stringify(value));
    } else {
      localStorage.setItem(key, value);
    }
  },
  remove(key) {
    localStorage.removeItem(key);
  }
}
```
## 截图上传
``` bash
export const shot = async () => {
  const loading = this.$loading({
    lock: true,
    text: '截图上传中......',
    spinner: 'el-icon-loading',
    background: 'rgba(0, 0, 0, 0.7)'
  })

  const video = document.getElementsByClassName('video-shot')[0]

  video.setAttribute('crossOrigin', 'Anonymous')
  var w = video.offsetWidth
  var h = video.offsetHeight

  var canvas = document.createElement('canvas')
  canvas.width = w
  canvas.height = h
  canvas.style.width = w + 'px'
  canvas.style.height = h + 'px'

  var context = canvas.getContext('2d')
  context.scale(0.75, 0.8)
  context.drawImage(video, 0, 0)

  var formdata = new FormData()
  formdata.append('file', dataURLtoFile(canvas.toDataURL('image/jpeg'), '视频截图.jpg'))
  const { data } = await axios.post('v1/file/normalUpload', formdata)

  loading.close()
  if (data.success) {
    this.$message({ type: 'success', message: '上传截图成功！' })
  } else {
    this.$message({ type: 'error', message: '上传截图失败！' })
  }
}
```
## 正则相关
* 千分位化
``` bash
export function thousands(value, digit) {
  if (value === '' || value === undefined || value === null || isNaN(value)) return
  if (!digit) {
    value = value.toString()
  } else {
    const decimal = new Decimal(value)
    value = decimal.toFixed(digit, Decimal.ROUND_HALF_UP)
  }
  if (/\./.test(value)) {
    return value.replace(/\d(?=(\d{3})+\.)/g, '$&,').replace(/\d{3}(?![.]|$)/g, '$&')
  } else {
    return value.replace(/\d(?=(\d{3})+$)/g, '$&,')
  }
}
```
* 身份证
``` bash
export function isCardNo(card) {
  // 身份证号码为15位或者18位，15位时全为数字，18位前17位为数字，最后一位是校验位，可能为数字或字符X
  var reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
  if (reg.test(card) === false) {
    alert("身份证输入不合法");
    return false;
  }
  return true;
}
```
* 银行卡
``` bash
export function isBankCard(card) {
  var reg = new RegExp(/^([1-9]{1})(\d{11}|\d{15}|\d{16}|\d{17}|\d{18})$/)
  if (reg.test(card) === false) {
    alert("银行卡输入不合法");
    return false;
  }
  return true;
}
```
* 手机号
``` bash
export function validateTelephone(obj) {
  var pattern = /(^(\d{3,4}-)?\d{7,8})$|(^1[3|4|5|7|8][0-9]{9})/;
  if (pattern.test(obj)) {
    return true;
  } else {
    return false;
  }
}
```
* URL
``` bash
export function validateURL(textval) {
  const urlregex = /^(https?|http?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/
  return urlregex.test(textval)
}
```
* 获取URL中指定参数值
``` bash
export function getQueryString(name) {
  const href = window.location.href
  const reg = new RegExp(name + '=[^&|#|\/]*')
  const res = href.match(reg)
  return res ? href.match(reg)[0].split('=')[1] : ''
}
```
* 邮箱
``` bash
export function validateEmail(email) {
  let emails = email.replace(/^\s+|\s+$/g, "");
  return /^[\w\-+]+(\.[\w\-+]+)*@(\w-?)+(\.\w{2,})+$/.test(emails);
}
```
* 整数
``` bash
export function isInteger(val) {
  if (typeof obj === 'number' && !isNaN(num) && num % 1 === 0) {
    return true
  } else {
    return false
  }
  // 也可以用Number.isInteger或正则
  // parseInt来判断是否等于自身针对超大数值会出问题
}
```
* 正整数
``` bash
export function validateNumber(str) {
  const reg = /^[0-9]*[1-9][0-9]*$/
  return reg.test(str)
  // number > 0 && Number.isInteger(Number(number))
}
```
* 数值
``` bash
export function validateNumber(str) {
  const regPos = /^\d+(\.\d+)?$/
  const regNeg = /^(-(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*)))$/
  return regPos.test(str) || regNeg.test(str)
}
```
* 验证密码至少 8 位，需包含数字、英文字母、特殊符号（~!@#$%^&*）
``` bash
export function validateStrongPassword(str) {
  const reg = /^(?=.*\d)(?=.*[a-zA-Z])(?=.*[~!@#$%^&*])[\da-zA-Z~!@#$%^&*]{8,}$/
  return reg.test(str)
}
```