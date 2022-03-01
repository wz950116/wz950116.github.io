<template>
  <div class="back">
    <i class="iconfont icon-ffanhui-" @click="$router.push('/')"></i>
  </div>

  <!-- 列表 -->
  <div class="box">
    <div class="hj_w1200">
      <h2 class="hj_title">
        <img src="https://bj.bcebos.com/v1/wz950116/public/hj_title.png" />
      </h2>
      <div class="hj_list">
        <div class="hj_box_btn">
          <a v-for="tab in state.tabs" :key="tab" href="javascript:;" :class="{ active: tab === activeTab }" @click="tabClick(tab)">{{ state.mapToName[tab] }}</a>
        </div>
        <div v-for="tab in state.tabs" :key="tab" class="pic_box">
          <div v-if="activeTab === tab" class="pic_list">
            <ul ref="piclist" class="piclist">
              <li v-for="(i, index) in state.tableData[activeTab]" :key="i.thumbnail" :style="{ marginTop: index % 2 == 1 ? '50px' : '0' }">
                <el-image class="img_box" :src="i.thumbnail" :alt="i.alt" fit="none" lazy @click="checkDetail(i)"></el-image>
                <div class="picdetails"></div>
                <span></span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Loading -->
  <div v-show="loading" class="container">
    <div class="progress">
      <div class="progress-bar">
        <div class="progress-shadow"></div>
      </div>
    </div>
  </div>

  <div v-show="!dialogVisible" class="more_shadow"></div>

  <el-image-viewer v-if="dialogVisible" :url-list="state.previewSrcList" @close="closeImgViewer" />
</template>

<script setup>
import { ref, reactive, onMounted, nextTick } from 'vue'
import SL_110 from '@/assets/data/110sl.json'
import SL_100 from '@/assets/data/100sl.json'
import SL_95 from '@/assets/data/95sl.json'
import SL_90 from '@/assets/data/90sl.json'

const activeTab = ref('SL_110')
const dialogVisible = ref(false)
const loading = ref(false)
const piclist = ref(null)

const state = reactive({
  activeImage: {},
  tabs: ['SL_110', 'SL_100', 'SL_95', 'SL_90'],
  tableData: {
    SL_110: SL_110.data,
    SL_100: SL_100.data,
    SL_95: SL_95.data,
    SL_90: SL_90.data
  },
  mapToName: {
    SL_110: '奉天证道',
    SL_100: '世外蓬莱',
    SL_95: '剑胆琴心',
    SL_90: '安史之乱'
  },
  previewSrcList: []
})

onMounted(() => { })

const tabClick = (name) => {
  activeTab.value = name
}
// 打开查看大图
const checkDetail = (data) => {
  loading.value = true
  dialogVisible.value = true
  state.previewSrcList = [data.src]
  nextTick(() => {
    document.querySelector('.el-image-viewer__img').onload = () => {
      loading.value = false
    }
  })
}
// 关闭查看大图
const closeImgViewer = () => {
  loading.value = false
  dialogVisible.value = false
  state.previewSrcList = []
}
// 保存图片到本地
const downloadImage = () => {
  const { src } = state.activeImage
  if (src) {
    const canvas = document.createElement('canvas')
    const img = document.createElement('img')
    img.onload = function (e) {
      canvas.width = img.width
      canvas.height = img.height
      canvas.getContext('2d').drawImage(img, 0, 0, img.width, img.height)
      canvas.toBlob((blob) => {
        var link = document.createElement('a')
        link.href = window.URL.createObjectURL(blob)
        link.download = name
        link.click()
      })
    }
    img.setAttribute('crossOrigin', 'Anonymous')
    img.src = src
  }
}
</script>

<style type="text/css">
</style>

<style scoped>
@font-face {
  font-family: 'artfont';
  src: url('../assets/fonts/sl.eot') format('eot');
  src: local('☺'), url('../assets/fonts/sl.eot?#iefix') format('embedded-opentype'), url('../assets/fonts/sl.ttf') format('truetype');
}

* {
  font-family: 'artfont';
  font-style: normal;
}
.more_shadow {
  position: fixed;
  bottom: 0;
  width: 100%;
  height: 200px;
  background: url('https://wz950116.bj.bcebos.com/jx3-pve%2Fassets%2Fshadow.png') no-repeat center top;
  z-index: 99;
}

