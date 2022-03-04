import { loadScript, loadModules } from "esri-loader";
import { getMapServer } from "@/api/event-center";
let grid_url = "http://172.18.13.180/MapServer/restService/0bc6a3cc-f8b4-42cb-b56b-db97eb0cd217/wangge/MapServer";
let loadOptionFlag = false;
const loadOption = {
  // url: `${process.env.VUE_APP_API_URL_MAP}/arcgis_js_api/library/3.16/3.16/init.js` // ArcGIS API
  url: 'https://js.arcgis.com/3.16/init.js' // ArcGIS API
};
const HZTDTVECTORBLEND =
  "/ArcGIS/rest/services/Demographics/ESRI_Census_USA/MapServer" || "http://172.18.13.180/gisProxy/Tile/ArcGISFlex/HZTDTVECTORBLEND.gis"; // ArcGISTiledMapServiceLayer

const esriMoudles = {
  Map: "esri/map",
  esriBasemaps: "esri/basemaps",
  Color: "esri/Color",
  Circle: "esri/geometry/Circle",
  GraphicsLayer: "esri/layers/GraphicsLayer",
  ImageParameters: "esri/layers/ImageParameters",
  connect: "dojo/_base/connect",
  ArcGISTiledMapServiceLayer: "esri/layers/ArcGISTiledMapServiceLayer",
  ArcGISDynamicMapServiceLayer: "esri/layers/ArcGISDynamicMapServiceLayer",
  CartographicLineSymbol: "esri/symbols/CartographicLineSymbol",
  SimpleFillSymbol: "esri/symbols/SimpleFillSymbol",
  Polyline: "esri/geometry/Polyline", //https://developers.arcgis.com/javascript/3/jsapi/polyline-amd.html
  ScreenPoint: "esri/geometry/ScreenPoint", // https://developers.arcgis.com/javascript/3/jsapi/screenpoint-amd.html
  MapPoint: "esri/geometry/Point", // https://developers.arcgis.com/javascript/3/jsapi/point-amd.html
  Graphic: "esri/graphic", // https://developers.arcgis.com/javascript/3/jsapi/graphic-amd.html
  Geometry: "esri/geometry/Geometry", // https://developers.arcgis.com/javascript/3/jsapi/geometry-amd.html
  PictureMarkerSymbol: "esri/symbols/PictureMarkerSymbol" // https://developers.arcgis.com/javascript/3/jsapi/picturemarkersymbol-amd.html
}; // 引入的模块

/**
 * @param {Node | String} divId
 * @param {Object} options
 * 文档地址 https://developers.arcgis.com/javascript/3/jsapi/map-amd.html
 */
class ArcgisUtil {
  constructor(
    divId,
    options = {
      center: [120.15507, 30.274084],
      zoom: 15
    }
  ) {
    this.divId = divId;
    this.center = options.center;
    this.zoom = options.zoom;
    this.map = null;
  }

