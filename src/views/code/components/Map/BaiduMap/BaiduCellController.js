import MapCellBase from '../MapCellBase.js';
import { getGisWebGridsJson } from '@/common/api/gis-static/gis-web.js';
import { areaPoint, gridFrame } from '@/common/api/ad-web/adms_div.js';

class CellGridPolygon {
  selectOptions = {
    fillColor: '#0041FF',
    fillOpacity: 0.4
  };

  noSelectOptions = {
    fillColor: '#0041FF',
    fillOpacity: 0.1
  };

  disabledOptions = {
    fillColor: '#BDBDBD',
    fillOpacity: 0.8
  };

  constructor(polygon) {
    this.polygon = polygon;
    this.isSelect = false;
    this.isDisabled = false;
  }

  click() {
    if (this.isDisabled) return;
    this.isSelect ? this.cancelSelect() : this.select();
  }

  select() {
    if (this.isSelect) return;
    this.polygon.setStyle(this.selectOptions);
    this.isSelect = true;
    this.isDisabled = false;
  }

  cancelSelect() {
    if (!this.isSelect) return;
    this.polygon.setStyle(this.noSelectOptions);
    this.isSelect = false;
    this.isDisabled = false;
  }

  disabled() {
    if (this.isDisabled) return;
    this.polygon.setStyle(this.disabledOptions);
    this.isDisabled = true;
    this.isSelect = false;
  }

  unDisabled() {
    if (!this.isDisabled) return;
    this.polygon.setStyle(this.noSelectOptions);
    this.isDisabled = false;
  }

  remove() {
    this.polygon.destroy();
    this.polygon = null;
  }
}

/**
 * 百度地图单元网格控制器
 */
class BaiduCellController extends MapCellBase {
  constructor(map) {
    super(map);
    this.isStartDrawRectangle = false;
  }

  /** 根据行政区划编码查询并绘制行政区划形状 */
  async drawShapeAreaCode(areaCode) {
    if (!areaCode) return;
    if (this.areaCode === areaCode) {
      this.cellGridMap.forEach(item => item.cancelSelect());
      return;
    }
    this.areaCode = areaCode;
    const { areaCenterPoints } = this.map.gisConfig;
    const currentPoints = areaCenterPoints.find(
      item => item.areaCode === areaCode
    );
    if (currentPoints) {
      await this.map.fitBounds(currentPoints.coordinates);
    }
    await this.drawAllCellGridMap(areaCode);
  }

  /** 绘制当前区域所有单元网格 */
  async drawAllCellGridMap(areaCode) {
    this.removeCellGridMap(this.cellGridMap);
    await this.drawAddSelectCellGrid(areaCode);
  }

  /** 绘制当前责任网格选择的单元网格 */
  drawSelectCellGridMap(cellGridCodes = []) {
    const cellGridMap = this.cellGridMap;
    cellGridCodes.forEach(gridCode => {
      const cellGridPolygon = cellGridMap.get(gridCode);
      cellGridPolygon && cellGridPolygon.select();
    });
  }

  /** 绘制已经被其他责任网格选择的单元网格 */
  drawRecordedCellGridMap(cellGridCodes = []) {
    const cellGridMap = this.cellGridMap;
    cellGridCodes.forEach(gridCode => {
      const cellGridPolygon = cellGridMap.get(gridCode);
      cellGridPolygon && cellGridPolygon.disabled();
    });
  }

  /** 通过单元网格code查询并绘制单元网格 */
  async getCellGridsByAreaCode(areaCode) {
    const gridShapeList = await getGisWebGridsJson(areaCode);
    return Array.isArray(gridShapeList) ? gridShapeList : [];
  }

  /** 绘制并选择单元网格 */
  async drawAddSelectCellGrid(cellGridCodes = [], type = 'cancelSelect') {
    const gridShapeList = await this.getCellGridsByAreaCode(cellGridCodes);
    // * 当需要绘制的网格数量超出 500 时, 采用异步分批绘制
    if (gridShapeList.length >= 500) {
      this._drawCellGridByAnimation(gridShapeList, type);
    } else {
      this._drawCellGridByOnTime(gridShapeList, type);
    }
  }

  /** 绘制单元网格 */
  drawCellGrid(shape, type = 'select', options) {
    if (!shape) return false;
    const polygon = this.map.polygon(shape.geojson, options);
    if (polygon) {
      const cellGridPolygon = new CellGridPolygon(polygon);
      cellGridPolygon[type]();
      this.cellGridMap.set(shape.code, cellGridPolygon);
    }
  }

  /** 通过 code 点击单元网格 */
  clickCellGridByGridCode(gridCodes) {
    const cellGridMap = this.cellGridMap;

    if (typeof gridCodes === 'string') {
      const cellGridPolygon = cellGridMap.get(gridCodes);
      cellGridPolygon && cellGridPolygon.click();
    }

    if (Array.isArray(gridCodes)) {
      gridCodes.forEach(girdCode => {
        const cellGridPolygon = cellGridMap.get(girdCode);
        cellGridPolygon && cellGridPolygon.click();
      });
    }
  }

  /** 网格点选 */
  async cellGridClick(val) {
    try {
      const { data: pointDetail } = await areaPoint(val.latlng);
      if (!pointDetail) return false;
      if (pointDetail.districtCode !== this.areaCode) {
        return false; // 不在当前行政区划
      }
      this.clickCellGridByGridCode(pointDetail.gridCode);
    } catch (error) {
      console.log(error);
    }
  }

  /** 网格框选 */
  async mapRecSelect(val) {
    if (!this.areaCode) return;
    const { data } = await gridFrame(val, this.areaCode);
    if (data && Array.isArray(data)) {
      this.clickCellGridByGridCode(data.map(item => item.code));
    }
  }

  /** 移除所有单元格 */
  removeAllCellGridMap() {
    this.removeCellGridMap(this.cellGridMap);
  }
}

export default BaiduCellController;