.icon-ffanhui- {
  position: fixed;
  left: 20px;
  top: 10px;
  font-size: 48px;
  color: #f2e2bf;
  cursor: pointer;
  z-index: 99;
}

.box {
  position: relative;
  width: 100%;
  min-width: 1200px;
  max-width: 1920px;
  height: 100%;
  font-size: 12px;
  background: #000000 url('https://wz950116.bj.bcebos.com/jx3-sl%2Fpublic%2Fbg.jpg') no-repeat;
  background-size: cover;
  background-attachment: fixed;
}

.box::-webkit-scrollbar {
  display: none;
}

.hj_w1200 {
  width: 1166px;
  height: 100%;
  margin: 0 auto;
  position: relative;
  right: 0;
  z-index: 2;
  overflow: hidden;
  margin-bottom: 100px;
}

.hj_w1200 .hj_title {
  width: 100%;
  height: 76px;
  text-align: center;
  margin: 0 auto;
  padding-top: 80px;
}

.hj_list {
  width: 1200px;
  height: auto;
}

.hj_box_btn {
  display: flex;
  justify-content: space-around;
  width: 100%;
  height: 60px;
  margin: 0 auto;
  text-align: center;
}

.hj_box_btn a {
  width: 131px;
  height: 46px;
  display: block;
  float: left;
  text-align: center;
  line-height: 46px;
  font-size: 28px;
  color: #b39a64;
}

.hj_box_btn a.active {
  background: url('https://wz950116.bj.bcebos.com/jx3-sl%2Fpublic%2Fp_line.png') no-repeat center bottom;
  color: #f2e2bf;
}

.hj_list .piclist {
  width: 100%;
  height: calc(100vh - 268px);
  overflow-y: auto;
  margin: 50px 0 0 40px;
}

.hj_list .piclist li {
  width: 258px;
  height: 382px;
  position: relative;
  float: left;
  display: block;
  margin: 0 30px 0 0;
  cursor: pointer;
  overflow: hidden;
}

.hj_list .piclist li span {
  display: block;
  border: 1px solid #fff;
  position: absolute;
  top: 8px;
  left: 8px;
  bottom: 8px;
  right: 8px;
  opacity: 0.3;
  filter: alpha(opacity=30);
  pointer-events: none;
}

.hj_list .piclist .picdetails {
  width: 258px;
  height: 382px;
  position: absolute;
  top: 0;
  left: 0;
  text-align: center;
  line-height: 403px;
  color: #ecc270;
  text-indent: -9999px;
  pointer-events: none;
}

.close {
  position: fixed;
  top: 50px;
  right: 90px;
  width: 80px;
  height: 80px;
  background: url('https://wz950116.bj.bcebos.com/jx3-sl%2Fpublic%2Fclose.png');
  z-index: 99;
}

.hj_list .piclist li {
  width: 258px;
  height: 382px;
}

.hj_list .piclist li .img_box {
  width: 258px;
  height: 382px;
  line-height: 382px;
  text-align: center;
  color: #666666;
}

.hj_list .piclist li:hover .picdetails {
  display: block;
  background: rgba(0, 0, 0, 0.5) url('https://wz950116.bj.bcebos.com/jx3-sl%2Fpublic%2Fcheck.png') no-repeat center;
}

.hj_list .piclist li:hover span {
  opacity: 1;
}

.container {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  z-index: 99999;
}

.progress {
  background-color: #e5e9eb;
  height: 0.25em;
  position: relative;
  width: 24em;
}

.progress-bar {
  animation-duration: 3s;
  animation-name: width;
  background-image: linear-gradient(to right, #4cd964, #5ac8fa, #007aff, #34aadc, #5856d6, #ff2d55);
  background-size: 24em 0.25em;
  height: 100%;
  position: relative;
}

.progress-shadow {
  background-image: linear-gradient(to bottom, #000000, transparent);
  height: 4em;
  position: absolute;
  top: 100%;
  transform: skew(45deg);
  transform-origin: 0 0;
  width: 100%;
}

@keyframes width {
  0%,
  100% {
    transition-timing-function: cubic-bezier(1, 0, 0.65, 0.85);
  }

  0% {
    width: 0;
  }

  100% {
    width: 100%;
  }
}
</style>
