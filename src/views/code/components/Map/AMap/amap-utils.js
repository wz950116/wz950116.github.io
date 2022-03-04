import AMap from 'AMap'
import AMapStyle, { MAP_STYLE } from "./amap-config"
import gcoord from 'gcoord'
const TLayer = {
  base: 'http://t{0,1,2,3,4,5,6,7}.tianditu.gov.cn/DataServer?T=vec_w&tk=ef63801764261c156ba74a40612a717b&x=[x]&y=[y]&l=[z]',
  tag: 'http://t{0,1,2,3,4,5,6,7}.tianditu.gov.cn/DataServer?T=cva_w&tk=ef63801764261c156ba74a40612a717b&x=[x]&y=[y]&l=[z]'
}
export class MapContainer {
  constructor(options) {
    // 逆地理编码实例
    this.geocoder = new AMap.Geocoder()
    // 海量点实例集合
    this.massMarksMap = new Map()
    // 覆盖物集合实例集合
    this.overlayGroupMap = new Map()
    // 聚合覆盖物实例集合
    this.clusterMarkersMap = new Map()
    // 标记物实例集合
    this.markerLayer = new Map()
    // init
    this.initMap(options)
    this.options = Object.assign({}, options)
    this._clickHook = this.options.clickHook || null
    // 存放不同的信息窗口
    this.infoWindowMap = {}
    this.markers = []
    this.markersId = new Set()
  }

  /**
   *初始化地图
   * @param {Object} options 参数配置与高德的相同
   * @memberof MapContainer
   */
  initMap(options) {
    const map = new AMap.Map(
      options.target,
      Object.assign({
        center: [120.418512, 30.84969],
        zooms: [3, 20],
        expandZoomRange: true,
        ...options
      })
    )
    if (options.TLayer) {
      map.setLayers([
        new AMap.TileLayer({
          // 天地图底图图块取图地址
          getTileUrl: TLayer.base,
          zIndex: 1
        }),
        new AMap.TileLayer({
          // 天地图底图图块取图地址
          getTileUrl: TLayer.tag,
          zIndex: 2
        })
      ])
    }
    this.map = map
  }

  /**
   * 添加多个点
   * @param {any} name 图层名称
   * @param {Array} points 点位数组
   * @param {*} type
   */
  addPoints({ name, points, toCenter }) {
    let layer = this.markerLayer.get(name)
    if (this.markerLayer.has(name)) {
      layer.clearOverlays()
    } else {
      this.markerLayer.set(name, new AMap.OverlayGroup())
      layer = this.markerLayer.get(name)
    }
    const markers = []
    points.forEach((item, index) => {
      // 创建点实例
      if (!/\d/.test(item.lat || item.latitude)) {
        return
      }
      const longitude = item.lon || item.lng || item.longitude
      const latitude = item.lat || item.latitude
      if (longitude && latitude) {
        const marker = new AMap.Marker({
          position: new AMap.LngLat(longitude, latitude),
          icon: MAP_STYLE[name],
          extData: { type: name, ...item }
        })
        marker.on("click", this.markerClick.bind(this))
        markers.push(marker)
      }
      if (index === 0 && toCenter) {
        this.setCenterPosition([longitude, latitude], this.map.getZoom())
      }
    })
    layer.addOverlays(markers)
    layer.setMap(this.map)
  }

  /**
   * 设置单个地图点位
   * @param {Number} {longitude} 经度
   * @param {Number} {latitude} 纬度
   * @param {Icon} {icon} 点位图标
   * @memberof MapContainer
   */
  setLocaltion({
    longitude,
    latitude,
    toCenter,
    icon = new AMap.Icon(AMapStyle.location),
    options
  }) {
    this.clearLocaltion()

    this.localtionMarker = new AMap.Marker({
      icon,
      position: new AMap.LngLat(longitude, latitude),
      ...options
    })
    this.localtionMarker.setMap(this.map)
    if (toCenter) {
      this.setCenterPosition([longitude, latitude], this.map.getZoom())
    }
  }

  // 清除定位点击点位
  clearLocaltion() {
    this.localtionMarker && this.localtionMarker.setMap(null)
    this.localtionMarker = null
  }

