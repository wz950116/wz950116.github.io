import Vue from 'vue'

/**
 * leaflet地图
 * ! leaflet 所有坐标都是纬度在前,精度在后的
 */
class LeafletMap {
  defaultConfig = {
    zoom: 10,
    center: [30.73625, 116.82467],
    layers: [],
    wms: [],
    areaCenterPoints: []
  };

  /** 多边形默认参数 */
  geojsonMarkerOptions = {
    radius: 8,
    weight: 1,
    opacity: 1,
    fillOpacity: 0.1,
    fillColor: '#0041FF',
    color: '#0041FF'
  };

  /** wms 图层相关配置 */
  wmsOptions = null;

  /** 记录当前地图监听的事件 */
  mapEvent = new Map();

  /** 当前地图配置 */
  gisConfig = null;

  /** 地图实列 */
  $map = null;

  /** leaflet js */
  $L = null;

  /** 绘制矩形实列 */
  $rectangle = null;

  /** 地图挂载节点 */
  $el = null;

  /** 点集合 */
  markerGroup = [];

  /** 线集合 */
  polylineGroup = [];

  $busEvent = new Vue();

  constructor(el, options) {
    if (!window.L) throw new ReferenceError('未找到 window.L')
    this.$el = el
    this.$L = window.L
    this._getConfig()
    this.options = options
  }

  /** 获取配置文件 */
  _getConfig() {
    this.gisConfig = Object.assign(
      {},
      this.defaultConfig,
      window.cg_gis_config
    )
    return this.gisConfig
  }

  /** 初始化地图 */
  initMap() {
    const L = this.$L
    const gisConfig = this.gisConfig
    const map = L.map(this.$el, {
      crs: L.CRS.EPSG4326,
      maxZoom: 17,
      center: gisConfig.center,
      zoom: gisConfig.zoom,
      zoomControl: false, // 默认的放大缩小插件是英文的
      attributionControl: false, // 是否显示leaflet广告
      closePopupOnClick: false //  点击地图的时候是否默认关闭popup
    })
    this.$map = map
    window.$map = map
    this.addTileLayer(gisConfig.layers)

    // 引入arcgis内网服务底图
    // const tileMapUrl = `http://10.33.35.61:81/arcgis/rest/services/OneMap/电子地图/MapServer?token=${decodeURIComponent('w%2b0ogeJiyvulTHhEMxRLmw%3d%3d')}`;
    // const dynamicLayer = L.esri.dynamicMapLayer({
    //   url: tileMapUrl,
    //   opacity: 0.8,
    //   f: 'json'
    // });
    // map.addLayer(dynamicLayer);
  }

  /**
   * 添加底图
   * @param { string | { url , option }[] | { url , option } } layer
   */
  addTileLayer(layer) {
    const map = this.$map
    if (Array.isArray(layer)) {
      layer.forEach(item => {
        map.addLayer(this.createTileLayer(item))
      })
    } else {
      map.addLayer(this.createTileLayer(layer))
    }
  }

  /** 创建底图 */
  createTileLayer(url, options) {
    if (this.isObject(url)) {
      options = url.options
      url = url.url
    }
    return this.$L.tileLayer(
      url,
      Object.assign(
        {
          maxZoom: 19,
          tileSize: 256,
          zoomOffset: 1
        },
        options
      )
    )
  }

  /** 初始化 wms */
  initWms(ops) {
    if (this.isinitWms) return
    this.wmsOptions = ops
    this.addWms(this.gisConfig.wms)
    this.isinitWms = true
  }

  /**
   * 添加 wms 图层
   * @param { string | { url , option } | { url , option }[] } wms
   */
  addWms(wms) {
    // ! VUE_APP_API_URL 实际为wms的请求路径
    const VUE_APP_API_URL = process.env.VUE_APP_API_URL || ''
    const map = this.$map
    if (Array.isArray(wms)) {
      wms.forEach(item => {
        const _item = { ...item }
        if (this.isObject(item)) {
          _item.url = VUE_APP_API_URL + item.url
        }
        map.addLayer(this.createTileLayerWms(_item))
      })
    } else {
      map.addLayer(this.createTileLayerWms(wms))
    }
  }

  /** 创建 wms 图层 */
  createTileLayerWms(wmsUrl, options) {
    if (this.isObject(wmsUrl)) {
      options = wmsUrl.options
      wmsUrl = wmsUrl.url
    }
    options = Object.assign(
      {
        layers: this.layers, // 图层等级
        // layers: this.wmsOptions.layers,
        format: 'image/png',
        transparent: true,
        uppercase: true
      },
      options,
      this.wmsOptions
    )
    return this.$L.tileLayer.wms(wmsUrl, options)
  }

