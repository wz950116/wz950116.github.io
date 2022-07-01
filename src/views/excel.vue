<template>
  <div class="hello">
    <remote-js cdn="https://cdn.jsdelivr.net/npm/luckysheet/dist/plugins/js/plugin.js" @load="onLoad"></remote-js>
    <remote-js cdn="https://cdn.jsdelivr.net/npm/luckysheet/dist/luckysheet.umd.js" @load="onLoad"></remote-js>

    <div style="position: absolute; top: 0">
      <input style="font-size: 16px" type="file" @change="uploadExcel" />
    </div>

    <div id="luckysheet" style="margin: 0px; padding: 0px; position: absolute; width: 100%; left: 0px; top: 30px; bottom: 0px"></div>
  </div>
</template>
<script>
import { h } from 'vue'
import LuckyExcel from 'luckyexcel'

export default {
  name: 'HelloWorld',
  props: {
    msg: String
  },
  components: {
    'remote-js': {
      render() {
        return h('script', {
          type: 'text/javascript',
          src: this.cdn
        })
      },
      props: {
        cdn: {
          type: String,
          required: true
        }
      }
    }
  },
  data() {
    return {}
  },
  methods: {
    onLoad() {
      if (luckysheet.create) {
        this.$nextTick(() => {
          $(function () {
            luckysheet.create({
              container: 'luckysheet'
            })
          })
        })
      }
    },
    uploadExcel(evt) {
      const files = evt.target.files
      if (files == null || files.length == 0) {
        alert('No files wait for import')
        return
      }

      let name = files[0].name
      let suffixArr = name.split('.'),
        suffix = suffixArr[suffixArr.length - 1]
      if (suffix != 'xlsx') {
        alert('Currently only supports the import of xlsx files')
        return
      }
      LuckyExcel.transformExcelToLucky(files[0], function (exportJson, luckysheetfile) {
        if (exportJson.sheets == null || exportJson.sheets.length == 0) {
          alert('Failed to read the content of the excel file, currently does not support xls files!')
          return
        }
        window.luckysheet.destroy()

        window.luckysheet.create({
          container: 'luckysheet', //luckysheet is the container id
          showinfobar: false,
          data: exportJson.sheets,
          title: exportJson.info.name,
          userInfo: exportJson.info.name.creator
        })
      })
    }
  }
}
</script>

<style>
@import '../assets/css/luckysheet/pluginsCss.css';
@import '../assets/css/luckysheet/plugins.css';
@import '../assets/css/luckysheet/luckysheet.css';
@import '../assets/css/luckysheet/iconfont.css';
</style>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
div {
  font-size: 21px !important;
}
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
