<template>
  <div v-loading="loading" class="cgMap">
    <div ref="cgMap" style="width:100%;height:100%;position:relative;"></div>
  </div>
</template>
<script>
import LeafletMap from './utils/leaflet/LeafletMap.js'
import MapController from './utils/MapController.js'
export default {
  name: 'CgMap',
  props: {
    /** 地图中心点位 */
    center: {
      type: Array,
      default() {
        return []
      }
    },
    point: {
      type: Array,
      default() {
        return []
      }
    },
    /** 地图缩放等级 */
    zoom: {
      type: Number,
      default: 10
    },
    /** 是否显示责任网格 */
    useGrid: {
      type: Boolean,
      default: false
    },
    /** 使用网格管理 */
    useCellController: {
      type: Boolean,
      default: false
    },
    cgMapSelectClass: {
      type: String,
      default: ''
    },
    /** 社区：community 街道：street 区：district */
    layers: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      map: null,
      loading: false,
      searchValue: '',
      currentMap: 'LeafletMap',
      componentList: [],
      componentCode: ''
    }
  },
  created() {
    this.map = null
    this.mapController = null
  },
  mounted() {
    this.initMapController()
    if (this.center) {
      this.setCenter(this.center)
    }
  },
  destroyed() {
    this.mapController && this.mapController.destroy()
    this.map = null
    this.mapController = null
  },
  methods: {
    initMapController() {
      const mapController = new MapController(this.$refs.cgMap, {
        useCellController: this.useCellController,
        componentLoading: this.componentLoading,
        useGrid: this.useGrid,
        layers: this.layers,
        mapClick: this.mapClick,
        markerClick: this.markerClick
      })
      mapController.add('LeafletMap', LeafletMap)
      this.mapController = mapController
      this.selectMap()
      this.showPoint()
    },

    async markerClick() {},

    showPoint() {
      const point = this.point.filter(item => Boolean(item))
      if (point.length === 2) {
        setTimeout(() => {
          this.setCenter(point)
          this.addDivIcon(point)
          this.setZoom(15)
        }, 300)
      }
    },

    /** 切换地图 */
    selectMap() {
      if (this.currentMap === 'LeafletMap') {
        const map = this.mapController.useMap(this.currentMap)
        this.map = map
        this.stopReality()
        this.$emit('map-change', map)
      } else {
        this.startReality()
      }
    },

    // 开启实景功能
    startReality() {
      const mapInstance = this.map.$map
      if (!this.reality) {
        this.reality = this.$createReality()
      }
      this.reality.init3DReality(mapInstance)
    },
    // 关闭实景
    stopReality() {
      if (this.reality) {
        this.reality.exitReality()
      }
    },

    /** 设置缩放等级 */
    setZoom(...args) {
      this.map.setZoom(...args)
    },

    /** 设置中心位置并且缩放 */
    setCenter(...args) {
      this.map.setCenter(...args)
    },

    /** 添加 divIcon */
    addDivIcon(...args) {
      this.map.addDivIcon(...args)
    },

    /** 移除 divIcon */
    removeDivIcon() {
      this.map.removeDivIcon()
    },

    /** 添加 divIcon */
    removeDivIconList(...args) {
      this.map.removeDivIconList(...args)
    },

    /** 绘制单个多边形 */
    polygon(...args) {
      return this.map.polygon(...args)
    },

    /** 绘制多个单元网格 */
    featureGroup(...args) {
      return this.map.featureGroup(...args)
    },

    /** 地图点击 */
    mapClick(e) {
      const latlng = e.latlng
      this.latlng = latlng
      this.$emit('map-click', e)
    },

    /** 部件加载中 */
    componentLoading(value) {
      this.map.componentController.markerClick(this.componentCode)
      this.loading = value
    },

    /** 清除部件信息 */
    removeComponent() {
      this.componentList = []
      this.componentCode = ''
      this.componentDetail = null
    },

    /* 对角线居中 */
    fitBounds(...args) {
      this.map.fitBounds(...args)
    },

    // 设置轨迹
    setTrack(...args) {
      this.pauseMove()

      this.map.setTrack(...args)
    },
    // 设置速度
    setSpeed(speed) {
      if (this.map.track) {
        this.map.track.setSpeed(speed)
      }
    },
    // 继续播放
    continueMove() {
      if (this.map.track) {
        this.map.track.continueMove()
      }
    },
    // 暂停
    pauseMove() {
      if (this.map.track) {
        this.map.track.pauseMove()
      }
    },
    // 停止
    stopMove() {
      if (this.map.track) {
        this.map.track.stopMove()
      }
    },
    // 移除小车
    removeLayer() {
      if (this.map.track) {
        this.map.track.removeLayerMove()
      }
    }
  }
}
</script>

<style lang="scss" >
.cgMap {
  height: 100%;
  position: relative;
  &.leaflet-grab {
    cursor: default;
  }

  &-search {
    display: flex;
    align-items: center;
    background-color: #ffffff;
    box-shadow: 0 0 12px 0 rgba(0, 0, 0, 0.1);
    border-radius: 4px;
    line-height: 40px;
    padding: 0 15px;
    overflow: hidden;
    position: absolute;
    top: 20px;
    left: 4%;
    z-index: 800;
    &__left {
      color: #FE9A00;
      border: none;
      text-align: center;
    }
    &__right {
      color: #0095ff;
      border: none;
      text-align: center;
    }
    &__name {
      color: #00A1FF;
    }
    &__address {
      color: #909399;
      font-size: 12px;
    }
    .el-input__inner {
      border: none;
    }
  }
}

.anchorBL {
  display: none;
}
</style>
