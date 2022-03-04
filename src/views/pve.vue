<template>
  <div class="back">
    <i class="iconfont icon-ffanhui-" @click="$router.replace('/layout')"></i>
  </div>

  <div class="jx3-pve">
    <el-row type="flex" justify="space-around" class="el-row">
      <el-col :span="11">
        <div class="demo-image">
          <div class="source">
            <div class="demo-image__lazy dps_urls">
              <el-image
                v-for="(item, index) in state.dps_urls"
                :key="index"
                :src="item.src"
                :preview-src-list="state.previewSrcList"
                :alt="item.alt"
                fit="none"
                lazy
                @click="clipImagePreview(item.src)"
              >
                <template v-slot:error class="image-slot">
                  <span @click="clipImagePreview(item.src)">{{ item.alt }}</span>
                </template>
                <template v-slot:placeholder class="image-slot">
                  <span @click="clipImagePreview(item.src)">{{ item.alt }}</span>
                </template>
              </el-image>
            </div>
          </div>
        </div>
        <div class="demo-image">
          <el-row class="jx3_roles">
            <el-col v-for="item in state.roles" :key="item.name" :span="6">
              <div class="block" @click="openDialogEvent(item)">
                <el-avatar :src="item.avatar"></el-avatar>
              </div>
              <div class="sub-title">{{ item.name }}</div>
            </el-col>
          </el-row>
        </div>
      </el-col>
      <el-col :span="11">
        <div class="demo-video">
          <div class="source">
            <img id="video-poster" :src="state.videoPosterUrl" width="600" alt @load="videoPosterLoad" />
            <div class="index-clickArea-exCZ0" @click="openVideo">
              <div class="index-playBtnBorder-3opK4"></div>
              <div class="index-playBtn-4hA5j"></div>
            </div>
          </div>
          <el-collapse v-model="state.activeNames" accordion @change="handleChange">
            <el-collapse-item v-for="item in state.fb_urls" :key="item.key" :name="item.code" :disabled="state.activeNames === item.code">
              <template #title>
                <span class="video_title">{{ item.name }}</span>
              </template>
              <div>{{ item.desc }}</div>
            </el-collapse-item>
          </el-collapse>
        </div>
      </el-col>
    </el-row>

    <el-dialog center fullscreen :title="state.dialogTitle" v-model="state.dialogVisible">
      <div class="text" v-html="state.roleCurrentInfo"></div>
      <el-pagination
        layout="prev, pager, next"
        :current-page="state.currentPage"
        :page-size="1"
        :total="state.roleInfo && state.roleInfo.length"
        @current-change="handleCurrentChange"
      ></el-pagination>
    </el-dialog>

    <div v-show="state.dialogVideoPlayer" class="video-dialog" style="display: none">
      <div class="video-player">
        <video :src="state.videoSourceUrl" controls :poster="state.videoPosterUrl" preload="auto" width="800" height="450"></video>
        <a class="video-player-dialog-close" href="javascript:;" @click="state.dialogVideoPlayer = false">×</a>
      </div>
      <div class="mask"></div>
    </div>
  </div>
</template>

<script setup>
import { nextTick, onMounted, reactive, getCurrentInstance } from 'vue'
import res from '@/assets/data/pve.json'

document.title = '副本向'

const { proxy } = getCurrentInstance()

const state = reactive({
  dialogVisible: false,
  dialogVideoPlayer: false,
  videoPosterLoading: null,
  activeNames: 'bhd',
  dps_urls: [],
  fb_urls: [],
  previewSrcList: ['https://wz950116.bj.bcebos.com/jx3-pve%2F秘境%2Floading.png'],
  videoSourceUrl: '',
  videoPosterUrl: 'https://wz950116.bj.bcebos.com/jx3-pve%2F秘境%2Fbhd_poster.jpg',
  roles: [],
  dialogTitle: '',
  roleInfo: [],
  roleCurrentInfo: '',
  currentPage: 1,
  initShowNum: 3,
  fbGroupNum: 1,
  responseData: {},
  currentVideo: 'bhd'
})

