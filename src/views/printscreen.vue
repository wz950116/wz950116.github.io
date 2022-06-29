<template>
  <div class="printscreen">
    <div v-show="false" class="container_12 bg-1"></div>
    <div v-show="false" class="container_12 bg-2"></div>
    <div class="container_12 bg-0" id="wrapper">
      <div class="grid_8" id="content">
        <!-- 标题 -->
        <div class="title">无 上 正 等 正 觉</div>
        <!-- 图片 -->
        <div class="grid_6 prefix_1 suffix_1" id="gallery">
          <div id="pictures" v-show="state.visible">
            <img v-for="i in state.list" :key="i" :src="i" alt="" @load="onLoad" @click="showDetail(i)" />
          </div>

          <div class="next" @click="swapFirstLast(true)">
            <img src="https://bj.bcebos.com/v1/wz950116/jx3-pvx/单人/assets/icon_next.png" alt="" />
          </div>

          <div class="prev" @click="swapFirstLast(false)">
            <img src="https://bj.bcebos.com/v1/wz950116/jx3-pvx/单人/assets/icon_prev.png" alt="" />
          </div>
        </div>
        <!-- 视频 -->
        <div class="annals_icon">
          <div class="rotate"></div>
          <div class="moon" @click="openVideo"></div>
        </div>
      </div>
      <!-- 视频弹窗 -->
      <div v-show="state.dialogVideoPlayer" class="video-dialog" style="display: none">
        <div class="video-player">
          <video :src="state.videoSourceUrl" controls preload="auto" width="800" height="450"></video>
          <a class="video-player-dialog-close" href="javascript:;" @click="closeVideo">×</a>
        </div>
        <div class="mask"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted, reactive } from 'vue'
import '@/assets/js/snowfall.jquery.js'

const state = reactive({
  z: 0,
  inAnimation: false,
  count: 0,
  visible: false,
  dialogVideoPlayer: false,
  videoSourceUrl: '',
  timer: null,
  bgIndex: 0,
  bgImgs: [
    'https://bj.bcebos.com/v1/wz950116/jx3-pvx/单人/assets/index-layer-46-706af0a7.png.webp',
    'https://bj.bcebos.com/v1/wz950116/jx3-pvx/单人/assets/bg-20db2c28.jpg.webp',
    'https://bj.bcebos.com/v1/wz950116/jx3-pvx/单人/assets/bg-fff72bf0.jpg.webp'
  ],
  list: [
    'https://bj.bcebos.com/v1/wz950116/jx3-pvx/单人/无上正等正觉/thumbnail/2022-06-18_23-26-30-000.jpg',
    'https://bj.bcebos.com/v1/wz950116/jx3-pvx/单人/无上正等正觉/thumbnail/2022-05-30_00-26-43-000.jpg',
    'https://bj.bcebos.com/v1/wz950116/jx3-pvx/单人/无上正等正觉/thumbnail/JX3 Online Super-Resolution 2022.05.29 - 23.48.37.73.jpg',
    'https://bj.bcebos.com/v1/wz950116/jx3-pvx/单人/无上正等正觉/thumbnail/JX3 Online Super-Resolution 2022.05.30 - 00.02.14.35.jpg',
    'https://bj.bcebos.com/v1/wz950116/jx3-pvx/单人/无上正等正觉/thumbnail/JX3 Online Super-Resolution 2022.05.30 - 00.16.25.37.jpg',
    'https://bj.bcebos.com/v1/wz950116/jx3-pvx/单人/无上正等正觉/thumbnail/JX3 Online Super-Resolution 2022.05.30 - 00.25.04.16.jpg',
    'https://bj.bcebos.com/v1/wz950116/jx3-pvx/单人/无上正等正觉/thumbnail/JX3 Online Super-Resolution 2022.05.30 - 00.31.30.92.jpg',
    'https://bj.bcebos.com/v1/wz950116/jx3-pvx/单人/无上正等正觉/thumbnail/JX3 Online Super-Resolution 2022.05.30 - 00.37.24.59.jpg',
    'https://bj.bcebos.com/v1/wz950116/jx3-pvx/单人/无上正等正觉/thumbnail/JX3 Online Super-Resolution 2022.05.30 - 00.47.56.27.jpg',
    'https://bj.bcebos.com/v1/wz950116/jx3-pvx/单人/无上正等正觉/thumbnail/JX3 Online Super-Resolution 2022.06.03 - 23.02.54.52.jpg',
    'https://bj.bcebos.com/v1/wz950116/jx3-pvx/单人/无上正等正觉/thumbnail/JX3 Online Super-Resolution 2022.06.27 - 23.52.47.38.jpg',
    'https://bj.bcebos.com/v1/wz950116/jx3-pvx/单人/无上正等正觉/thumbnail/JX3 Online Super-Resolution 2022.06.27 - 23.55.47.26.jpg',
    'https://bj.bcebos.com/v1/wz950116/jx3-pvx/单人/无上正等正觉/thumbnail/JX3 Online Super-Resolution 2022.06.28 - 00.12.07.61.jpg',
    'https://bj.bcebos.com/v1/wz950116/jx3-pvx/单人/无上正等正觉/thumbnail/JX3 Online Super-Resolution 2022.06.28 - 00.14.34.21.jpg'
  ]
})

