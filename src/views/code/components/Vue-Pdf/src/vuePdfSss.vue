<!--
 * @Description: 
 * @Author: wangzhen
 * @Date: 2022-02-09 15:42:33
 * @LastEditTime: 2022-02-09 15:53:14
 * @LastEditors: wangzhen
-->
<style src="./annotationLayer.css"></style>
<script>
import componentFactory from './componentFactory'
import pdfjsWrapper from './pdfjsWrapper'

var PDFJS = require('pdfjs-dist/build/pdf.js')

if (process.env.VUE_ENV !== 'server') {
  if (typeof window !== 'undefined' && 'Worker' in window) {
    var PdfjsWorker = require('worker-loader!pdfjs-dist/build/pdf.worker.js')
    PDFJS.GlobalWorkerOptions.workerPort = new PdfjsWorker()
  }
}

var component = componentFactory(pdfjsWrapper(PDFJS))
component.PDFJS = PDFJS

export default component
</script>
