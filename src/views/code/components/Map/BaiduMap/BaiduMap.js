import Rectangle from '../Rectangle.js';
import BaiduMapRect from './BaiduMapRect.js';
import BaiduCellController from './BaiduCellController.js';
import BaiduComponentController from './BaiduComponentController.js';
import { getGisWebJson } from '@/common/api/gis-static/gis-web.js';

class FeatureGroup {
  constructor(baiduMap, geoJSONs) {
    this.baiduMap = baiduMap;
    this.geoJSONs = geoJSONs;
    this.featureSet = new Set();
    this.draw();
  }

  draw() {
    const baiduMap = this.baiduMap;
    const featureSet = this.featureSet;
    this.geoJSONs.forEach(item => {
      featureSet.add(baiduMap.polygon(item));
    });
  }

  remove() {
    const map = this.baiduMap.$map;
    this.featureSet.forEach(item => {
      map.removeOverlay(item);
    });
    this.featureSet.clear();
  }

  destroy() {
    this.remove();
    this.baiduMap = null;
    this.geoJSONs = [];
  }
}

class Polygons {
  constructor(baiduMap, geojson, options) {
    this.baiduMap = baiduMap;
    this.options = options;
    this.polygonSet = new Set();
    this.draw(this.getGeojson(geojson));
  }

  getGeojson(geojson) {
    let _geoJson = null;
    if (typeof geojson === 'string') {
      try {
        _geoJson = JSON.parse(geojson);
      } catch (error) {
        console.log(error);
      }
    }
    if (typeof geojson === 'object') {
      _geoJson = geojson;
    }
    return _geoJson;
  }

  draw(geojson) {
    if (!geojson) return;
    const pointsList = this.getPointsList(geojson);
    pointsList.forEach(points => {
      this.addOverlay(points);
    });
  }

  getPointsList({ type, coordinates = [] }) {
    const { Point } = this.baiduMap.$BMap;
    const points = [];
    if (type === 'MultiPolygon') {
      coordinates.forEach(coordinate => {
        coordinate.forEach(coordinateItem => {
          points.push(coordinateItem.map(item => new Point(...item)));
        });
      });
    }
    if (type === 'Polygon') {
      coordinates.forEach(coordinate => {
        points.push(coordinate.map(item => new Point(...item)));
      });
    }
    return points;
  }

  addOverlay(points = []) {
    const { Polygon } = this.baiduMap.$BMap;
    const map = this.baiduMap.$map;
    const polygon = new Polygon(points, this.options);
    map.addOverlay(polygon);
    this.polygonSet.add(polygon);
    return polygon;
  }

  remove() {
    const map = this.baiduMap.$map;
    this.polygonSet.forEach(item => {
      map.removeOverlay(item);
    });
    this.polygonSet.clear();
    this.baiduMap = null;
  }

  setStyle(options) {
    this.polygonSet.forEach(polygon => {
      this._setStyle(polygon, options);
    });
  }

  _setStyle(polygon, options = {}) {
    Object.entries(options).forEach(([key, value]) => {
      let _key = key.slice(0, 1).toUpperCase() + key.slice(1);
      _key = `set${_key}`;
      polygon[_key] && polygon[_key](value);
    });
  }

  destroy() {
    this.remove();
  }
}

const styleJson = [
  {
    featureType: 'manmade',
    elementType: 'geometry',
    stylers: {
      visibility: 'on'
    }
  },
  {
    featureType: 'manmade',
    elementType: 'labels',
    stylers: {
      visibility: 'on'
    }
  },
  {
    featureType: 'building',
    elementType: 'geometry',
    stylers: {
      visibility: 'on'
    }
  },
  {
    featureType: 'estatelabel',
    elementType: 'labels',
    stylers: {
      visibility: 'off'
    }
  },
  {
    featureType: 'estatelabel',
    elementType: 'labels.icon',
    stylers: {
      visibility: 'off'
    }
  },
  {
    featureType: 'businesstowerlabel',
    elementType: 'labels',
    stylers: {
      visibility: 'off'
    }
  },
  {
    featureType: 'businesstowerlabel',
    elementType: 'labels.icon',
    stylers: {
      visibility: 'off'
    }
  },
  {
    featureType: 'poilabel',
    elementType: 'labels',
    stylers: {
      visibility: 'off'
    }
  },
  {
    featureType: 'poilabel',
    elementType: 'labels.icon',
    stylers: {
      visibility: 'off'
    }
  }
];
/** 百度地图 */
class BaiduMap {
  defaultConfig = {
    zoom: 10,
    center: [28.47546, 104.85901],
    layers: [],
    wms: [],
    areaCenterPoints: []
  };

