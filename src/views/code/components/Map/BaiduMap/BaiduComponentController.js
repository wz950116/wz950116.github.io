const VUE_APP_API_URL = process.env.VUE_APP_API_URL;
// import { getComponentFile } from '@/common/api/gis-static/gis-unit.js';
import { getComponentFile } from '@/common/api/pt-api/web';
import {
  queryUnitCode
  // getParts,
  // queryByClick
} from '@/common/api/ad-web/unit.js';

import part from '@/assets/imgs/part.png';
import partNoBind from '@/assets/imgs/part-nobind.png';
import part_active from '@/assets/imgs/part-active.png';
import cluster from '@/assets/imgs/cluster.png';

import { debounce } from '@/utils/index.js';

class BaiduMarkerController {
  constructor(map, options) {
    this.map = map;
    this.options = options;
    this.currentCode = '';
    this.markersMap = new Map();
    this.cb = function() { };
  }

  add(key, value) {
    this.unSelect(value);
    this.markersMap.set(key, value);
  }

  markerClick(code) {
    const preCode = this.currentCode;
    if (preCode !== code) {
      this.selectByCode(code);
      this.unSelectByCode(preCode);
    }
  }

  selectByCode(code) {
    if (!code) return;
    const marker = this.markersMap.get(code);
    if (marker) {
      this.currentCode = code;
      this.select(marker);
    }
  }

  unSelectByCode(code) {
    if (!code) return;
    const marker = this.markersMap.get(code);
    this.unSelect(marker);
    if (code === this.currentCode) {
      this.currentCode = '';
    }
  }

  select(marker) {
    marker && marker.setIcon(this.options.icon_active);
  }

  unSelect(marker) {
    // 未绑定为橙色，已绑定为蓝色
    // marker && marker.setIcon(marker.qrCode ? this.options.icon : this.options.iconNoBind);
    marker && marker.setIcon(this.options.icon);
  }

  clearMarker() {
    const map = this.map;
    this.markersMap.forEach(baiduMarker => {
      map.removeOverlay(baiduMarker.marker);
      baiduMarker.destroy();
    });
    this.markersMap.clear();
    this.currentCode = '';
  }

  destroy() {
    this.clearMarker();
    this.map = null;
    this.options = null;
    this.cb = function() { };
  }
}

class BaiduMarker {
  constructor(markerController, code, marker, qrCode) {
    this.markerController = markerController;
    this.code = code;
    this.marker = marker;
    this.qrCode = qrCode;
    markerController.add(code, this);
  }

  setIcon(icon) {
    this.marker.setIcon(icon);
  }

  addEventListener() {
    this.marker.addEventListener('click', this.markerClick);
  }

  removeEventListener() {
    this.marker.addEventListener('click', this.markerClick);
  }

  markerClick = () => {
    this.markerController.markerClick(this.code);
  };

  destroy() {
    this.removeEventListener();
    this.markerController = null;
    this.code = '';
    this.marker = null;
  }
}

/**
 * 百度地图部件控制器
 */
class BaiduComponentController {
  iconUrl = `${VUE_APP_API_URL}/gis-static/gis-unit/images`;
  /** 地图缩放等级 */
  mapZoom = 18;
  /** 当前部件小类编码 */
  unitCode = '';
  /** 当前部件编码是否更新 */
  unitCodeIsUpdate = false;
  /** 部件点位 json 数据 */
  markersByJson = [];
  /**  */
  eventMap = new Map();
  constructor(baiduMap) {
    baiduMap.componentController = this;
    this.baiduMap = baiduMap;
    const { Convertor } = this.baiduMap.$BMap;
    this.convertor = new Convertor();
    if (!window.BMapLib) throw new ReferenceError('未找到 window.BMapLib');
    this.$BMapLib = window.BMapLib;
    this.initMarkerController();
  }

  init() { }

  /**
   * 获取点击范围内的所有部件
   * @param { {lng:number,lat:number} } latlng
   */
  async getComponentList(latlng) {
    if (this.getZoom() === 18) {
      // const _data = {
      //   unitCode: this.unitCode,
      //   distance: 50,
      //   limit: 10,
      //   geometryBO: {
      //     geoPoint: {
      //       x: latlng.lng,
      //       y: latlng.lat
      //     }
      //   }
      // };
      const bounds = this.baiduMap.getBounds();
      const _data = {
        smallCode: this.unitCode.substr(-6),
        longitudeUnder: bounds._southWest.lng,
        latitudeUnder: bounds._southWest.lat,
        longitudeUpper: bounds._northEast.lng,
        latitudeUpper: bounds._northEast.lat,
        // 获取点击部件范围多少米内的部件
        meters: 10,
        longitude: latlng.lng,
        latitude: latlng.lat
      };
      try {
        // const { data } = await queryByClick(_data);
        const { data } = await getComponentFile(_data);
        return data || [];
      } catch (error) {
        console.log(error);
        return [];
      }
    } else {
      return [];
    }
  }

