<!--
 * @Description: 
 * @Author: wangzhen
 * @Date: 2022-03-01 17:08:48
 * @LastEditTime: 2022-03-02 15:34:56
 * @LastEditors: wangzhen
-->

<template>
  <div class="code-wrapper">
    <utils></utils> 
  </div>
</template>

<script setup>
import utils from './utils.md'
</script>

<style lang="scss" scoped>
:deep(ul) {
  margin: 10px;
  padding: 20px;
}

.code-wrapper {
  width: 100%;
  height: 100%;
  background: #000000;
  overflow-x: hidden;
  overflow-y: auto;
  color: #ffffff;
  padding: 20px;
  box-sizing: border-box;
  font-size: 16px;
}
</style>