  /** 多边形默认参数 */
  geojsonMarkerOptions = {
    fillColor: '#0041FF',
    fillOpacity: 0.1,
    strokeColor: '#0041FF',
    strokeStyle: 'solid',
    strokeWeight: 1,
    strokeOpacity: 1,

    enableMassClear: false,
    enableEditing: false,
    enableClicking: false
  };

  /** 记录当前地图监听的事件 */
  mapEvent = new Map();

  /** 记录当前地图操作 */
  methodRecord = new Map();

  /** 当前地图配置 */
  gisConfig = null;

  constructor(el) {
    if (!window.BMap) throw new ReferenceError('未找到 window.BMap');
    this.$el = el;
    this.$BMap = window.BMap;
    this._getConfig();
  }

  /** 获取配置文件 */
  _getConfig() {
    this.gisConfig = Object.assign(
      {},
      this.defaultConfig,
      window.cg_gis_config
    );
    return this.gisConfig;
  }

  /** 初始化地图 */
  initMap() {
    const map = new this.$BMap.Map(this.$el, {
      minZoom: 3,
      maxZoom: 18,
      enableAutoResize: true,
      enableMapClick: false
    });
    map.enableScrollWheelZoom();
    this.$map = map;
    this.setMapStyleV2();
  }

  async setMapStyleV2() {
    const { center, zoom } = this.gisConfig;
    await this.setCenterAndZoom(center, zoom);
    this.$map.setMapStyleV2({ styleJson });
  }

  /**
   * 初始化 wms
   * * 伪 wms，为了和 leaflet保持统一
   */
  initWms() {
    if (this.isinitWms) return;
    this.addWms(this.gisConfig.wms);
    this.isinitWms = true;
  }

  async addWms() {
    const areaCodes = this.gisConfig.areaCenterPoints.map(
      item => item.areaCode
    );
    for (let i = 0; i < areaCodes.length; i++) {
      const res = await getGisWebJson(areaCodes[i]);
      this.polygon(res.geojson, { fillOpacity: 0.01 });
    }
  }

  /** 设置缩放等级 */
  setZoom(zoom) {
    const _zoom = zoom || this.gisConfig.zoom;
    this.$map.setZoom(_zoom + 1);
  }

  /** 获取缩放等级 */
  getZoom() {
    return this.$map ? this.$map.getZoom() : this.gisConfig.center;
  }

  /** 获取地图边界 */
  getBounds() {
    const { sl, Gl } = this.$map.getBounds();
    return {
      _southWest: this._converterPoint(this.bd09towgs84(Gl)),
      _northEast: this._converterPoint(this.bd09towgs84(sl))
    };
  }

  /** 设置地图中心点 */
  async setCenter(point) {
    const _point = await this.convertor(point);
    this.$map.setCenter(_point);
  }

  /** 获取地图中心点 */
  getCenter() {
    return this.bd09towgs84(this.$map.getCenter());
  }

  /** 设置中心位置并且缩放 */
  async setCenterAndZoom(point, zoom) {
    try {
      const _point = await this.convertor(point);
      zoom = zoom || point.zoom || this.getZoom();
      this.$map.centerAndZoom(_point, zoom + 1);
    } catch (error) {
      console.log(error);
    }
  }

  /** 添加 divIcon */
  async addDivIcon(point) {
    this.removeDivIcon();
    const _point = await this.convertor(point);
    const Marker = this.$BMap.Marker;
    const marker = new Marker(_point, {
      icon: this.creatDivIcon()
    });
    this.$map.addOverlay(marker);
    this.divIconMarker = marker;
    this.methodRecord.set('addDivIcon', [this.bd09towgs84(_point)]);
  }

  /** 移除 divIcon */
  removeDivIcon() {
    const _marker = this.divIconMarker;
    _marker && this.$map.removeOverlay(_marker);
  }

