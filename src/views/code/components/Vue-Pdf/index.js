// 相关依赖包
// "pdfjs-dist": "2.2.228"
// "vue-resize-sensor": "^2.0.0"

import Pdfs from './src/vuePdfNoSss.vue'
const VuePdf = {
  install(Vue) {
    Vue.component('vue-pdf', Pdfs)
  }
}
export default VuePdf
