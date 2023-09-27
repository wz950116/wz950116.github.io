<template>
  <div class="panel-container">
    <!-- 左侧 -->
    <div class="left-panel">
      <div class="panel-header">
        <div class="title">野外BOSS</div>
      </div>
      <div class="comprehensive-overview">
        <div class="comprehensive-overview-part1" v-for="(item, index) in ywBOSS" :key="item.area">
          <div class="part1-title">{{ item.area }}</div>
          <div class="part1-list">
            <div v-for="i in item.list" :key="i.name" class="part1-list-item" :title="'来源：' + i.origin" @click="partClick(i, '野外')">
              <div :class="'gradient-font-' + index">Lv{{ i.level }}</div>
              <div>{{ i.name }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 右侧 -->
    <div class="right-panel">
      <div class="panel-header">
        <div class="title">副本BOSS</div>
      </div>
      <div class="comprehensive-overview">
        <div class="comprehensive-overview-part1" v-for="(item, index) in fbBOSS" :key="item.area">
          <div class="part1-title">{{ item.area }}</div>
          <div class="part1-list">
            <div v-for="i in item.list" :key="i.origin" class="part1-list-item" :title="'来源：' + i.origin" @click="partClick(i, '副本')">
              <div :class="'gradient-font-' + index">Lv{{ i.level }}</div>
              <div>{{ i.origin }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="video-player-wrapper" v-if="showVideo">
    <div class="video-player">
      <div class="video-player-content">
        <div class="video-player-title">
          {{ currentBOSS.name }}<img src="@/assets/images/popup_close.png" alt="" @click="showVideo = false">
        </div>
        <img class="video-resource" :src="'https://wz950116.bj.bcebos.com/xj/' + currentBOSS.type + '/' + currentBOSS.name + '.jpg'" alt="" @click="checkDetail">
      </div>
    </div>
    <div class="video-player-mask"></div>
  </div>

  <el-image-viewer v-if="dialogVisible" :url-list="previewSrcList" @close="closeImgViewer" />
</template>

<script>
import ywBOSS from '@/assets/data/xj_yw.json'
import fbBOSS from '@/assets/data/xj_fb.json'
export default {
  name: 'xj',
  data() {
    return {
      dialogVisible: false,
      showVideo: false,
      previewSrcList: [],
      currentBOSS: {},
      ywBOSS: [],
      fbBOSS: []
    }
  },
  mounted() {
    this.ywBOSS = ywBOSS
    this.fbBOSS = fbBOSS
  },
  methods: {
    partClick(item, type) {
      this.currentBOSS = {
        ...item,
        type
      }
      this.showVideo = true
    },
    // 打开查看大图
    checkDetail(src) {
      this.dialogVisible = true
      this.previewSrcList = ['https://wz950116.bj.bcebos.com/xj/' + this.currentBOSS.type + '/'+ this.currentBOSS.name + '.jpg']
    },
    // 关闭查看大图
    closeImgViewer() {
      this.dialogVisible = false
      this.previewSrcList = []
    }
  }
}
</script>

<style lang="scss" scoped>
@font-face {
  font-family: 'YouSheBiaoTiHei';
  src: local('☺'), url('@/assets/fonts/YouSheBiaoTiHei.ttf') format('truetype');
}
* {
  box-sizing: border-box;
  font-family: YouSheBiaoTiHei;
  user-select: none;
}
.panel-container {
  display: flex;
  justify-content: space-between;
  width: 100%;
  height: 100%;
  padding: 20px;
  background: #000000 url('https://bj.bcebos.com/v1/wz950116/xj/其他/3.jpg') no-repeat center;
  background-size: contain;
  overflow: hidden;
  overflow-y: auto;
}
.left-panel, .right-panel {
  .panel-header {
    width: 560px;
    height: 80px;
    margin-left: -15px;
    background: url('@/assets/images/bg_13.png') no-repeat 0 center;
    .title {
      background: linear-gradient(270deg, #cbd9f4, #ffffff);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      font-size: 26px;
      color: #ffffff;
      margin-left: 60px;
      padding-top: 14px;
    }
  }
  .comprehensive-overview {
    width: 530px;
    height: 902px;
    padding: 16px;
    margin-top: -15px;
    background: url('@/assets/images/bg.png') no-repeat center;
    color: #ffffff;
    overflow: hidden;
    overflow-y: auto;
    &::-webkit-scrollbar {
      display: none;
      width: 0 !important;
    }
    .gradient-font-0 {
      background: linear-gradient(180deg, #ffffff 21%, #43bfff 76%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      font-size: 20px;
      font-weight: 700;
    }
    .gradient-font-1 {
      background: linear-gradient(180deg, #ffffff 21%, #ffaf43 76%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      font-size: 20px;
      font-weight: 700;
    }
    .gradient-font-2 {
      background: linear-gradient(180deg, #ffffff 21%, #ff0000 76%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      font-size: 20px;
      font-weight: 700;
    }
    .gradient-font-3 {
      background: linear-gradient(180deg, #ffffff 21%, #32cd7a 76%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      font-size: 20px;
      font-weight: 700;
    }
    .gradient-font-4 {
      background: linear-gradient(180deg, #ffffff 21%, #ff8100 76%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      font-size: 20px;
      font-weight: 700;
    }
    &-part1 {
      margin-bottom: 16px;
      .part1-title {
        width: 498px;
        height: 61px;
        line-height: 61px;
        text-align: center;
        font-size: 26px;
        background: url('@/assets/images/bg_1.png') no-repeat center;
        user-select: none;
      }
      .part1-list {
        display: flex;
        flex-wrap: wrap;
        &-item {
          width: 157px;
          height: 61px;
          text-align: center;
          font-size: 18px;
          color: #ffffff;
          background: url('@/assets/images/bg_2.png') no-repeat center;
          margin-top: 9px;
          margin-right: 13px;
          line-height: 25px;
          padding: 5px;
          cursor: pointer;
          &:nth-of-type(3n) {
            margin-right: 0;
          }
        }
      }
    }
  }
}
.video-player-wrapper {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  .video-player {
    position: absolute;
    left: 50%;
    top: 30%;
    margin-left: -284px;
    width: 568px;
    padding: 2px;
    background: linear-gradient(to bottom, rgba(0, 155, 252, 0.6) 0%, rgb(0, 155, 252) 100%);
    border-radius: 5px;
    z-index: 999;
    .video-player-content {
      width: 100%;
      height: 100%;
      padding: 0 24px 24px;
      background: rgba(6, 39, 81, 0.8);
      border-radius: 5px;
      .video-player-title {
        position: relative;
        width: 100%;
        font-size: 20px;
        color: #cccccc;
        padding: 16px 0;
        background: url('@/assets/images/video_player.png') no-repeat center left;
        text-indent: 30px;
        img {
          position: absolute;
          right: 0;
          cursor: pointer;
        }
      }
      .video-resource {
        width: 100%;
        cursor: pointer;
      }
    }
  }
  .video-player-mask {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    opacity: .8;
    background: #000000;
  }
}
</style>
