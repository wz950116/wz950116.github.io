<template>
  <div class="pvx-qs">
    <div class="el-icon-back" @click="$router.replace('/pvx')">←</div>
    <el-timeline>
      <el-timeline-item v-for="i in list" :key="i" :timestamp="i.replace(/.*\/(.*)\.(png|jpg)/, '$1')" placement="top">
        <el-card>
          <el-image class="pic" :src="i" alt=""></el-image>
        </el-card>
      </el-timeline-item>
    </el-timeline>
  </div>
</template>

<script>
export default {
  data() {
    return {
      list: [
        'https://wz950116.bj.bcebos.com/jx3-pvx/趣事/2018-09-09_15-15-03-000.png',
        'https://wz950116.bj.bcebos.com/jx3-pvx/趣事/2019-11-29_22-19-58-000.png',
        'https://wz950116.bj.bcebos.com/jx3-pvx/趣事/2020-02-06_12-55-24-000.png',
        'https://wz950116.bj.bcebos.com/jx3-pvx/趣事/2020-03-24_22-04-21-000.png',
        'https://wz950116.bj.bcebos.com/jx3-pvx/趣事/2020-06-21_13-15-35-000.png',
        'https://wz950116.bj.bcebos.com/jx3-pvx/趣事/2020-08-26_10-50-03-000.jpg',
        'https://wz950116.bj.bcebos.com/jx3-pvx/趣事/2020-10-27_23-25-37-000.png',
        'https://wz950116.bj.bcebos.com/jx3-pvx/趣事/2021-04-10_23-24-07-000.jpg',
        'https://wz950116.bj.bcebos.com/jx3-pvx/趣事/2022-06-27_22-15-35-000.jpg',
        'https://wz950116.bj.bcebos.com/jx3-pvx/趣事/2022-07-14_22-34-54-000.jpg',
        'https://wz950116.bj.bcebos.com/jx3-pvx/趣事/2022-08-07_00-09-14-000.jpg',
        'https://wz950116.bj.bcebos.com/jx3-pvx/趣事/2022-11-14_01-26-27-000.jpg',
        'https://wz950116.bj.bcebos.com/jx3-pvx/趣事/2023-03-09_23-16-35-000.jpg',
        'https://wz950116.bj.bcebos.com/jx3-pvx/趣事/2023-04-23_22-23-27-000.jpg',
        'https://wz950116.bj.bcebos.com/jx3-pvx/趣事/jx3.seasunwbl.com_role_consignment_id=748901146616815616.png',
        'https://wz950116.bj.bcebos.com/jx3-pvx/趣事/新年抽卡.jpg'
      ]
    }
  }
}
</script>

<style lang="scss" scoped>
.pvx-qs {
  position: relative;
  height: 100%;
  padding: 50px;
  box-sizing: border-box;
  overflow-y: auto;

  .el-icon-back {
    position: absolute;
    left: 10px;
    top: -10px;
    font-size: 48px;
    cursor: pointer;
  }

  .pic {
    width: 100%;
  }
}
</style>