  /**
 * 添加海量点
 * @param {String} {type} 图层类型，用于管理多类型图标切换的情况
 * @param {Array} {data} 点位数据
 * @param {Object} {options} 高德MassMarks 类配置
 * @param {Function} {clickCallback} 点位点击后的回调
 * @memberof MapContainer
 */
  addMassMarks({ type, data, options = {}, clickCallback }) {
    if (this.massMarksMap.has(type)) {
      const mass = this.massMarksMap.get(type)
      mass.setData(data)
    } else {
      const mass = new AMap.MassMarks(data, {
        ...options,
        style: [{
          url: 'https://a.amap.com/jsapi_demos/static/images/mass0.png',
          anchor: new AMap.Pixel(6, 6),
          size: new AMap.Size(11, 11)
        }, {
          url: 'https://a.amap.com/jsapi_demos/static/images/mass1.png',
          anchor: new AMap.Pixel(4, 4),
          size: new AMap.Size(7, 7)
        }, {
          url: 'https://a.amap.com/jsapi_demos/static/images/mass2.png',
          anchor: new AMap.Pixel(3, 3),
          size: new AMap.Size(5, 5)
        }]
      })
      clickCallback && mass.on('click', clickCallback)
      mass.setMap(this.map)
      this.massMarksMap.set(type, mass)
    }
  }

  /**
   * 切换海量点涂层显示隐藏
   * @param {String} type 点位类型
   * @param {Boolean} show 显示隐藏
   */
  changeMassTypeShow(type, show) {
    if (this.massMarksMap.has(type)) {
      const mass = this.massMarksMap.get(type)
      show ? mass.show() : mass.hide()
    }
  }

  /**
   * 获取海量点数据
   * @param {String} type 海量点类型
   */
  getMassTypeData(type) {
    if (this.massMarksMap.has(type)) {
      const mass = this.massMarksMap.get(type)
      return mass.getData()
    } else {
      console.log('no has this type!!')
      return []
    }
  }

  clearMassType(type) {
    if (this.massMarksMap.has(type)) {
      const mass = this.massMarksMap.get(type)
      mass.setMap(null)
      this.massMarksMap.set(type, null)
    } else {
      console.log('no has this type!!')
    }
  }

  /**
   * 重新渲染海量点
   * @param {String} {type} 图层类型，用于管理多类型图标切换的情况
   * @memberof MapContainer
   */
  renderMassMarks(type) {
    if (this.massMarksMap.has(type)) {
      const mass = this.massMarksMap.get(type)
      mass.setStyle(AMapStyle[type])
    }
  }

  /**
   * 生成轨迹并回放轨迹
   * @param {Array} pathData 轨迹数据
   */
  addTrackReshow({ name = 'track', path = [], moveEndCallback, speedNum }) {
    // 清除上次移动点位，上次轨迹
    this.movePoint && this.movePoint.stopMove()
    this.movePoint && this.movePoint.setMap(null)
    this.movePoint = null
    this.overlayGroupMap.get('track') && this.overlayGroupMap.get('track').setMap(null)
    this.overlayGroupMap.set('track', null)

    // 轨迹长度小于2不处理
    if (path.length < 2) {
      return
    }

    // 生成路径线
    const movePolyline = new AMap.Polyline({
      path,
      strokeColor: 'rgba(0,197,148,1)',
      strokeOpacity: 1,
      strokeWeight: 4,
      strokeStyle: 'solid',
      lineJoin: 'round',
      lineCap: 'square',
      zIndex: 50
    })

    // 实例化涂层组
    const OverlayGroup = new AMap.OverlayGroup([movePolyline])
    // 生成移动点位
    this.movePoint = new AMap.Marker({
      map: this.map,
      position: path[0],
      icon: "https://webapi.amap.com/images/car.png",
      offset: new AMap.Pixel(-26, -13),
      autoRotation: true,
      angle: -90
    })
    this.movePoint.on('movealong', () => { moveEndCallback && moveEndCallback() })
    speedNum = speedNum || 1
    this.movePoint.moveAlong(path, 200 * speedNum)
    OverlayGroup.addOverlays([this.movePoint])

    this.overlayGroupMap.set(name, OverlayGroup)
    OverlayGroup.setMap(this.map)
    this.map.setFitView(movePolyline)
    return OverlayGroup
  }

