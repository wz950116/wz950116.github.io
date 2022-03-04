/**
 * 鄂尔多斯地图配置文件
 * zoom - 地图初始缩放等级
 * center - 地图初始中心点位
 * layers - 地图初始地图
 * wms - wms图层
 * areaCenterPoints - 地区单元网格边界点位
 * 所有坐标都是纬度在前,经度
 */
window.cg_gis_config = {
  zoom: 13,
  center: [30.73625, 116.82467],
  layers: [
    {
      url:
        "http://t1.tianditu.com/vec_c/wmts?layer=vec&style=default&tilematrixset=c&Service=WMTS&Request=GetTile&Version=1.0.0&Format=tiles&TileMatrix={z}&TileCol={x}&TileRow={y}&tk=ef63801764261c156ba74a40612a717b",
      options: {
        maxZoom: 19,
        tileSize: 256,
        zoomOffset: 1
      }
    },
    {
      url:
        "http://t1.tianditu.com/cva_c/wmts?layer=cva&style=default&tilematrixset=c&Service=WMTS&Request=GetTile&Version=1.0.0&Format=tiles&TileMatrix={z}&TileCol={x}&TileRow={y}&tk=ef63801764261c156ba74a40612a717b",
      options: {
        maxZoom: 19,
        tileSize: 256,
        zoomOffset: 1
      }
    }
  ],
  wms: [
    {
      url: "/geoserver/hncg_wk/wms",
      options: {
        layers: "hncg_wk:gis_shape_grid", //社区：community 街道：street 区：district
        format: "image/png",
        transparent: true,
        uppercase: true
      }
    }
  ],
  areaCenterPoints: []
};