  /** 初始化部件点位控制器 */
  initMarkerController() {
    const { Icon, Size } = this.baiduMap.$BMap;
    const iconSize = new Size(26, 26);
    const icon = new Icon(part, iconSize);
    icon.imageSize = iconSize;
    const icon_active = new Icon(part_active, iconSize);
    const iconNoBind = new Icon(partNoBind, iconSize);
    iconNoBind.imageSize = iconSize;
    icon_active.imageSize = iconSize;
    this.markerController = new BaiduMarkerController(this.baiduMap.$map, {
      icon,
      iconNoBind,
      icon_active
    });
  }

  /** 通过小类获取部件信息 */
  async showMarkerBySmallCategory(smallCategory) {
    const _smallCategory = smallCategory || this.smallCategory;
    this.clear();
    this.addAllEvent();
    await this.getUnitCodeBySmallCategory(_smallCategory);
    this.createMarkerClusterer();
    this.drawDetailComponentList();
    this.smallCategory = _smallCategory;
  }

  /** 通过部件小类字典获取部件小类编码 */
  async getUnitCodeBySmallCategory(smallCategory) {
    const unitCode = this.unitCode;
    this.unitCode = '';
    if (!smallCategory) return;
    try {
      const { data: unitCodeRes } = await queryUnitCode({ smallCategory });
      if (Array.isArray(unitCodeRes) && unitCodeRes.length > 0) {
        this.unitCode = unitCodeRes[0].code;
        this.unitCodeIsUpdate = this.unitCode !== unitCode;
      }
    } catch (error) {
      console.log(error);
    }
  }

  /** 缩放显示部件 */
  showMarkerByZoom = () => {
    this.drawDetailComponentList();
    this.showMarkerClusterer(this.markersByJson);
  };

  /** 获取地图层级为18时的部件点位 */
  drawDetailComponentList = debounce(async() => {
    if (this.getZoom() !== 18) return;
    this.clearMarkerClusterer();
    const unitCode = this.unitCode;
    if (!unitCode) return;

    // const outline = this.getOutLine();
    // const searchData = {
    //   unitCode,
    //   geometryBO: { geoPolygon: { outline }}
    // };

    const bounds = this.baiduMap.getBounds();
    const searchData = {
      smallCode: unitCode.substr(-6),
      longitudeUnder: bounds._southWest.lng,
      latitudeUnder: bounds._southWest.lat,
      longitudeUpper: bounds._northEast.lng,
      latitudeUpper: bounds._northEast.lat,
      // 获取点击部件范围多少米内的部件
      meters: -1,
      longitude: -1,
      latitude: -1
    };

    const { Point, Marker } = this.baiduMap.$BMap;
    try {
      this.componentLoad(true);
      // const { data: componentList } = await getParts(searchData);
      const { data: componentList } = await getComponentFile(searchData);

      this.clearMarker();
      if (this.getZoom() === 18 && Array.isArray(componentList)) {
        const map = this.baiduMap.$map;
        let coordinates = componentList.map(
          item => new Point(item.longitude, item.latitude)
        );
        coordinates = await this.convertorsTranslates(coordinates);
        componentList.forEach((item, index) => {
          const marker = new Marker(coordinates[index]);
          map.addOverlay(marker);
          new BaiduMarker(this.markerController, item.unitNum, marker, item.qrCode);
        });
      }
    } catch (error) {
      console.log(error);
    }
    this.componentLoad(false);
  }, 1000);

  /**
   * 坐标转换  大地2000(84)到百度
   * @param {any[]} lnglats
   * @returns Point
   */
  async convertorsTranslates(pointArr = []) {
    const promiseAll = [];
    let i = 0;
    const maxLength = 10;
    let arr = pointArr.slice(i, i + maxLength);
    while (arr.length) {
      promiseAll.push(this.convertorsTranslate(arr));
      i += maxLength;
      arr = pointArr.slice(i, i + maxLength);
    }
    const res = await Promise.all(promiseAll);
    return res.reduce((pre, current) => pre.concat(current));
  }

  convertorsTranslate(pointList = []) {
    return new Promise(resolve => {
      this.convertor.translate(pointList, 1, 5, data => {
        if (data.status === 0) {
          resolve(data.points);
        } else {
          resolve([]);
        }
      });
    });
  }

  /** 创建部件聚合图 */
  async createMarkerClusterer() {
    if (this.getZoom() === 18) return;
    try {
      const makers = await this.getComponentJson();
      this.addMarkerClusterer(makers);
    } catch (error) {
      console.log(error);
    }
  }