  /**
   *  鼠标工具
   * @param {String} type 类型
   * @param {Object} styleOption 样式配置
   * @param {Boolean} clearPoly 是否保留覆盖物实例
   * @param {function} callback 回调函数
   */
  mouseToolDraw(type, styleOption = {}, clearPoly, callback) {
    this.mouseTool && this.mouseTool.close(true)
    const hasType = ['polyline', 'polygon', 'circle', 'rectangle'].includes(type)
    if (!hasType) { throw new Error("type is required and in ['polyline', 'polygon', 'circle']") }
    this.mouseTool = new AMap.MouseTool(this.map)

    this.mouseTool.on('draw', function({ obj }) {
      // 是否保留覆盖物实例
      this.mouseTool && this.mouseTool.close(!!clearPoly)
      // 把画出的实例作为参数
      callback && callback(obj)
    }.bind(this))
    this.mouseTool[type]({

      strokeColor: '#4169E1',
      strokeOpacity: 1,
      strokeWeight: 4,
      // 折线样式还支持 'dashed'
      strokeStyle: 'dashed',
      // strokeStyle是dashed时有效
      strokeDasharray: [10, 5],
      lineJoin: 'round',
      lineCap: 'round',
      zIndex: 50,
      ...styleOption
    })
  }

  /**
   * 清除鼠标画的poly
   */
  clearMouseToolDraw() {
    this.mouseTool && this.mouseTool.close(true)
  }

  /**
   * 生成折线编辑器
   * @param {String} { type } 类型
   * @param {Array} { path } 折线或多边形数据
   * @param {Object} { styleOption } 折线或多边形样式
   * @param {function} { addNodeCallback } 增加节点回调
   * @param {function} { adjustCallback } 移动节点回调
   * @param {function} { endCallback } 结束编辑回调
   */
  newPolyEditor({
    type,
    path,
    styleOption = {},
    addNodeCallback,
    adjustCallback,
    endCallback,
    drawCallback
  }) {
    // 结束编辑事件
    this.polyEditor && this.polyEditor.close()
    this.poly && this.poly.setMap(null)
    this.poly = null

    const fn = (poly) => {
      this.poly = poly
      this.poly.setMap(this.map)

      // 缩放地图到合适的视野级别
      this.map.setFitView([this.poly])
      // 初始化编辑器
      this.polyEditor = new AMap.PolyEditor(this.map, this.poly)

      //  添加节点事件
      this.polyEditor.on('addnode', function(event) {
        console.log('addnode')

        addNodeCallback && addNodeCallback(event)
      })
      // 节点改变事件
      this.polyEditor.on('adjust', function(event) {
        console.log('adjust')
        adjustCallback && adjustCallback(event)
      })
      // 结束编辑事件
      this.polyEditor.on('end', function(event) {
        console.log('end')
        endCallback && endCallback(event)
        // event.target 即为编辑后的折线对象
      })

      this.polyEditor.open()
      drawCallback && drawCallback(this.polyEditor)
    }

    if (path) {
      let poly = null
      if (type === 'polyline') {
        poly = new AMap.Polyline({
          path,
          strokeColor: '#4169E1',
          strokeOpacity: 1,
          strokeWeight: 4,
          // 折线样式还支持 'dashed'
          strokeStyle: 'dashed',
          // strokeStyle是dashed时有效
          strokeDasharray: [10, 5],
          lineJoin: 'round',
          lineCap: 'round',
          zIndex: 50,
          ...styleOption
        })
      } else if (type === 'polygon') {
        poly = new AMap.Polygon({
          path,
          strokeColor: '#4169E1',
          fillColor: '#4169E1',
          fillOpacity: 0.2,
          strokeOpacity: 1,
          strokeWeight: 4,
          // 折线样式还支持 'dashed'
          strokeStyle: 'dashed',
          // strokeStyle是dashed时有效
          strokeDasharray: [10, 5],
          lineJoin: 'round',
          lineCap: 'round',
          zIndex: 50,
          ...styleOption
        })
      }
      fn(poly)
    } else {
      this.mouseToolDraw(type, styleOption, false, fn)
    }
  }

  /**
   * 添加聚合点位
   *
   * @param {Array} { data } 点位数据
   * @param {String} { type } 点位类型
   * @param {Object} { markerOpt } 点配置
   * @param {Function} { markerClickCallback } 坐标点点击回调
   * @param {Object} { options } 聚合配置
   * @memberof MapContainer
   */
  addMarkerClusterer({ data, type = 'default', markerOpt, markerClickCallback, options }) {
    const markers = data.map(item => {
      const marker = new AMap.Marker({
        position: new AMap.LngLat(item.longitude, item.latitude),
        extData: item,
        icon: new AMap.Icon(AMapStyle.clusterMarker[item.iconName]),
        ...markerOpt
      })

      markerClickCallback && marker.on('click', markerClickCallback)

      return marker
    })

    // clusterMarkersMap 分类管理聚合点数据
    let clusterMarkers = this.clusterMarkersMap.get(type)
    window.clusterMarkersMap = this.clusterMarkersMap

    if (clusterMarkers) {
      clusterMarkers.setMarkers(markers)
    } else {
      clusterMarkers = new AMap.MarkerClusterer(this.map, markers, {
        styles: AMapStyle.clusterStyle,
        gridSize: 80,
        maxZoom: 15,
        ...options
      })
      this.clusterMarkersMap.set(type, clusterMarkers)
    }
  }