  /** 设置缩放等级 */
  setZoom(zoom) {
    const _zoom = this.gisConfig.zoom
    this.$map.setZoom(zoom || _zoom)
  }

  /** 获取缩放等级 */
  getZoom() {
    return this.$map ? this.$map.getZoom() : this.gisConfig.zoom
  }

  /** 获取地图边界 */
  getBounds() {
    return this.$map.getBounds()
  }

  /** 设置地图中心点 */
  setCenter(point) {
    const _point = this._converterPoint(point)
    this.$map.panTo(_point)
  }

  /** 获取地图中心点 */
  getCenter() {
    return this.$map.getCenter()
  }

  /** 设置中心位置并且缩放 */
  setCenterAndZoom(point, zoom) {
    const _point = this._converterPoint(point)
    zoom = zoom || point.zoom || this.getZoom()
    this.$map.setView(_point, zoom)
  }

  /** 添加单个标记 */
  addDivIcon(point, iconOption) {
    this.removeDivIcon()
    const _point = this._converterPoint(point)
    this.divIconMarker = this.$L
      .marker(_point, { icon: iconOption ? this.$L.icon(iconOption) : this.creatDivIcon() })
      .addTo(this.$map)
  }

  /** 添加多个标记 */
  addDivIcons(points = [], option, cb) {
    this.removeDivIcon()
    const markers = []
    points.map(item => {
      if (!item || !item.latitude || !item.longitude) {
        return
      }
      const marker = window.L.marker([item.latitude, item.longitude], option)
      marker.on('click', (e) => {
        cb(e.target.options)
      })
      markers.push(marker)
    })
    this.divIconMarker = this.$L.featureGroup(markers).addTo(this.$map)
  }

  /** 移除标记 */
  removeDivIcon() {
    this.divIconMarker && this.divIconMarker.remove()
  }

  /** 添加聚合点 */
  addDivIconStyle(type, data) {
    var markersGroup = new this.$L.MarkerClusterGroup()
    const divIconMarker = (list) => {
      list.forEach(item => {
        const _point = this._converterPoint(item.point)
        const marker = this.$L
          .marker(_point, { icon: this.creatGreenIcon(item.icon) })
        // 添加点击事件传数据
        if (item.info) {
          marker.on('click', (e) => {
            this.$busEvent.$emit('onClickInfo', item.info)
          })
        }
        markersGroup.addLayer(marker).addTo(this.$map)
      })
      // 点集合加入数组
      this.markerGroup.push({
        type,
        list: markersGroup
      })
    }

    if (Array.isArray(data)) {
      divIconMarker(data)
    } else {
      divIconMarker([data])
    }
  }

  /** 移除聚合点 */
  removeDivIcons(type) {
    if (this.markerGroup.length) {
      let delIndex = null
      this.markerGroup.forEach((item, index) => {
        if (item.type === type) {
          item.list.clearLayers()
          delIndex = index
        }
      })
      if (delIndex) {
        this.markerGroup.splice(delIndex, 1)
      }
    }
  }

  /** 创建默认标记Icon */
  creatDivIcon() {
    if (this.creatDivIcon.divIcon) return this.creatDivIcon.divIcon
    const divIcon = this.$L.divIcon({
      className: 'iconfont icon-dingwei mapIcon',
      iconSize: [19, 26],
      iconAnchor: [9, 13], // 相对偏移的位置 把图片认为是一个正方形,点击的地方就是正方形的左上角
      popupAnchor: [] // 弹出窗口相对于图标锚点“打开”的点的坐标。
    })
    this.creatDivIcon.divIcon = divIcon
    return divIcon
  }

  /** 创建 icon */
  creatGreenIcon(option) {
    if (option) {
      return this.$L.icon({ ...option })
    } else {
      return this.creatDivIcon()
    }
  }

  /** 绑定Popup */
  bindPopup(point, popupContent, className) {
    this.$L.popup({ className })
      .setLatLng(point)
      .setContent(popupContent)
      .openOn(this.$map)
  }

  /** 移除 divIconList */
  removeDivIconList() {
    if (this.MarkerFeatureGroup) {
      this.MarkerFeatureGroup.clearLayers()
      this.$map.closePopup()
    }
  }

