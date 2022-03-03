<!--
 * @Description: 
 * @Author: wangzhen
 * @Date: 2022-03-02 11:26:40
 * @LastEditTime: 2022-03-02 15:33:58
 * @LastEditors: wangzhen
-->

<template>
  <div class="layout">
    <router-view />
  </div>
</template>

<script setup>
</script>

<style lang='scss'>
html,
body,
#app,
.layout {
  width: 100%;
  height: 100%;
}
.layout {
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  ul,
  li,
  div,
  dl,
  dt,
  dd {
    list-style: none;
  }
}
</style>
