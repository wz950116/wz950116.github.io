import 'leaflet-canvas-marker'
import { MAP_STYLE } from './smap-config'

export class MapContainer {
  /** 地图实列 */
  map = null
  /** leaflet js */
  $L = null
  /** 地图挂载节点 */
  $el = null

  constructor(options) {
    this.$L = window.L
    this.markers = []
    this.popupDom = null
    this.options = null
    this.graphicSelect = null
    this._getConfig(options)
    this.initMap()
  }
  // 配置项
  _getConfig(options) {
    const L = this.$L
    this.options = Object.assign({
      preferCanvas: true,
      center: [28.692864, 115.815278], // 新建区
      zoom: 12,
      crs: L.CRS.TianDiTu_WGS84,
      closePopupOnClick: true,
      markerDisabled: false
    }, options)
    this.graphicSelect = this.options.graphicSelect
  }
  // 初始化地图
  initMap() {
    const L = this.$L
    let map = L.map(this.options.target, this.options)
    L.supermap.tiandituTileLayer({
      key: "1d109683f4d84198e37a38c442d68311"
    }).addTo(map)
    L.supermap.tiandituTileLayer({
      isLabel: true,
      key: "1d109683f4d84198e37a38c442d68311"
    }).addTo(map)

    // L.supermap.tiledMapLayer('https://iserver.supermap.io/iserver/services/map-china400/rest/maps/China').addTo(map)

    map.on("popupclose", () => {
      this.options.onPopupClose && this.options.onPopupClose()
    })

    this.map = map
    this.popupDom = typeof this.options.popup === 'string' ? document.getElementById(this.options.popup) : this.options.popup
  }
  // 添加底图
  addTileLayer(layer) {
    const map = this.map
    if (Array.isArray(layer)) {
      layer.forEach(item => {
        map.addLayer(this.createTileLayer(item))
      });
    } else {
      map.addLayer(this.createTileLayer(layer))
    }
  }
  // 创建底图
  createTileLayer(url, options) {
    if (this.isObject(url)) {
      options = url.options
      url = url.url
    }
    return this.$L.tileLayer(
      url,
      Object.assign({
        maxZoom: 19,
        tileSize: 256,
        zoomOffset: 1
      }, options)
    )
  }
  // 添加标记
  addPoints(iconName, data) {
    // 清除上一次标记图层
    if (this.markersLayer) this.markersLayer.clearLayers()
    this.markers = []
    data = Array.isArray(data) ? data : [data]
    data.forEach((item, index) => {
      const myIcon = L.icon({
        iconUrl: MAP_STYLE[item.type || iconName],
        iconSize: [24, 32]
      })
      const latlng = [item.latitude || item.lat, item.longitude || item.lon]
      // 创建一个标记
      const marker = L.marker(latlng, {
        icon: myIcon,
        extData: item
      }).addTo(this.map)
      this.markers.push(marker)

      // 自动定位到第一个标记点
      if (index === 0) {
        this.map.setView(L.latLng(item.latitude || item.lat, item.longitude || item.lon), 12)
      }

      // 绑定弹窗及点击事件
      if (!this.options.markerDisabled) {
        marker.bindPopup(this.popupDom, {
          className: 'custom-popup',
          minWidth: this.options.popupWidth || 460,
          closeButton: true
        }).on('click', this.markerClick.bind(this))
      }
    })
    // 创建标记图层
    this.markersLayer = L.layerGroup(this.markers).addTo(this.map)
  }
  // 标记点击事件
  markerClick(e) {
    const data = e.target.options && e.target.options.extData
    if (this.graphicSelect) {
      this.map.setView(L.latLng(data.latitude, data.longitude), 12)
      this.graphicSelect(data)
    }
  }
  // 添加海量点标记
  addMassMark(iconName, data) {
    const ciLayer = L.canvasIconLayer({}).addTo(this.map)
    const _markers = []
    if (map) {
      data.forEach((item, index) => {
        // 需要用divIcon而不是icon方法，需设置iconAnchor
        const myIcon = L.divIcon({
          iconUrl: MAP_STYLE[item.type || iconName],
          iconSize: [24, 32],
          iconAnchor: [12, 12]
        })
        const latlng = [item.latitude || item.lat, item.longitude || item.lon]
        let marker = L.marker(latlng, {
          icon: myIcon
        })
        // 绑定弹窗及点击事件
        if (!this.options.markerDisabled) {
          marker.bindPopup(this.popupDom, {
            className: 'custom-popup',
            minWidth: this.options.popupWidth || 460,
            closeButton: true
          })
        }
        marker.data = item
        _markers.push(marker)
        // 自动定位到第一个标记点
        if (index === 0) {
          this.map.setView(L.latLng(item.latitude || item.lat, item.longitude || item.lon), 14)
        }
      })
      // 监听海量点点击事件
      ciLayer.addOnClickListener((e, data) => {
        if (!this.options.markerDisabled && data[0]) {
          const d = data[0].data.data
          this.map.setView(L.latLng(d.latitude || d.lat, d.longitude || d.lon), 14)
          this.graphicSelect(d)
        }
      })
      ciLayer.addLayers(_markers)
    }
  }
  //销毁地图并清除所有相关的事件侦听器
  remove(){
    this.map.remove()
  }
  // 判断是否为对象
  isObject(val) {
    return Object.prototype.toString.call(val) === '[object Object]';
  }
}