import AMap from 'AMap'
import normal from './imgs/icon_normal.png'
import location from './imgs/location-icon.png'
import cluster from './imgs/cluster.png'
import car from './imgs/car.png'

export default {
  // 定位图标
  location: {
    image: location,
    imageSize: new AMap.Size(18, 27),
    size: new AMap.Size(18, 27)
  },
  // 聚合图标样式
  clusterStyle: [{
    url: cluster,
    size: new AMap.Size(64, 64),
    textColor: '#fff',
    textSize: 15
  }],
  // 聚合图标样式
  clusterMarker: {
    'car': {
      image: car,
      imageSize: new AMap.Size(32, 36),
      size: new AMap.Size(32, 36)
    }
  }
}

export const MAP_STYLE = {
  normal: new AMap.Icon({
    size: new AMap.Size(32, 35),
    image: normal,
    imageSize: new AMap.Size(32, 35)
  })
}

export const POINT_STYLE_LIST = [
  { url: normal, size: new AMap.Size(30, 35), anchor: new AMap.Pixel(0, 35) }
]