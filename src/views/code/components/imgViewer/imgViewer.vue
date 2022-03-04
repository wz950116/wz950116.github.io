<template>
  <!-- 
    基于v-viewer实现图片预览
    
    main.js内容如下：
    import 'viewerjs/dist/viewer.css'
    import Viewer from 'v-viewer'
    import ImgViewer from '@/components/imgViewer/imgViewer' // 即此文件

    Vue.use(CreateAPI)
    Vue.use(Viewer, { defaultOptions: { zIndex: 9999 }})
    Vue.createAPI(ImgViewer, true)

    调用方式如下：
    this.$createImgViewer({
      $props: {
        images: [
          'https://fuss10.elemecdn.com/a/3f/3302e58f9a181d2509f3dc0fa68b0jpeg.jpeg',
          'https://fuss10.elemecdn.com/1/34/19aa98b1fcb2781c4fba33d850549jpeg.jpeg'
        ],
        index: 1
      }
    }).show()
   -->
  <div>
    <viewer
      v-if="images && images.length"
      ref="viewer"
      :images="images"
      :options="options"
      class="viewer"
      @inited="inited"
    >
      <img
        v-for="source in images"
        :key="source"
        :src="source"
        :data-source="source"
        class="image"
        :data-index="index"
      />
    </viewer>
  </div>
</template>

<script>
export default {
  name: 'imgViewer',
  props: {
    index: {
      type: Number,
      default: 0
    },
    images: {
      type: [Array],
      default() {
        return []
      }
    }
  },
  data() {
    return {
      options: {
        url: 'data-source'
      },
      dataIndex: 0,
      $viewer: null
    }
  },
  watch: {
    index(newIndex) {
      this.dataIndex = newIndex
    }
  },
  created() {
    this.dataIndex = this.index
  },
  methods: {
    inited(viewer) {
      this.$viewer = viewer
    },
    show() {
      if (this.images.length > 0) {
        if (this.$viewer) {
          this.$viewer.view(this.dataIndex)
        } else {
          setTimeout(() => {
            this.$viewer.view(this.dataIndex)
          }, 200)
        }
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.image {
  display: none;
}
</style>
<style>
.viewer-loading > img {
  display: none; /* hide big images when it is loading */
}
</style>
