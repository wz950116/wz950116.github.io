<!--
 * @Description: 
 * @Author: wangzhen
 * @Date: 2022-02-14 14:42:27
 * @LastEditTime: 2022-02-14 14:45:55
 * @LastEditors: wangzhen
-->
<template>
  <div>
    <el-color-picker
      class="theme-picker"
      popper-class="theme-picker-dropdown"
      v-model="theme"
      :predefine="['#000000', '#00ff00']">
    </el-color-picker>
  </div>
</template>

<script>
const version = require('element-ui/package.json').version
const ORIGINAL_THEME = '#409EFF'
export default {
  data() {
    return {
      theme: ORIGINAL_THEME,
      chalk: ''
    }
  },
  watch: {
    theme(val) {
      if (typeof val !== 'string') return
      const themeCluster = this.getThemeCluster(val.replace('#', ''))
      const getHandler = (variable, id) => {
        return () => {
          const originalCluster = this.getThemeCluster(ORIGINAL_THEME.replace('#', ''))
          const newStyle = this.updateStyle(this[variable], originalCluster, themeCluster)

          let styleTag = document.getElementById(id)
          if (!styleTag) {
            styleTag = document.createElement('style')
            styleTag.setAttribute('id', id)
            document.head.appendChild(styleTag)
          }
          styleTag.innerText = newStyle
        }
      }
      // 替换主题
      const chalkHandler = getHandler('chalk', 'chalk-style')

      if (!this.chalk) {
        const url = `https://unpkg.com/element-ui@${version}/lib/theme-chalk/index.css`
        this.getCSSString(url, chalkHandler, 'chalk')
      } else {
        // 这里可以写自己想要的逻辑（如： 改变布局等情况）
        chalkHandler()
      }
    }
  },
  methods: {
    // 替换默认颜色关键词
    updateStyle(style, oldCluster, newCluster) {
      let newStyle = style
      oldCluster.forEach((color, index) => {
        newStyle = newStyle.replace(new RegExp(color, 'ig'), newCluster[index])
      })
      return newStyle
    },

    getCSSString(url, callback, variable) {
      // GET请求样式资源
      const xhr = new XMLHttpRequest()
      xhr.onreadystatechange = () => {
        if (xhr.readyState === 4 && xhr.status === 200) {
          this[variable] = xhr.responseText.replace(/@font-face{[^}]+}/, '')
          callback()
        }
      }
      xhr.open('GET', url)
      xhr.send()

      // POST请求样式资源
      // const xhr = new XMLHttpRequest()
      // xhr.onreadystatechange = () => {
      //   if (xhr.readyState === 4 && xhr.status === 200) {
      //     this[variable] = xhr.responseText.replace(/@font-face{[^}]+}/, '')
      //     callback()
      //   }
      // }
      // xhr.open('POST', '/element/theme/updateVariable?version=' + version)
      // xhr.send(JSON.stringify({"global":{"$--color-primary": this.theme},"local":{}}))
    },

    // 根据主题色分不同色级
    getThemeCluster(theme) {
      const tintColor = (color, tint) => {
        let red = parseInt(color.slice(0, 2), 16)
        let green = parseInt(color.slice(2, 4), 16)
        let blue = parseInt(color.slice(4, 6), 16)

        if (tint === 0) { // when primary color is in its rgb space
          return [red, green, blue].join(',')
        } else {
          red += Math.round(tint * (255 - red))
          green += Math.round(tint * (255 - green))
          blue += Math.round(tint * (255 - blue))

          red = red.toString(16)
          green = green.toString(16)
          blue = blue.toString(16)

          return `#${red}${green}${blue}`
        }
      }

      const shadeColor = (color, shade) => {
        let red = parseInt(color.slice(0, 2), 16)
        let green = parseInt(color.slice(2, 4), 16)
        let blue = parseInt(color.slice(4, 6), 16)

        red = Math.round((1 - shade) * red)
        green = Math.round((1 - shade) * green)
        blue = Math.round((1 - shade) * blue)

        red = red.toString(16)
        green = green.toString(16)
        blue = blue.toString(16)

        return `#${red}${green}${blue}`
      }

      const clusters = [theme]
      for (let i = 0; i <= 9; i++) {
        clusters.push(tintColor(theme, Number((i / 10).toFixed(2))))
      }
      clusters.push(shadeColor(theme, 0.1))
      return clusters
    }
  }
};
</script>