  /**
   * 地图初始化
   * @returns { Promise }
   */
  init() {
    return new Promise(async (resolve, reject) => {
      try {
        if (!loadOptionFlag) {
          await loadScript(loadOption); // preload the ArcGIS API
          loadOptionFlag = true;
        }

        const res = await loadModules(Object.values(esriMoudles)); // 加载模块
        const keys = Object.keys(esriMoudles);

        for (let i = 0, l = keys.length; i < l; i++) {
          this[keys[i]] = res[i];
        }
        this.esriBasemaps.delorme = {
          baseMapLayers: [{ url: "https://services.arcgisonline.com/ArcGIS/rest/services/Specialty/DeLorme_World_Base_Map/MapServer" }
          ],
          thumbnailUrl: "https://www.example.com/images/thumbnail_2014-11-25_61051.png",
          title: "Delorme"
        };
        const map = new this.Map(this.divId, {
          basemap: "delorme",
          center: [-111.879655861, 40.571338776], // long, lat
          zoom: 13,
          sliderStyle: "small"
        });

        // 服务端缓存地图服务图层
        // const baseMapLayer = new this.ArcGISTiledMapServiceLayer(
        //   HZTDTVECTORBLEND
        // );
        // map.addLayer(baseMapLayer);

        // 动态地图服务图层
        // let imageParameters = new this.ImageParameters();
        // let layerDefs = [];
        // layerDefs[1] = " OBJECTID IN (1)";
        // imageParameters.layerDefinitions = layerDefs;
        // imageParameters.layerIds = [1];
        // imageParameters.layerOption = this.ImageParameters.LAYER_OPTION_SHOW;
        // this.gridlayer = new this.ArcGISDynamicMapServiceLayer(grid_url, {
        //   "imageParameters": imageParameters
        // });
        const dynamicMapServiceLayer = new this.ArcGISDynamicMapServiceLayer(HZTDTVECTORBLEND);
        map.addLayer(dynamicMapServiceLayer);
        map.on("load", () => {
          this.map = map;
          resolve(this);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  searchByCenter(circle) {
    let rings = JSON.stringify({
      "rings": circle.rings
    });
    getMapServer({
      geometry: rings,
      geometryType: "esriGeometryPolygon",
      spatialRel: "esriSpatialRelIntersects",
      returnGeometry: false,
      returnIdsOnly: true,
      returnCountOnly: false,
      returnZ: false,
      returnM: false,
      returnDistinctValues: false,
      f: "pjson",
    }).then(res => {
      let objectIds = res.objectIds;
      let attr = "";
      if (objectIds) {
        for (var i = 0; i < objectIds.length; i++) {
          attr = attr + objectIds[i] + ",";
        }
        attr = " OBJECTID IN (" + attr.substring(0, attr.length - 1) + ") ";
      } else {
        attr = " 1=2 ";
      }
      var layerDefinitions = [];
      layerDefinitions[1] = attr;
      this.gridlayer.setLayerDefinitions(layerDefinitions);
    })
  }

  addPolyline(path = []) {
    if (path.length === 0) {
      return;
    }
    const CartographicLineSymbol = this.CartographicLineSymbol;
    const Color = this.Color;
    const polyline = new this.Polyline();
    polyline.addPath(path);
    const lineSymbol = new CartographicLineSymbol(
      CartographicLineSymbol.STYLE_SOLID,
      new Color([255, 0, 0]),
      4
    );

    const polylineGraphic = new this.Graphic(polyline, lineSymbol);
    this.map.graphics.add(polylineGraphic);
  }
  /**
   * 绘制图形层上的多点
   * PictureMarkerSymbol 使用图像作为标记
   * @param {Array} makers
   */
  addGraphics(makers = []) {
    this.clearGraphics();

    if (makers.length === 0) {
      return;
    }

    for (let i = 0, l = makers.length; i < l; i++) {
      const maker = makers[i];
      maker.index = i;
      this.addGraphic(maker);
    }
  }
  delLayerGraphic() {
    this.map.removeLayer(this.gridlayer)
    this.map.removeLayer(this.gl)
  }
  /**
   * 添加网格与圈
   * @param {Object} maker { radius:String ,location:array }
   * 调用方式 map.addLayerGraphic({ radius: 500, location: this.gridLocation })
   */
  addLayerGraphic(maker = {}) {
    this.map.addLayer(this.gridlayer);
    this.gl = new this.GraphicsLayer({
      id: 'circles'
    })
    this.map.addLayer(this.gl);
    var symbol = new this.SimpleFillSymbol().setColor(null).outline.setColor('red')
    var graphic = new this.Graphic(null, symbol)
    this.gl.add(graphic)
    var circle = new this.Circle({
      center: maker.location,
      radius: maker.radius
    })
    this.searchByCenter(circle)
  }
  /**
   * 绘制图形层上的单个点
   * 添加 Graphics
   * @param {Object} maker { url:string, height:number, width:number, offect: array ,location:array }
   * 调用 map.addGraphic({
            url: require('@/assets/imgs/position.png'),
            height: 36,
            width: 36,
            offect: [0, 12],
            location: {
              latitude: extent.mapPoint.y,
              longitude: extent.mapPoint.x
            }
          })
   */
  addGraphic(maker = {}) {
    this.clearGraphics();
    // 设置图形的样式
    const pictureMarkerSymbol = new this.PictureMarkerSymbol({
      url: maker.url || "esriImg/bd-xz.png",
      height: maker.height || 15,
      width: maker.width || 14,
      xoffset: maker.offect ? maker.offect[0] : 0,
      yoffset: maker.offect ? maker.offect[1] : 0
    });

    // 与图形关联的字段和字段值的名称值对
    const attributes = {
      ...maker
    };
    // 设置图形的位置
    const markerPoint = new this.MapPoint(maker.location);
    // 将图形的样式和位置放在Graphic里面
    const graphic = new this.Graphic(
      markerPoint,
      pictureMarkerSymbol,
      attributes
    );
    // 添加图标
    this.map.graphics.add(graphic);
  }
  /**
   * 点击 Graphics
   * @param { Function } cb
   */
  clickGraphics(cb = function () { }) {
    this.map.graphics.onClick = event => {
      cb(event);
    };
  }

  /**
   * 清除 Graphics
   */
  clearGraphics() {
    this.map && this.map.graphics && this.map.graphics.clear();
  }

  /**
   * 显示 Graphics
   */
  showGraphics() {
    this.map.graphics.show();
  }

  /**
   * 隐藏 Graphics
   */
  hideGraphics() {
    this.map.graphics.hide();
  }

  /**
   * 设置中心并缩放地图
   * @param {Array} location [number]
   * @param {number} zoom
   */
  async centerAndZoom({ location, zoom }) {
    await this.map.centerAndZoom(location, zoom);
  }

  /**
   * 设置地图缩放
   * @param { Number } zoom
   */
  async setZoom(zoom) {
    await this.map.setZoom(zoom);
  }

  /**
   * 设置地图中心
   * @param {Array | Object} center (x,y) | [x,y] | {x,y}
   */
  async setCenter(location) {
    await this.map.centerAt(new this.MapPoint(location));
  }

  /**
   * 将地图坐标转换为屏幕坐标
   * @param {(x,y) | [x,y] | {x,y}}
   */
  mapPointToScreenPoint(...params) {
    let mapPoint = params;
    if (params.length === 1) {
      mapPoint = params[0];
    }
    const screenPoint = this.map.toScreen(new this.MapPoint(mapPoint));
    return screenPoint;
  }

  /**
   * 将屏幕坐标转换为地图坐标
   * @param {(x,y) | [x,y] | {x,y}}
   */
  screenPointToMapPoint(...params) {
    let screenPoint = params;
    if (params.length === 1) {
      screenPoint = params[0];
    }
    const mapPoint = this.map.toMap(new this.ScreenPoint(screenPoint));
    return mapPoint;
  }

  // 禁止用户使用鼠标移动地图
  disablePan() {
    this.map.disablePan();
  }

  // 允许用户使用鼠标移动地图
  enablePan() {
    this.map.enablePan();
  }

  // 显示地图缩放按钮
  showZoomSlider() {
    this.map.showZoomSlider();
  }

  // 隐藏地图缩放按钮
  hideZoomSlider() {
    this.map.hideZoomSlider();
  }

  // 禁止使用鼠标滚轮在地图上缩放
  disableScrollWheelZoom() {
    this.map.disableScrollWheelZoom();
    this.hideZoomSlider();
  }

  // 允许使用鼠标滚轮在地图上缩放
  enableScrollWheelZoom() {
    this.map.enableScrollWheelZoom();
    this.showZoomSlider();
  }

  // 锁定地图
  lockMap() {
    this.disableScrollWheelZoom();
    this.disablePan();
  }

  // 解锁地图
  unlockMap() {
    this.enableScrollWheelZoom();
    this.enablePan();
  }

}

export default ArcgisUtil;