  /** 地图画线 */
  polyline(points, option) {
    points.map(item => {
      item = this._converterPoint(item)
    })
    const polyline = this.$L.polyline(points, option).addTo(this.$map)
    this.polylineGroup.push(polyline)
  }

  /** 清除线集合 */
  removePolyline() {
    if (this.polylineGroup.length) {
      this.polylineGroup.forEach(item => {
        this.$map.removeLayer(item)
      })
      this.polylineGroup = []
    }
  }

  /** 添加点击事件 */
  addClickEvent(cb) {
    this.addEvent('click', function (e) {
      const params = { latlng: e.latlng }
      cb(params)
    })
  }

  /** 添加事件 */
  addEvent(type, cb) {
    this.mapEvent.set(type, cb)
    this.$map.on(type, cb)
  }

  /** 移除事件 */
  removeEvent(type) {
    if (this.mapEvent.has(type)) {
      this.$map.off(type, this.mapEvent.get(type))
    }
  }

  /** 移除所有事件 */
  removeAllEvent() {
    this.mapEvent.forEach((value, key) => {
      this.removeEvent(key, value)
    })
  }

  /** 添加框选 */
  startDrawRectangle() {
    this.mapAddOncontextmenu()
    this.$rectangle && this.$rectangle.startDraw()
  }

  /** 取消框选 */
  stopDrawRectangle() {
    this.$el.oncontextmenu = null
    this.$rectangle && this.$rectangle.stopDraw()
  }

  /** 移除框选 */
  removeDrawRectangle() {
    this.$el.oncontextmenu = null
    this.$rectangle && this.$rectangle.stopDraw()
    this.$rectangle = null
  }

  /** 禁止显示地图范围内鼠标右键点击后的浏览器菜单 */
  mapAddOncontextmenu() {
    this.$el.oncontextmenu = function (event) {
      event.preventDefault()
    }
  }

  /** 地图可移动 */
  draggingEnable() {
    this.$map.dragging.enable()
  }

  /** 禁止地图移动 */
  draggingDisable() {
    this.$map.dragging.disable()
  }

  /** 处理geojson数据 */
  geojson(geojson) {
    let _geoJson = null
    if (typeof geojson === 'string') {
      try {
        _geoJson = JSON.parse(geojson)
      } catch (error) {
        console.log(error)
      }
    }
    if (typeof geojson === 'object') {
      _geoJson = geojson
    }
    return _geoJson
  }

  /** 绘制单个多边形 */
  polygon(geojson, options) {
    const _geoJson = this.geojson(geojson)
    if (!_geoJson) return null
    const feature = this.createFeature(_geoJson, options)
    return feature.addTo(this.$map)
  }

  /** 创建一个 Feature */
  createFeature(geojsonFeature, options) {
    const _geojsonMarkerOptions = Object.assign(
      {},
      this.geojsonMarkerOptions,
      options
    )
    return this.$L.geoJSON(geojsonFeature, _geojsonMarkerOptions)
  }

  /**
   * 绘制多个单元网格
   * @param geoJSONs
   * @param {boolean} center 是否居中
   * @param options
   */
  featureGroup(geoJSONs = [], center = false, options) {
    const { featureGroup, geoJSON } = this.$L
    const _geojsonMarkerOptions = Object.assign(
      {},
      this.geojsonMarkerOptions,
      options
    )
    const featureGroups = geoJSONs.map(item => {
      return geoJSON(item, _geojsonMarkerOptions)
    })
    const feature = featureGroup(featureGroups)
    if (center) {
      this.gridToCenter(feature)
    }
    return feature.addTo(this.$map)
  }

  /**
   * 地图网格居中
   */
  gridToCenter(geoJSON) {
    const bounds = geoJSON.getBounds()
    let rectangle = this.$L
      .rectangle(bounds, {
        opacity: 0,
        fillOpacity: 0,
        weight: 1
      })
      .addTo(this.$map)
    this.$map.fitBounds(bounds)
    rectangle.remove()
    rectangle = null
  }

  /** 对角线居中  */
  fitBounds(bounds = []) {
    bounds = bounds.map(item => this._converterPoint(item))
    this.$map.fitBounds(bounds)
  }

  /**
   * 转换坐标点
   */
  _converterPoint(args) {
    const center = this.gisConfig.center

    const defaultPoint = {
      lng: center[1],
      lat: center[0]
    }
    let newPoint = null

    if (this.isObject(args)) {
      newPoint = { ...args }
    }

    if (Array.isArray(args) && args.length) {
      const _args = [...args]
      if (_args[0] - _args[1] < 0) {
        [_args[0], _args[1]] = [_args[1], _args[0]]
      }
      newPoint = {
        lng: _args[0],
        lat: _args[1]
      }
    }
    return Object.assign({}, defaultPoint, newPoint)
  }

