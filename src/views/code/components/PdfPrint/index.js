import Vue from 'vue'
import printPdf from './src/print'
const Constructor = Vue.extend(printPdf)
const instance = new Constructor()

/* istanbul ignore next */
printPdf.install = function(Vue) {
  Vue.component(printPdf.name, printPdf)
}

export const $printPdf = (function() {
  instance.vm = instance.$mount()
  document.body.appendChild(instance.vm.$el)
  instance.dom = instance.vm.$el
  return instance.vm
})()

export default printPdf

// printPdf.setPdfSrc(this.activeId)
