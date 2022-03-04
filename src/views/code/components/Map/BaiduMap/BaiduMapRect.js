/**
 * 百度地图绘制矩形
 */
class BaiduMapRect {
  constructor(mapvm) {
    this.mapvm = mapvm;
    this.tmprect = null;
    this.Polygon = this.mapvm.$BMap.Polygon;
  }

  rectangle(latlngs) {
    const [southWest, northEast] = latlngs;
    return new this.Polygon(
      [
        this.mapvm._converterPoint([southWest[0], southWest[1]]),
        this.mapvm._converterPoint([northEast[0], southWest[1]]),
        this.mapvm._converterPoint([northEast[0], northEast[1]]),
        this.mapvm._converterPoint([southWest[0], northEast[1]])
      ],
      {
        fillColor: '#0041FF',
        fillOpacity: 0.1,
        strokeColor: '#0041FF',
        strokeWeight: 1,
        strokeOpacity: 1,
        strokeStyle: 'dashed',
        enableMassClear: true,
        enableEditing: false,
        enableClicking: true
      }
    );
  }

  draw(latlngs = []) {
    if (latlngs.length !== 2) return;
    this.remove();
    this.tmprect = this.rectangle(latlngs);
    this.mapvm.$map.addOverlay(this.tmprect);
  }

  remove() {
    this.mapvm.$map.removeOverlay(this.tmprect);
  }

  getEvent(event) {
    return {
      originalEvent: event.domEvent,
      latlng: event.point
    };
  }

  destroy() {
    this.$map = null;
    this.rectangle = null;
    this.tmprect = null;
  }
}

export default BaiduMapRect;
