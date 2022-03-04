/** 修正缩放等级 */
const zoomCorrection = new Map()
zoomCorrection.set('BaiduMap-LeafletMap', -1)
zoomCorrection.set('LeafletMap-BaiduMap', 1)

/**
 * 地图控制器
 */
class MapController {
  /** 地图 class  */
  mapList = new Map();
  /** 地图实例 */
  mapInstance = new Map();
  /** 当前显示地图对应的key */
  currentMapKey = '';

  options = {
    /** 是否显示责任网格 */
    useGrid: false,
    /** 使用网格管理 */
    useCellController: false,
    /** 部件加载 */
    componentLoading: function() {},
    /** 社区：community 街道：street 区：district */
    layers: '',
    mapClick: function() {}
  };

  /**
   * @param { Element } el
   * @param { Vue } vm
   */
  constructor(el, options) {
    this.$el = el
    this.options = Object.assign({}, this.options, options)
  }

  /**
   * 添加地图
   * @param { string } key 地图对应的key
   * @param {*} value key对应的地图 class
   */
  add(key, value) {
    this.mapList.set(key, value)
  }

  /**
   * 通过key使用地图
   * @param { string } key 需要显示地图的key
   */
  useMap(key) {
    const mapList = this.mapList
    const mapInstance = this.mapInstance
    if (!this.$el) return null
    if (!mapInstance.has(key)) {
      const MapClass = mapList.get(key)
      if (!MapClass) return null
      const mapDiv = document.createElement('div')
      mapDiv.setAttribute('style', 'visibility: visible;width:100%;height:100%; position: absolute;left: 0;right: 0;')
      this.$el.appendChild(mapDiv)
      const instance = new MapClass(mapDiv, this.options)
      mapInstance.set(key, { instance, el: mapDiv })
      instance.initMap()
      instance.addClickEvent(this.options.mapClick)
    }

    return this._synchronizeMapData(key)
  }

  /** 使用网格控制 */
  useCellController(preMapInstance, currentMapInstance) {
    const preController = preMapInstance && preMapInstance.getCellController()
    const mapController = currentMapInstance.getCellController()
    mapController.init(preController)
    return mapController
  }

  /** 初始化 wms */
  initWms(map) {
    const layers = this.options.layers
    map.initWms(layers ? { layers: layers } : null)
  }

  /** 同步地图操作 */
  _synchronizeMapData(key) {
    const preMapKey = this.currentMapKey
    const mapInstance = this.mapInstance

    const { useCellController, useGrid } = this.options

    const preMapInstanceAndEl = mapInstance.get(preMapKey)
    const currentMapInstanceAndEl = mapInstance.get(key)

    if (preMapInstanceAndEl) {
      const { instance: preMapInstance, el: preMapEl } = preMapInstanceAndEl
      const {
        instance: currentMapInstance,
        el: currentMapEl
      } = currentMapInstanceAndEl

      this._showAndhiddenMap(preMapEl, false)
      this._showAndhiddenMap(currentMapEl, true)

      for (const [key, value] of preMapInstance.methodRecord.entries()) {
        currentMapInstance[key].apply(currentMapInstance, value)
      }

      if (!useCellController) {
        // const bounds = preMapInstance.getBounds();
        // currentMapInstance.fitBounds(Object.values(bounds));
        currentMapInstance.setZoom(
          preMapInstance.getZoom() + zoomCorrection.get(`${preMapKey}-${key}`)
        )
        currentMapInstance.setCenter(preMapInstance.getCenter())
      }
    }

    if (useCellController) {
      this.useCellController(
        preMapInstanceAndEl && preMapInstanceAndEl.instance,
        currentMapInstanceAndEl.instance
      )
    }

    if (useGrid) this.initWms(currentMapInstanceAndEl.instance)

    this.currentMapKey = key
    return currentMapInstanceAndEl.instance
  }

  /**
   * 隐藏所有地图
   */
  _hiddenMaps() {
    for (const item of this.mapInstance.values()) {
      this._showAndhiddenMap(item.el, false)
    }
  }

  /**
   * 显示或隐藏地图
   * @param { Element } el
   * @param { boolean } flag
   */
  _showAndhiddenMap(el, flag) {
    const currentMapEl = el
    const styleValue = currentMapEl.attributes.style.value
    currentMapEl.setAttribute(
      'style',
      flag
        ? styleValue.replace('visibility: hidden', 'visibility: visible')
        : styleValue.replace('visibility: visible', 'visibility: hidden')
    )
  }

  destroy() {
    this.mapInstance.forEach(item => {
      item.instance.removeEvent('click')
      item.instance.destroy()
    })
    this.$el = null
    this.mapList.clear()
    this.mapInstance.clear()
    this.currentMapKey = ''
  }
}

export default MapController
