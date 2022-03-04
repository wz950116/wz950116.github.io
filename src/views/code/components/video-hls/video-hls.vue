<template>
  <video class="video" ref="video" preload controls autoplay></video>
</template>

<script>
import Hls from 'hls.js'
export default {
  props: {
    src: String
  },
  data() {
    return {
      hls: null
    }
  },
  watch: {
    src: {
      handler(newSrc) {
        if (!newSrc) return
        // 先清空上一个
        this.hls && this.hls.stopLoad()
        this.$nextTick(() => {
          const video = this.$refs.video
          if (Hls.isSupported()) {
            this.hls = new Hls()
            this.hls.loadSource(newSrc)
            this.hls.attachMedia(video)
            this.hls.on(Hls.Events.MANIFEST_PARSED, function() {
              video.play()
            })
          } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
            video.src = newSrc
            video.addEventListener('loadedmetadata', function() {
              video.play()
            })
          }
        })
      },
      immediate: true
    }
  },
  beforeDestroy() {
    console.log(111)
    this.hls && this.hls.stopLoad()
    this.hls && this.hls.destroy()
  }
}
</script>

<style scoped>
  .video {
    width: 414px;
    height: 253px;
    object-fit: fill;
    outline: none
  }
</style>
