<!--
 * @Description: 
 * @Author: wangzhen
 * @Date: 2021-02-24 16:31:09
 * @LastEditTime: 2022-03-02 11:48:59
 * @LastEditors: wangzhen
-->

<template>
  <div class="back">
    <i class="iconfont icon-ffanhui-" @click="$router.replace('/layout')"></i>
  </div>

  <div class="container">
    <div class="box">
      <div class="banner-img banner-1" @click="$router.push('/printscreen')"></div>
      <div class="banner-img banner-2" @click="mountsClick"></div>
      <div class="banner-img banner-3" @click="$router.push('/dl')"></div>
      <div class="banner-img banner-4" @click="$router.push('/qy')"></div>
      <div class="banner-img banner-5" @click="$router.push('/qs')"></div>
    </div>
    <div class="nav">
      <div class="nav-item nav-1 nav-item-active">
        <div class="top-line"></div>
        <div class="center-line">截图</div>
        <div class="bottom-line"></div>
      </div>
      <div class="nav-item nav-2">
        <div class="top-line"></div>
        <div class="center-line">坐骑</div>
        <div class="bottom-line"></div>
      </div>
      <div class="nav-item nav-3">
        <div class="top-line"></div>
        <div class="center-line">掉落</div>
        <div class="bottom-line"></div>
      </div>
      <div class="nav-item nav-4">
        <div class="top-line"></div>
        <div class="center-line">奇遇</div>
        <div class="bottom-line"></div>
      </div>
      <div class="nav-item nav-5">
        <div class="top-line"></div>
        <div class="center-line">趣事</div>
        <div class="bottom-line"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
const mountsClick = () => {
  window.open('/mounts/index.html');
};
onMounted(() => {
  // 轮播
  let activeImg = 0,
    len = $('.banner-img').length,
    onOff = false;
  $('.nav-item')
    .eq(activeImg)
    .addClass('nav-item-active')
    .siblings()
    .removeClass('nav-item-active');
  const timerFn = () => {
    activeImg++;
    if (activeImg >= len) activeImg = 0;
    $('.nav-item')
      .eq(activeImg)
      .addClass('nav-item-active')
      .siblings()
      .removeClass('nav-item-active');
    $('.banner-img').eq(activeImg).fadeIn(800).siblings().hide();
  };
  // let timer = setInterval(timerFn, 8000)

  // 点击跳转
  $('.nav-item').click(function() {
    // clearInterval(timer)
    activeImg = $(this).index();
    $('.nav-item')
      .eq(activeImg)
      .addClass('nav-item-active')
      .siblings()
      .removeClass('nav-item-active');
    $('.banner-img').eq(activeImg).fadeIn(800).siblings().hide();
    onOff = true;
  });

  // 鼠标滞留时停止轮播，移开后继续轮播
  $('.nav-item').on('mouseout', function() {
    if (onOff) {
      // timer = setInterval(timerFn, 8000)
      onOff = false;
    }
  });
});
</script>

<style scoped>
@import "../assets/css/jx3-pvx.css";
</style>
