<template>
  <div>demo</div>
</template>

<script>
import ArcgisUtil from './ArcgisUtil.js'
export default {
  mounted() {
    this.$nextTick(async () => {
      this.map = new ArcgisUtil(this.$refs.mapContainer3)
      try {
        const resMap = await this.map.init()
        resMap.connect.connect(resMap.map, 'onMouseDown', (extent) => {
          if (extent.button === 2) {
            // const newLngLat = transformPoint([extent.mapPoint.x, extent.mapPoint.y])
            // coordinateConvert(newLngLat[0], newLngLat[1]).then((res) => {
            //   this.currentAddress = res.regeocode.formatted_address
            //   this.elForm.area = res.regeocode.addressComponent.district
            // })
            // this.map.clearGraphics()
            // this.gridLocation = [extent.mapPoint.x, extent.mapPoint.y]
            // this.map.addGraphic({
            //   url: require('@/assets/imgs/position.png'),
            //   height: 36,
            //   width: 36,
            //   offect: [0, 12],
            //   location: {
            //     latitude: extent.mapPoint.y,
            //     longitude: extent.mapPoint.x
            //   }
            // })
            // this.elForm.latitude = extent.mapPoint.y
            // this.elForm.longitude = extent.mapPoint.x
          }
        })
      } finally {
        this.initData()
      }
    })
  }
}
</script>