const handleChange = (val) => {
  state.currentVideo = val
  state.videoPosterUrl = `https://wz950116.bj.bcebos.com/jx3-pve%2F秘境%2F${val}_poster.jpg`
  state.videoPosterLoading = proxy.$loading({
    lock: true,
    text: ''
  })
}
const videoPosterLoad = () => {
  if (state.videoPosterLoading) {
    state.videoPosterLoading.close()
  }
}
const clipImagePreview = (src) => {
  state.previewSrcList = [src]
}
const openDialogEvent = (role) => {
  state.currentPage = 1
  state.dialogTitle = role.name
  state.roleInfo = role.introduce
  if (role.introduce && role.introduce.length > 0) {
    state.roleCurrentInfo = role.introduce[0].replace(/\n/gm, '</p><p>')
  }
  state.dialogVisible = true
  nextTick(() => {
    $('.el-dialog__body .text').scrollTop(0)
  })
}
const handleCurrentChange = (val) => {
  state.currentPage = val
  if (state.roleInfo[val - 1]) {
    state.roleCurrentInfo = state.roleInfo[val - 1].replace(/\n/gm, '</p><p>')
  }
  nextTick(() => {
    $('.el-dialog__body .text').scrollTop(0)
  })
}
const openVideo = () => {
  state.videoSourceUrl = `https://wz950116.bj.bcebos.com/jx3-pve%2F秘境%2F${state.currentVideo}.mp4`
  state.dialogVideoPlayer = true
}
onMounted(() => {
  const loading = proxy.$loading({
    lock: true,
    text: ''
  })

  var winW = document.documentElement.clientWidth || document.body.clientWidth
  if (winW < 1440) {
    proxy.$message({
      message: '建议使用1440以上分辨率浏览',
      type: 'warning'
    })
  }

  state.responseData = res
  state.roles = res.roles
  state.dps_urls = res.dps
  state.fb_urls = res.fb

  setTimeout(() => {
    loading.close()
  }, 2000)
})
</script>

<style scoped>
@import '../assets/css/jx3-pve.css';
</style>

<style lang="scss">
.jx3-pve {
  .el-dialog {
    background: url("https://wz950116.bj.bcebos.com/jx3-pve%2Fassets%2Fbg_new.jpg") no-repeat center !important;
    background-size: cover !important;
    overflow: hidden !important;
  }
  .el-dialog__header {
    border-bottom: 1px solid #f1f1f1;
    padding: 15px 20px !important;
  }
  .el-dialog__header .el-dialog__title {
    font-size: 24px;
  }
  .el-dialog__body {
    padding-top: 0 !important;
  }
  .el-dialog__body .text {
    width: 100%;
    height: calc(100vh - 140px);
    overflow: auto;
    font-size: 18px;
    line-height: 24px;
    padding-top: 10px;
  }
  .el-dialog__body .text::-webkit-scrollbar-track-piece {
    background-color: transparent;
  }
  .el-dialog__body .text::-webkit-scrollbar {
    width: 9px;
    height: 9px;
  }
  .el-dialog__body .text::-webkit-scrollbar-thumb {
    background-color: #98e3d6;
    background-clip: padding-box;
    min-height: 28px;
    border-radius: 10px;
  }
  .el-dialog__body .text::-webkit-scrollbar-thumb:hover {
    background-color: #6edbc8;
  }
  .el-dialog__body .text p {
    text-indent: 2em;
  }
  .el-dialog__body .el-pagination {
    position: fixed;
    bottom: 13px;
    right: 20px;
    z-index: 999;
  }
  .el-dialog__headerbtn .el-dialog__close {
    color: #f56c6c !important;
    font-weight: 700 !important;
  }

  .el-image-viewer__mask {
    opacity: 1 !important;
  }

  .el-message {
    padding-top: 18px;
  }
  .el-message__icon {
    color: transparent !important;
  }
  .el-message__icon, .el-message__content {
    font-size: 18px !important;
  }

  .el-pagination button {
    background: transparent !important;
  }
  .el-pagination .el-pager li {
    background: transparent !important;
  }
}
</style>