const onLoad = () => {
  state.count++
  if (state.count === state.list.length) {
    state.visible = true
  }
}

const showDetail = (src) => {
  src = src.replace('/thumbnail', '')
  window.open(src, '_blank')
}

const openVideo = () => {
  state.videoSourceUrl = `https://bj.bcebos.com/v1/wz950116/jx3-pvx/单人/无上正等正觉/剑网3 - 梦江南 @ 电信五区(点卡区) 2022-06-12 23-39-29.mp4`
  state.dialogVideoPlayer = true
}

const closeVideo = () => {
  state.videoSourceUrl = ''
  state.dialogVideoPlayer = false
}

const swapFirstLast = (isFirst) => {
  if (state.inAnimation) return false
  else state.inAnimation = true

  var processZindex, direction, newZindex, inDeCrease

  if (isFirst) {
    processZindex = state.z
    direction = '-'
    newZindex = 1
    inDeCrease = 1
  } else {
    processZindex = 1
    direction = ''
    newZindex = state.z
    inDeCrease = -1
  }

  $('#pictures img').each(function () {
    if ($(this).css('z-index') == processZindex) {
      $(this).animate({ top: direction + $(this).height() + 'px' }, 'slow', function () {
        $(this)
          .css('z-index', newZindex)
          .animate({ top: '0' }, 'slow', function () {
            state.inAnimation = false
          })
      })
    } else {
      $(this).animate({ top: '0' }, 'slow', function () {
        $(this).css('z-index', parseInt($(this).css('z-index')) + inDeCrease)
      })
    }
  })

  return false
}

onMounted(() => {
  $(document).ready(function () {
    // 图片设置层级
    $('#pictures img').each(function () {
      state.z++
      $(this).css('z-index', state.z)
    })
    // 背景图轮播
    state.timer = setInterval(() => {
      const prevClass = `bg-${state.bgIndex}`
      state.bgIndex++
      if (state.bgIndex >= state.bgImgs.length) {
        state.bgIndex = 0
      }
      const src = state.bgImgs[state.bgIndex]
      $('.container_12').removeClass(prevClass).addClass(`bg-${state.bgIndex}`)
    }, 5000)
    // 樱花动画
    $('.container_12').snowfall({
      image: 'https://bj.bcebos.com/v1/wz950116/public/sakura1.png',
      flakeCount: 20,
      minSpeed: 1,
      minSize: 8,
      maxSize: 15
    })
    $('.container_12').snowfall({
      image: 'https://bj.bcebos.com/v1/wz950116/public/sakura2.png',
      flakeCount: 20,
      minSpeed: 1,
      minSize: 8,
      maxSize: 15
    })
    $('.container_12').snowfall({
      image: 'https://bj.bcebos.com/v1/wz950116/public/sakura3.png',
      flakeCount: 20,
      minSpeed: 1,
      minSize: 8,
      maxSize: 15
    })
    $('.container_12').snowfall({
      image: 'https://bj.bcebos.com/v1/wz950116/public/sakura4.png',
      flakeCount: 20,
      minSpeed: 1,
      minSize: 8,
      maxSize: 15
    })
  })
})

onUnmounted(() => {
  $('.container_12').snowfall('clear')
})
</script>