  /** 创建 divIcon */
  creatDivIcon() {
    if (this.creatDivIcon.divIcon) return this.creatDivIcon.divIcon;
    const divIcon = new this.$BMap.Symbol(window.BMap_Symbol_SHAPE_POINT, {
      scale: 1, //图标缩放大小
      fillColor: 'orange', //填充颜色
      fillOpacity: 0.8 //填充透明度
    });
    this.creatDivIcon.divIcon = divIcon;
    return divIcon;
  }

  /** 添加点击事件 */
  addClickEvent(cb) {
    this.addEvent('click', e => {
      const [lng, lat] = this.bd09towgs84(e.point);
      cb({ latlng: { lng, lat }});
    });
  }

  /** 添加事件 */
  addEvent(type, cb) {
    this.mapEvent.set(type, cb);
    this.$map.addEventListener(type, cb);
  }

  /** 移除事件 */
  removeEvent(type) {
    if (this.mapEvent.has(type)) {
      this.$map.removeEventListener(type, this.mapEvent.get(type));
    }
  }

  /** 移除所有事件 */
  removeAllEvent() {
    this.mapEvent.forEach((value, key) => {
      this.removeEvent(key, value);
    });
  }

  /** 初始化框选 */
  initRectangle(cb) {
    const leafletMapRect = new BaiduMapRect(this);
    const rectangle = new Rectangle(this, leafletMapRect);
    rectangle.addEventListen(cb);
    this.$rectangle = rectangle;
  }

  /** 添加框选 */
  startDrawRectangle() {
    this.mapAddOncontextmenu();
    this.$rectangle && this.$rectangle.startDraw();
  }

  /** 取消框选 */
  stopDrawRectangle() {
    this.$el.oncontextmenu = null;
    this.$rectangle && this.$rectangle.stopDraw();
  }

  /** 移除框选 */
  removeDrawRectangle() {
    this.$el.oncontextmenu = null;
    this.$rectangle && this.$rectangle.stopDraw();
    this.$rectangle = null;
  }

  /** 禁止显示地图范围内鼠标右键点击后的浏览器菜单 */
  mapAddOncontextmenu() {
    this.$el.oncontextmenu = function(event) {
      event.preventDefault();
    };
  }

  /** 地图可移动 */
  draggingEnable() {
    this.$map.enableDragging();
  }

  /** 禁止地图移动 */
  draggingDisable() {
    this.$map.disableDragging();
  }

  /** 处理geojson数据 */
  geojson(geojson) {
    let _geoJson = null;
    if (typeof geojson === 'string') {
      try {
        _geoJson = JSON.parse(geojson);
      } catch (error) {
        console.log(error);
      }
    }
    return _geoJson;
  }

  /** 绘制单个多边形 */
  polygon(geojson, options) {
    const _geojsonMarkerOptions = Object.assign(
      {},
      this.geojsonMarkerOptions,
      options
    );
    return new Polygons(this, geojson, _geojsonMarkerOptions);
  }

  /**
   * 绘制多个单元网格
   * @param geoJSONs
   * @param {boolean} center 是否居中
   * @param options
   */
  featureGroup(geoJSONs = []) {
    return new FeatureGroup(this, geoJSONs);
  }

  /** 对角线居中 */
  async fitBounds(bounds = []) {
    const promiseAll = bounds.map(item => this.convertor(item));
    const _points = await Promise.all(promiseAll);
    this.$map.setViewport(_points);
  }

  /** 获取单元网格控制器 */
  getCellController() {
    return this.cellController || new BaiduCellController(this);
  }

  /** 获取地图部件控制器 */
  getComponentController() {
    return this.componentController || new BaiduComponentController(this);
  }

  /** 转换坐标点 */
  _converterPoint(args) {
    const Point = this.$BMap.Point;
    const center = this.gisConfig.center;

    const defaultPoint = {
      lng: center[1],
      lat: center[0]
    };
    let newPoint = null;

    if (this.isObject(args)) {
      newPoint = { ...args };
    }

    if (Array.isArray(args) && args.length) {
      const _args = [...args];
      if (_args[0] - _args[1] < 0) {
        [_args[0], _args[1]] = [_args[1], _args[0]];
      }
      newPoint = {
        lng: _args[0],
        lat: _args[1]
      };
    }
    newPoint = Object.assign({}, defaultPoint, newPoint);
    return new Point(newPoint.lng, newPoint.lat);
  }