  /** 获取部件json数据 */
  async getComponentJson() {
    const bounds = this.baiduMap.getBounds();
    const unitCode = this.unitCode;
    if (!unitCode) return [];
    const data = {
      smallCode: this.unitCode.substr(-6),
      longitudeUnder: bounds._southWest.lng,
      latitudeUnder: bounds._southWest.lat,
      longitudeUpper: bounds._northEast.lng,
      latitudeUpper: bounds._northEast.lat,
      // 获取点击部件范围多少米内的部件
      meters: -1,
      longitude: -1,
      latitude: -1
    };
    const componentList = await getComponentFile(data);

    // const componentList = await getComponentFile(unitCode);
    const markersByJson = await this.createMarkers(componentList.data, unitCode);
    this.markersByJson = markersByJson;
    this.unitCodeIsUpdate = false;
    return markersByJson;
  }

  /** 通过部件编码选择部件 */
  markerClick(code) {
    this.markerController.markerClick(code);
  }

  /** 创建 makers */
  async createMarkers(componentList = [], unitCode) {
    const { Point, Marker, Icon, Size } = this.baiduMap.$BMap;
    const icon = new Icon(`${this.iconUrl}/${unitCode}.svg`, new Size(36, 36));

    let coordinates = componentList.map(
      item => new Point(item.longitude, item.latitude)
    );
    coordinates = await this.convertorsTranslates(coordinates);
    return componentList.map((item, index) => {
      return new Marker(new Point(coordinates[index].lng, coordinates[index].lat), { icon });
    });
  }

  /** 添加聚合点 */
  addMarkerClusterer(markers) {
    if (!this.markerClusterer) {
      const { Size } = this.baiduMap.$BMap;
      const MarkerClusterer = this.$BMapLib.MarkerClusterer;
      const map = this.baiduMap.$map;
      this.markerClusterer = new MarkerClusterer(map, {
        markers,
        styles: [
          {
            url: cluster,
            size: new Size(58, 58),
            textSize: '14px',
            textColor: '#fff'
          }
        ]
      });
    } else {
      this.showMarkerClusterer(markers);
    }
  }

  /** 清除聚合点 */
  clearMarkerClusterer() {
    this.isMarkerClusterer = false;
    this.markerClusterer && this.markerClusterer.clearMarkers();
  }

  /** 显示聚合点 */
  showMarkerClusterer(markers = []) {
    if (this.isMarkerClusterer || this.getZoom() === 18) return;
    this.clearMarker();
    if (this.unitCodeIsUpdate) {
      this.createMarkerClusterer();
      return;
    }
    this.isMarkerClusterer = true;
    this.markerClusterer && this.markerClusterer.addMarkers(markers);
  }

  /** 获取地图缩放等级 */
  getZoom() {
    return this.baiduMap.getZoom();
  }

  /** 获取地图边界 */
  getOutLine() {
    const { _southWest, _northEast } = this.baiduMap.getBounds();
    return [
      {
        x: _southWest.lng,
        y: _northEast.lat
      },
      {
        x: _northEast.lng,
        y: _northEast.lat
      },
      {
        x: _northEast.lng,
        y: _southWest.lat
      },
      {
        x: _southWest.lng,
        y: _southWest.lat
      },
      {
        x: _southWest.lng,
        y: _northEast.lat
      }
    ];
  }

  /** 清除部件点 */
  clearMarker() {
    this.markerController.clearMarker();
    // this.unitCodeIsUpdate = true;
  }

  /** 清除所有聚合点和部件点 */
  clear() {
    this.removeAllEvent();
    this.clearMarkerClusterer();
    this.clearMarker();
  }

  /** 地图停止缩放 */
  mapZoomEnd() {
    this.baiduMap.addEvent('zoomend', this.showMarkerByZoom);
  }

  /** 地图停止移动 */
  mapMoveEnd() {
    this.baiduMap.addEvent('moveend', this.drawDetailComponentList);
  }

  /** 添加所有事件 */
  addAllEvent() {
    this.mapZoomEnd();
    this.mapMoveEnd();
  }

  /** 移除所有事件 */
  removeAllEvent() {
    this.baiduMap.removeEvent('zoomend');
    this.baiduMap.removeEvent('moveend');
  }

  addEventListener(type, cb) {
    this.eventMap.set(type, cb);
  }

  removeEventListener(type) {
    this.eventMap.delete(type);
  }

  removeAllEventListener() {
    this.eventMap.clear();
  }

  /** 部件是否加载中 */
  componentLoad(flag) {
    const cb = this.eventMap.get('load');
    cb && cb(flag);
  }

  destroy() {
    this.clear();
    this.removeAllEvent();
    this.removeAllEventListener();
    this.markerController = null;
    this.markerClusterer = null;
    this.baiduMap = null;
    this.$BMapLib = null;
    this.convertor = null;
  }
}

export default BaiduComponentController;