  isObject(val) {
    return Object.prototype.toString.call(val) === '[object Object]'
  }

  setTrack(lineIndex, icon) {
    const map = this.$map
    const L = this.$L

    // 取线集合里面下标
    const lines = this.polylineGroup[lineIndex]
    if (lines instanceof L.Polyline) {
      // 清除小车
      this.track.removeLayerMove()
      // 当前点运动
      if (lines._latlngs.length) {
        let point = lines._latlngs[0]
        point = this._converterPoint([point.lat, point.lng])
        const curMarker = L.marker(point, {
          icon
        })
        window.curMarker = curMarker // 缓存起来以便删除
        const trackMarkerGroup = L.layerGroup([curMarker])
        window.trackMarkerGroup = trackMarkerGroup// 缓存起来以便删除
        trackMarkerGroup.addTo(map)
        curMarker.moveAlong(lines, this.speed)
        map.fitBounds(lines.getBounds())
      }
    }
  }

  // 给marker加上轨迹的运动
  initMarkForTrack() {
    const L = this.$L
    const _that = this
    this.moveOptions = {
      origin: null,
      done: 0,
      path: null,
      length: 0,
      timer: null,
      moveObj: null
    }

    L.Marker.addInitHook(function() {
      _that.track = this
      this.setSpeed = function (speed) {
        _that.speed =
          isNaN(parseFloat(speed)) || parseFloat(speed) <= 0
            ? 200
            : parseFloat(speed)
      }
      this.getSpeed = function() {
        return _that.speed
      }
      this.moveAlong = function (path, speed, rePlay) {
        if (!rePlay) {
          path = path instanceof L.Polyline ? path : new L.Polyline(path)
          _that.moveOptions.path = path
        } else {
          path = _that.moveOptions.path
        }
        _that.moveOptions.length = L.GeometryUtil.length(path)
        _that.speed =
          isNaN(parseFloat(speed)) || parseFloat(speed <= 0)
            ? 200
            : parseFloat(speed)

        this._move()
      }
      // 暂停
      this.pauseMove = function () {
        clearInterval(_that.moveOptions.timer)
        _that.moveOptions.timer = null
      }
      // 重播
      this.resumeMove = function() {
        _that.moveOptions.done = 0
        this._move()
      }
      // 继续播放
      this.continueMove = function() {
        if (window.trackMarkerGroup) {
          this._move()
        }
      }
      // 停止
      this.stopMove = function() {
        this.pauseMove()
        _that.moveOptions.done = 0
        _that.moveOptions.moveObj = null
      }
      // 清除点
      this.removeLayerMove = function() {
        if (window.trackMarkerGroup) {
          window.trackMarkerGroup.clearLayers()
          window.trackMarkerGroup = null
          window.curMarker = null
        }
      }

      this._move = function () {
        if (_that.moveOptions.timer) return
        const _t = _that.moveOptions.moveObj ? _that.moveOptions.moveObj : this
        _that.moveOptions.moveObj = _t
        let isStop = false
        _that.moveOptions.timer = setInterval(function() {
          let done = _that.moveOptions.done
          done += (_that.speed / 1000) * 20
          let radio = done / _that.moveOptions.length
          if (radio >= 1) {
            radio = 0
            done = 0
            isStop = true
          }
          _that.moveOptions.done = done

          const p = L.GeometryUtil.interpolateOnLine(
            _t._map,
            _that.moveOptions.path,
            radio
          )

          _t.setLatLng(p.latLng)
          const prep = _that.moveOptions.path.getLatLngs()[p.predecessor]

          if (prep) {
            const passed = _that.moveOptions.path
              .getLatLngs()
              .slice(0, p.predecessor + 1)
            passed.push(p.latLng)
            _t.fire('update_position', { path: passed })
            if (isStop) {
              _t.stopMove()
              _t.fire('stopMove', { path: passed })
            }
          }
        }, 20)
      }
    })
  }

  destroy() {
    this.wmsOptions = null
    this.mapEvent.clear()
    this.gisConfig = null
    this.$el = null
    this.$L = null
    this.$map = null
    this.$rectangle = null
    this.$busEvent = new Vue()
  }
}

export default LeafletMap
