<!--
 * @Description: 
 * @Author: wangzhen
 * @Date: 2022-02-09 15:42:26
 * @LastEditTime: 2022-02-09 15:57:36
 * @LastEditors: wangzhen
-->
<template>
  <el-dialog :visible.sync="visible" :title="'PDF预览'" :modal-append-to-body="true" append-to-body @opened="handleOpened" @close="handleClose">
    <div :style="{ height: height, overflowY: 'auto', overflowX: 'hidden' }">
      <pdf v-for="page in pages" slot="content" :key="page" :src="src" :page="page" :style="pdfStyle"></pdf>
    </div>
  </el-dialog>
</template>

<script>
import pdf from '@/components/Vue-Pdf/src/vuePdfNoSss.vue'
export default {
  components: {
    pdf
  },
  props: {
    height: {
      type: String,
      default: '600px'
    },
    pdfStyle: {
      type: Object,
      default() {
        return {
          width: '100%',
          height: '100%'
        }
      }
    }
  },
  data() {
    return {
      pages: 0,
      src: null,
      visible: false,
      url: ''
    }
  },
  methods: {
    resetData() {
      this.pages = 0
      this.src && this.src.destroy()
      this.src = null
    },
    handleClose() {
      this.resetData()
    },
    handleOpenDialog(url) {
      if (!url) {
        return
      }
      this.url = url instanceof Array ? url[0].url : url
      this.visible = true
    },
    handleOpened() {
      if (!this.url) {
        return
      }
      const loadingTask = pdf.createLoadingTask(this.url)
      loadingTask.promise.then((pdf) => {
        this.pages = pdf.numPages
        this.src = loadingTask
      })
    }
  }
}
</script>
