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
    <div class="video-player" @click="outputVisible = false">
      <div class="video-player-content">
        <div class="video-player-title">
          <el-tooltip effect="dark" content="查看视频" placement="top">
            <img class="source" src="https://bj.bcebos.com/v1/wz950116/xj/assets/video_player.png" alt="">
          </el-tooltip>
          <el-tooltip effect="dark" content="查看掉落" placement="top">
            <span class="output" @click.stop="showOutput">{{ currentBOSS.name }}</span>
          </el-tooltip>
          <img class="close" src="https://bj.bcebos.com/v1/wz950116/xj/assets/popup_close.png" alt="" @click="showVideo = false">
        </div>
        <img class="video-pic" :src="'https://wz950116.bj.bcebos.com/xj/' + currentBOSS.type + '/' + currentBOSS.name + '.jpg'" alt="" @click="checkDetail">
      </div>
      <div class="output-list" :style="{ opacity: outputVisible ? 1 : 0 }" @click.stop>
        <span class="output-list-item" v-for="item in currentBOSS.output?.split(',')" :key="item" @click="showOutputDetail(item)">{{ item }},</span>
        <span>{{ currentBOSS.type === '副本' ? '散件,绯红材料,生产原料,图样' : '' }}等等</span>
        <div class="popper-arrow"></div>
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
      outputVisible: false,
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
    checkDetail() {
      this.dialogVisible = true
      this.previewSrcList = ['https://wz950116.bj.bcebos.com/xj/' + this.currentBOSS.type + '/'+ this.currentBOSS.name + '.jpg']
    },
    // 关闭查看大图
    closeImgViewer() {
      this.dialogVisible = false
      this.previewSrcList = []
    },
    // 查看掉落
    showOutput() {
      // if (this.currentBOSS.type === '野外') return
      this.outputVisible = !this.outputVisible
    },
    // 查看掉落大图
    showOutputDetail(item) {
      this.dialogVisible = true
      this.previewSrcList = ['https://wz950116.bj.bcebos.com/xj/掉落/'+ item + '.png']
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
  background: #000000 url('https://bj.bcebos.com/v1/wz950116/xj/其他/2.jpg') no-repeat center;
  background-size: cover;
  overflow: hidden;
  overflow-y: auto;
}
.left-panel, .right-panel {
  .panel-header {
    width: 560px;
    height: 80px;
    margin-left: -15px;
    background: url('https://bj.bcebos.com/v1/wz950116/xj/assets/bg_13.png') no-repeat 0 center;
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
    background: url('https://bj.bcebos.com/v1/wz950116/xj/assets/bg.png') no-repeat center;
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
        background: url('https://bj.bcebos.com/v1/wz950116/xj/assets/bg_1.png') no-repeat center;
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
          background: url('https://bj.bcebos.com/v1/wz950116/xj/assets/bg_2.png') no-repeat center;
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
        display: flex;
        align-items: center;
        position: relative;
        width: 100%;
        font-size: 20px;
        color: #cccccc;
        padding: 16px 0;
        .source {
          cursor: pointer;
        }
        .output {
          margin-left: 10px;
          cursor: pointer;
        }
        .close {
          position: absolute;
          right: 0;
          cursor: pointer;
        }
      }
      .video-pic {
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
.output-list {
  position: absolute;
  left: 8px;
  top: 50px;
  width: 200px;
  padding: 8px;
  background: rgba(6, 39, 81, 1);
  color: rgb(120, 187, 123);
  border-radius: 3px;
  opacity: 0;
  transition: all .5s;
  &-item {
    cursor: pointer;
  }
  .popper-arrow {
    position: absolute;
    left: 40%;
    top: -5px;
    display: block;
    width: 0;
    height: 0;
    border-color: transparent;
    border-style: solid;
    border-width: 6px;
    margin-right: 3px;
    border-top-width: 0;
    border-bottom-color: rgba(6, 39, 81, 1);
  }
}
</style>