<style lang="scss" scoped>
@import '../assets/css/printscreen.css';
@font-face {
  font-family: 'artfont';
  src: url('../assets/fonts/pvx_printscreen.eot') format('eot');
  src: local('☺'), url('../assets/fonts/pvx_printscreen.eot?#iefix') format('embedded-opentype'), url('../assets/fonts/pvx_printscreen.ttf') format('truetype');
}
* {
  font-family: 'artfont';
  font-style: normal;
}
.container_12 {
  position: relative;
  width: 100%;
  height: 100vh;
  margin: 0 auto;
  transition: all 2s;
  &.bg-0 {
    background: url('https://bj.bcebos.com/v1/wz950116/jx3-pvx/单人/assets/index-layer-46-706af0a7.png.webp') no-repeat center;
    background-size: cover;
  }
  &.bg-1 {
    background: url('https://bj.bcebos.com/v1/wz950116/jx3-pvx/单人/assets/bg-20db2c28.jpg.webp') no-repeat center;
    background-size: cover;
  }
  &.bg-2 {
    background: url('https://bj.bcebos.com/v1/wz950116/jx3-pvx/单人/assets/bg-fff72bf0.jpg.webp') no-repeat center;
    background-size: cover;
  }
  .grid_8 {
    position: relative;
    width: 100%;
    max-width: 1920px;
    height: 100vh;
    margin: 0 auto;
    background: url('https://bj.bcebos.com/v1/wz950116/jx3-pvx/%E5%8D%95%E4%BA%BA/assets/index-layer-38-f6c8e05e.png.webp') no-repeat top center;
    background-size: contain;
    margin-top: 30px;
    .title {
      position: absolute;
      bottom: 100px;
      width: 100%;
      text-align: center;
      font-size: 48px;
    }
    .grid_6 {
      position: absolute;
      top: 15%;
      left: 50%;
      transform: translateX(-50%);
      max-width: 460px;
      width: 25%;
      height: 408px;
      #pictures {
        margin-top: 30px;
        img {
          display: block;
          width: 100%;
          cursor: pointer;
        }
      }
      .prev {
        position: absolute;
        left: 0;
        top: 25%;
        cursor: pointer;
      }
      .next {
        position: absolute;
        right: 0;
        top: 25%;
        cursor: pointer;
      }
    }
    .annals_icon {
      position: absolute;
      right: 60px;
      top: 82px;
      width: 176px;
      height: 176px;
      .rotate {
        width: 176px;
        height: 176px;
        background: url('https://bj.bcebos.com/v1/wz950116/jx3-pvx/单人/assets/annals_rotate_6666b73.png') no-repeat center / 100%;
        position: absolute;
        left: 50%;
        top: 50%;
        margin-top: -88px;
        margin-left: -88px;
        animation: home-rotate 10s linear infinite;
      }
      @keyframes home-rotate {
        100% {
          transform: rotate(360deg);
        }
      }
      .moon {
        position: absolute;
        left: 50%;
        top: 50%;
        display: flex;
        justify-content: center;
        align-items: center;
        margin-top: -80px;
        margin-left: -80px;
        width: 160px;
        height: 160px;
        background: url('https://wz950116.bj.bcebos.com/jx3-pve%2Fassets%2Fplay-icon-97825657.png.webp') no-repeat center / 100%;
        transition: 0.5s;
        cursor: pointer;
      }
      &:hover .moon {
        transform: scale(1.1);
      }
    }
  }
}
/* 视频播放 */
.video-dialog {
  width: 100%;
  height: 100%;
  position: fixed;
  z-index: 1988;
  top: 0px;
  left: 0px;
  overflow: hidden;
}
.video-dialog .video-player {
  position: absolute;
  left: 50%;
  top: 50%;
  margin-left: -400px;
  margin-top: -225px;
  z-index: 1992;
}
.video-dialog .video-player video {
  outline: none;
}
.video-dialog .mask {
  height: 100%;
  background: rgb(0, 0, 0);
  z-index: 1991;
}
.video-dialog .video-player-dialog-close {
  position: absolute;
  right: 10px;
  top: 10px;
  display: block;
  width: 44px;
  height: 44px;
  line-height: 44px;
  font-size: 0;
  text-align: center;
  background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACEAAAAhCAYAAABX5MJvAAAAmUlEQVR42uWY0QqAIAxF9/8/XURQD6bpvNfzYCAFutvBtrkVx30FON4HCuC6BwjyvK86sQrgC2IFSKHfvdAF0IJwgFT10oYqgB4IBcivvUxoxk4umFkfJuEhYMcWD386tbOlfEfp9ekoUsX/VBjbE9EWO4H7BB4deJ7AMyZ+duCnKF5P4JUVXmPi1Tbed+AdGN6L4l05/n/iBMYc97Fe/vBDAAAAAElFTkSuQmCC);
  background-position: center;
  background-repeat: no-repeat;
  transition: transform ease-in-out 0.3s, -webkit-transform ease-in-out 0.3s;
  z-index: 9999;
}
.video-dialog .video-player .video-player-dialog-close {
  right: -90px;
  top: -60px;
}
.video-dialog .video-player-dialog-close:hover {
  transform: rotate(180deg);
}
</style>
