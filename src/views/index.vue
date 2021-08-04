<template>
  <audio src="https://wz950116.bj.bcebos.com/public%2Fbg.mp3" loop="loop" autoplay="autoplay">您的浏览器不支持 audio 标签</audio>
  <div class="home">
    <div class="app">
      <div class="module part1">
        <h2></h2>
        <span>试炼之地</span>
        <div class="bg">
          <img src="https://bj.bcebos.com/v1/wz950116/public/jx3sl.png" alt />
        </div>
        <div class="button" @click="$router.push('/sl')">点击进入</div>
      </div>
      <div class="module part2">
        <h2></h2>
        <span>休闲向</span>
        <div class="bg">
          <img src="https://bj.bcebos.com/v1/wz950116/public/jx3pvx.png" alt />
        </div>
        <div class="button" @click="$router.push('/pvx')">点击进入</div>
      </div>
      <div class="module part3">
        <h2></h2>
        <span>副本向</span>
        <div class="bg">
          <img src="https://bj.bcebos.com/v1/wz950116/public/jx3pve.png" alt />
        </div>
        <div class="button" @click="$router.push('/pve')">点击进入</div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { onMounted, onUnmounted } from 'vue'
import '@/assets/js/snowfall.jquery.js'
onMounted(() => {
  $(document).ready(function () {
    $('.home').snowfall({
      image: 'https://bj.bcebos.com/v1/wz950116/public/sakura1.png',
      flakeCount: 20,
      minSpeed: 1,
      minSize: 8,
      maxSize: 15
    })
    $('.home').snowfall({
      image: 'https://bj.bcebos.com/v1/wz950116/public/sakura2.png',
      flakeCount: 20,
      minSpeed: 1,
      minSize: 8,
      maxSize: 15
    })
    $('.home').snowfall({
      image: 'https://bj.bcebos.com/v1/wz950116/public/sakura3.png',
      flakeCount: 20,
      minSpeed: 1,
      minSize: 8,
      maxSize: 15
    })
    $('.home').snowfall({
      image: 'https://bj.bcebos.com/v1/wz950116/public/sakura4.png',
      flakeCount: 20,
      minSpeed: 1,
      minSize: 8,
      maxSize: 15
    })
  })
})

onUnmounted(() => {
  $('.home').snowfall('clear')
})
</script>

<style type="text/css">
@import '../assets/css/index.css';
</style>