  // 清除聚合点
  clearAllClusterMarker() {
    for (var map of this.clusterMarkersMap) { // 遍历Map
      map[1].clearMarkers()
    }
  }

  /**
   *
   * @param {Array} data 数据
   * @param {Number} radius 点半径
   * @param {Array} opacity 透明度数组
   */
  addHeatMap(data, radius, opacity) {
    if (!this.heatmap) {
      this.heatmap = new AMap.Heatmap(this.map, {
        radius: radius || 25, // 给定半径
        opacity: opacity || [0, 0.8]
      })
    }
    this.heatmap.setDataSet({
      data: data
      // max: 100
    })
  }

  /**
   *打开信息弹窗
   * @param {String/HTMLElement} { target } // 显示内容，可以是HTML要素字符串或者HTMLElement对象
   * @param {*} { longitude } // 经度
   * @param {*} { latitude } // 纬度
   * @param {Array} { offset } // 信息窗体显示位置偏移量。默认基准点为信息窗体的底部中心（若设置了anchor，则以anchor值为基准点）。
   * @param {Function} { closeCallback } // 关闭弹窗的回调
   * @memberof MapContainer
   */
  openInfoWindow({ target, longitude, latitude, offset, closeWhenClickMap = true, closeCallback }) {
    const position = new AMap.LngLat(longitude, latitude)
    if (this.infoWindow) {
      this.infoWindow.close()
      this.infoWindow.setPosition(position)
      this.infoWindow.setContent(target)
    } else {
      this.infoWindow = new AMap.InfoWindow({
        isCustom: true, // 使用自定义窗体
        content: target,
        position,
        autoMove: true,
        closeWhenClickMap: closeWhenClickMap,
        offset: new AMap.Pixel(offset[0], offset[1])
      })
    }
    // 清除上一次的关闭回调
    this.infoWindow._oldCallback && this.infoWindow.off('close', this.infoWindow._oldCallback)
    // 将关闭回调保存下来
    this.infoWindow._oldCallback = closeCallback
    closeCallback && this.infoWindow.on('close', closeCallback)

    this.infoWindow.open(this.map, position)
  }

  /**
   * 清除信息窗口
   */
  clearInfoWindow() {
    if (this.infoWindow) {
      this.infoWindow.close()
      // 清除上一次的关闭回调
      this.infoWindow._oldCallback && this.infoWindow.off('close', this.infoWindow._oldCallback)
    }
  }

  // 移动地图到指定位置
  setCenterPosition(lnglat, zoom = this.map.getZoom()) {
    this.map.setZoomAndCenter(zoom, lnglat)
  }

  // 构造卫星图
  addSatellite() {
    this.satelliteLayer = new AMap.TileLayer.Satellite()
    this.map.add([this.satelliteLayer])
  }
  // 删除卫星图
  removeSatellite() {
    this.map.remove(this.satelliteLayer)
  }

  /**
   * 点位点击触发
   * @param {Event} e
   */
   markerClick(e) {
    this._clickHook && this._clickHook(e)
  }
}

/**
   * 逆地理编码
   * @param {Array} lnglat
   */
export function getAddressByLnglat(lnglat, callback, options = { city: "全国", radius: 500 }) {
  const geocoder = new AMap.Geocoder({
    ...options
  })
  geocoder.getAddress(lnglat, function(status, result) {
    if (status === 'complete' && result.regeocode) {
      callback && callback(result.regeocode.formattedAddress)
    } else {
      console.log('根据经纬度查询地址失败')
    }
  })
}

/**
 * @param {Array} target 当前坐标
 * @param {String} type 当前坐标系
 * @param {String} targetType 目标坐标系
 */
export function transformPoint(target, type = 'WGS84', targetType = 'AMap') {
  return gcoord.transform(target, gcoord[type], gcoord[targetType])
}

MapContainer.getAddressByLnglat = getAddressByLnglat

export default MapContainer
