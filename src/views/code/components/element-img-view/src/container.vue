<template>
  <div v-if="showViewer" class="image-viewer-conponent">
    <ImageViewer v-if="showViewer" :z-index="zIndex" :on-close="closeViewer" :url-list="previewSrcList" />
  </div>
</template>

<script type="text/ecmascript-6">
export default {
  name: 'imageViewerToBody',
  components: {
    'ImageViewer': () => import('./ImageViewer/src/image-viewer')
  },
  data() {
    return {
      showViewer: false,
      previewSrcList: [],
      zIndex: 0
    }
  },
  methods: {
    show(urlList, index) {
      this.previewSrcList = urlList
      this.zIndex = index || 2000
      this.showViewer = true
    },
    closeViewer() {
      this.previewSrcList = []
      this.showViewer = false
    }
  }
}
</script>
