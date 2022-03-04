import page from './src/main.vue'

/**
 * @param {string} url pdfurl
 * @param {boolean} visible 控制弹框可见
 * @param {string} height pdf弹框内容高度
 * @param {object} pdfStyle vuepdf样式
 */

const PdfPreview = {
  install(Vue) {
    Vue.component('pdf-preview', page)
  }
}
export default PdfPreview