  /**
   * 坐标转换  大地2000(84)到百度
   * @param {*} lnglats
   * @returns Point
   */
  convertor(lnglats) {
    const Convertor = this.$BMap.Convertor;
    const convertor = new Convertor();
    const pointArr = [this._converterPoint(lnglats)];
    return new Promise((resolve, reject) => {
      convertor.translate(pointArr, 1, 5, data => {
        if (data.status === 0) {
          resolve(this._converterPoint(data.points[0]));
        } else {
          reject(false);
        }
      });
    });
  }

  /**
   * 百度转WS84
   */
  bd09towgs84({ lng: bd_lon, lat: bd_lat }) {
    const PI = 3.1415926535897932384626;
    const a = 6378245.0;
    const ee = 0.00669342162296594323;
    const transformlat = function(lng, lat) {
      let ret =
        -100.0 +
        2.0 * lng +
        3.0 * lat +
        0.2 * lat * lat +
        0.1 * lng * lat +
        0.2 * Math.sqrt(Math.abs(lng));
      ret +=
        ((20.0 * Math.sin(6.0 * lng * PI) + 20.0 * Math.sin(2.0 * lng * PI)) *
          2.0) /
        3.0;
      ret +=
        ((20.0 * Math.sin(lat * PI) + 40.0 * Math.sin((lat / 3.0) * PI)) *
          2.0) /
        3.0;
      ret +=
        ((160.0 * Math.sin((lat / 12.0) * PI) +
          320 * Math.sin((lat * PI) / 30.0)) *
          2.0) /
        3.0;
      return ret;
    };
    const transformlng = function(lng, lat) {
      let ret =
        300.0 +
        lng +
        2.0 * lat +
        0.1 * lng * lng +
        0.1 * lng * lat +
        0.1 * Math.sqrt(Math.abs(lng));
      ret +=
        ((20.0 * Math.sin(6.0 * lng * PI) + 20.0 * Math.sin(2.0 * lng * PI)) *
          2.0) /
        3.0;
      ret +=
        ((20.0 * Math.sin(lng * PI) + 40.0 * Math.sin((lng / 3.0) * PI)) *
          2.0) /
        3.0;
      ret +=
        ((150.0 * Math.sin((lng / 12.0) * PI) +
          300.0 * Math.sin((lng / 30.0) * PI)) *
          2.0) /
        3.0;
      return ret;
    };
    const gcj02towgs84 = function(lng, lat) {
      let dlat = transformlat(lng - 105.0, lat - 35.0);
      let dlng = transformlng(lng - 105.0, lat - 35.0);
      const radlat = (lat / 180.0) * PI;
      let magic = Math.sin(radlat);
      magic = 1 - ee * magic * magic;
      const sqrtmagic = Math.sqrt(magic);
      dlat = (dlat * 180.0) / (((a * (1 - ee)) / (magic * sqrtmagic)) * PI);
      dlng = (dlng * 180.0) / ((a / sqrtmagic) * Math.cos(radlat) * PI);
      const mglat = lat + dlat;
      const mglng = lng + dlng;
      return [lng * 2 - mglng, lat * 2 - mglat];
    };
    const bd09togcj02 = function(bd_lon, bd_lat) {
      const x_pi = (PI * 3000.0) / 180.0;
      const x = bd_lon - 0.0065;
      const y = bd_lat - 0.006;
      const z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * x_pi);
      const theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * x_pi);
      const gg_lng = z * Math.cos(theta);
      const gg_lat = z * Math.sin(theta);
      return [gg_lng, gg_lat];
    };
    const gcj = bd09togcj02(bd_lon, bd_lat);
    return gcj02towgs84(gcj[0], gcj[1]);
  }

  isObject(val) {
    return Object.prototype.toString.call(val) === '[object Object]';
  }

  destroy() {
    this.mapEvent.clear();
    this.methodRecord.clear();
    this.gisConfig = null;
    this.$el = null;
    this.$BMap = null;
    this.$map = null;
  }
}

export default BaiduMap;
