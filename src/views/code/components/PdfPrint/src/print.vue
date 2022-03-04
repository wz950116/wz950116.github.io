<!--
 * @Description: 
 * @Author: wangzhen
 * @Date: 2021-10-18 10:18:33
 * @LastEditTime: 2022-02-09 15:39:16
 * @LastEditors: wangzhen
-->
<template>
  <div class="iframe-print">
    <vue-pdf @finished="finish" style="width:1000px;height:1000px" ref="myPdfComponent" :src="pdfSrc"></vue-pdf>
  </div>
</template>

<script>
import { _printPreview } from './store'
import pdfs from '@/components/Vue-Pdf/src/vuePdfNoSss'
export default {
  name: 'printPdf',
  components: {
    'vue-pdf': pdfs
  },
  data() {
    return {
      pdfSrc: '',
      numPages: ''
    }
  },
  methods: {
    finish() {
      setTimeout(() => {
        this.$refs.myPdfComponent.print()
        window.URL.revokeObjectURL(this.pdfSrc)
      }, 1000)
    },
    // 增加type 来区分现场检查（勘查）笔录 特殊接口调用
    async setPdfSrc(id) {
      const loading = this.$loading({ lock: true, text: '正在生成打印文书内容，请稍候...', spinner: 'el-icon-loading', background: 'rgba(0, 0, 0, 0.7)' })
      _printPreview(id).then((res) => {
        loading.close()
        if (res && res.hasOwnProperty('success')) {
          this.$message({
            type: 'error',
            message: res.message || '获取文书失败！'
          })
          return false
        }
        const url = window.URL.createObjectURL(res.data)
        const pdfPage = pdfs.createLoadingTask(url)
        pdfPage.then(pdf => {
          this.pdfSrc = pdfPage
          this.numPages = pdf.numPages
        })
      }).catch(() => {
        loading.close()
      })
    },
    loadPdf() {
    }
  }
}
</script>
<style lang="scss">
.iframe-print{
  width: 0;
  height: 0;
  display: none;
}
</style>
