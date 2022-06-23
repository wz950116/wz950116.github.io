<template>
  <div class="back">
    <i class="iconfont icon-ffanhui-" @click="$router.replace('/pvx')"></i>
  </div>
  <div class="wrapper">
    <div id="container">
      <ul id="grid" class="group">
        <li v-for="item in data.slice(activePage * pageNum, (activePage + 1) * pageNum)" :key="item.src" @click="checkDetail(item)">
          <div class="img-name">{{ item.label }}</div>
          <div class="img-desc">
            <div class="img-type">{{ item.type }}</div>
            <div class="img-date">{{ item.date ? item.date.slice(0, 10) : '具体不详' }}</div>
          </div>
          <el-image src="https://bj.bcebos.com/v1/wz950116/jx3-pvx/掉落/assets/previewImg.png" :preview-src-list="state.previewSrcList"></el-image>
        </li>
      </ul>
      <!-- 分页 -->
      <ul class="ant-pagination">
        <li v-for="(item, i) in pages" :key="i" :title="i + 1" :class="['ant-pagination-item', `ant-pagination-item-${i + 1}`, { 'ant-pagination-item-active': i === activePage }]" @click="activePage = i">
          <a>{{ i + 1 }}</a>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { data } from '@/assets/data/pvx_diaoluo.json'
const activePage = ref(0)
const pageNum = 12
const pages = new Array(Math.ceil(data.length / pageNum))
const state = reactive({
  previewSrcList: [
    'https://fuss10.elemecdn.com/8/27/f01c15bb73e1ef3793e64e6b7bbccjpeg.jpeg',
    'https://fuss10.elemecdn.com/1/8e/aeffeb4de74e2fde4bd74fc7b4486jpeg.jpeg'
  ]
})
// 打开查看大图
const checkDetail = (data) => {
  state.previewSrcList = data.src instanceof Array ? data.src : [data.src]
}
</script>

<style scoped>
@font-face {
  font-family: 'artfont';
  src: url('../assets/fonts/pvx_diaoluo.eot') format('eot');
  src: local('☺'), url('../assets/fonts/pvx_diaoluo.eot?#iefix') format('embedded-opentype'), url('../assets/fonts/pvx_diaoluo.ttf') format('truetype');
}

* {
  font-family: 'artfont';
  font-style: normal;
}

.icon-ffanhui- {
  position: fixed;
  left: 20px;
  top: 10px;
  font-size: 48px;
  color: #99ccff;
  cursor: pointer;
  z-index: 99;
}

.wrapper {
  width: 100%;
  height: 100%;
  background: url('https://wz950116.bj.bcebos.com/jx3-pvx%2F%E6%8E%89%E8%90%BD%2Fassets%2Fxfe-layer-55-fb30668f.jpg.webp') no-repeat center;
  background-size: cover;
  padding-top: 0.1px;
  overflow: hidden;
}

#container {
  width: 1000px;
  height: 100%;
  padding: 0 20px;
  margin: 0 auto 100px;
  overflow: auto;
}

#container::-webkit-scrollbar {
  display: none;
}

#grid {
  display: flex;
  flex-wrap: wrap;
  margin: 30px 0 5px;
}

#grid li {
  position: relative;
  display: flex;
  flex-flow: column;
  justify-content: center;
  align-items: center;
  float: left;
  width: 290px;
  height: 188px;
  line-height: 188px;
  text-align: center;
  margin: 0 25px 25px 0;
  background: #ffffff;
  font-size: 24px;
  letter-spacing: -1px;
  border-top: 1px solid rgba(255, 255, 255, 0.25);
  transition: all 0.15s ease-in;
  cursor: pointer;
  box-shadow: 0 0 5px rgb(0, 0, 0, 0.25);
}

#grid li:nth-child(3n) {
  margin-right: 0;
}

/* element-ui查看大图添加动画样式后会有BUG */
/* #grid li:hover {
  z-index: 2;
  transform: scale(1.2);
}

#grid li:nth-child(3n-2):hover {
  transform: scale(1.2) translateY(-30px) rotate(-2.5deg);
}

#grid li:nth-child(3n):hover {
  transform: scale(1.2) translateY(-30px) rotate(2.5deg);
} */

#grid li .img-name {
  position: absolute;
  left: 50%;
  top: 50%;
  margin-left: -145px;
  margin-top: -94px;
  width: 100%;
  height: 100%;
}
#grid li .img-desc {
  position: absolute;
  left: 10px;
  right: 10px;
  bottom: 0;
  display: flex;
  justify-content: space-between;
  line-height: 36px;
  font-size: 18px;
}
#grid li .img-desc .img-type {
  width: 50px;
  text-align: left;
}

.ant-pagination {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  color: rgba(0, 0, 0, 0.65);
  font-size: 14px;
  font-variant: tabular-nums;
  line-height: 1.5715;
  list-style: none;
  font-feature-settings: 'tnum';
  text-align: center;
  margin-bottom: 10px;
}
.ant-pagination-prev,
.ant-pagination-next {
  display: inline-block;
  min-width: 32px;
  height: 32px;
  color: rgba(0, 0, 0, 0.65);
  font-family: Arial;
  line-height: 32px;
  text-align: center;
  vertical-align: middle;
  list-style: none;
  border-radius: 2px;
  cursor: pointer;
  transition: all 0.3s;
}
.ant-pagination-prev {
  margin-right: 8px;
}
.ant-pagination-disabled {
  cursor: not-allowed;
}
.ant-pagination-item {
  display: inline-block;
  min-width: 32px;
  height: 32px;
  margin-right: 8px;
  font-family: Arial;
  line-height: 30px;
  text-align: center;
  vertical-align: middle;
  list-style: none;
  background-color: #fff;
  border: 1px solid #d9d9d9;
  border-radius: 2px;
  outline: 0;
  cursor: pointer;
  user-select: none;
}
.ant-pagination-item-active {
  font-weight: 500;
  background: #fff;
  border-color: #1890ff;
}
.ant-pagination-item a {
  display: block;
  padding: 0 6px;
  color: rgba(0, 0, 0, 0.65);
  transition: none;
  font-size: 22px;
}
.ant-pagination-item-active a {
  color: #1890ff;
}
</style>
