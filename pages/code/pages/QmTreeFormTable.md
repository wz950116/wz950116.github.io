# 树形控件页面

## 组件引入

> 在 template 中使用

```html
<qm-tree-form-table :treeTableData="treeTableData"></qm-tree-form-table>
```

## treeTableData 属性说明

```javascript
export default {
  data() {
    return {
      treeTableData: {
        form:{}
        mainData: [],
      },
    };
  },
};
```

|  属性名  | 类型   | 默认值 | 说明                                            |
| :------: | :----- | :----- | ----------------------------------------------- |
|   form   | object | -      | 页面左侧及表单内容[form ](#form-属性说明)       |
| mainData | array  | -      | 右侧列表数据数组[mainData ](#mainData-属性说明) |

## form 数据说明

|      属性名       | 类型     | 默认值 | 说明                                                                                              |
| :---------------: | :------- | :----- | ------------------------------------------------------------------------------------------------- |
|     leftWidth     | number   |        | 左侧的宽度，默认不写为 200px                                                                      |
|     treeName      | string   |        | 左侧标题                                                                                          |
|     isTopBar      | Boolean  | false  | 左侧是否有顶部按钮                                                                                |
|      topBar       | array    |        | 左侧按钮组                                                                                        |
|     isSearch      | Boolean  | false  | 左侧是否有搜索框                                                                                  |
|   showCheckbox    | Boolean  | false  | 节点是否可被选择                                                                                  |
|     strictly      | Boolean  | false  | 在显示复选框的情况下，是否严格的遵循父子不互相关联的做法，默认为 false                            |
|   defaultProps    | object   | false  | 树节点默认属性 [defaultProps 数据说明](#defaultProps-数据说明)                                    |
|     expandAll     | Boolean  | false  | 是否默认展开所有节点                                                                              |
| expandOnClickNode | Boolean  | true   | 是否在点击节点的时候展开或者收缩节点 ，如果为 false，则只有点箭头图标的时候才会展开或者收缩节点。 |
|  formDataVisible  | Boolean  | false  | 是否有查询部分                                                                                    |
|     formData      | Boolean  | false  | 查询部分数据 属性详情见[QmForm 中 formData](pages/QmForm#formdata-属性说明)                       |
|     listQuery     | object   | -      | 查询部分表单数据对象                                                                              |
|    initSearch     | Boolean  | false  | 初始化是否查询默认条件下的树状数据                                                                |
|        api        | object   | -      | 左侧树列表对应 api api: { getTreeList: '' // 获取树数据 api},                                     |
|      apiData      | object   | -      | 左侧树列表对应 api 参数                                                                           |
|     showCode      | Boolean  | -      | 树节点进行过滤时是否支持使用唯一标识进行过滤                                                      |
| formSelectByTree  | Boolean  | -      | 是否为树节点查询                                                                                  |
| handleSearchClick | function | -      | 左侧树列表查询事件                                                                                |
|  handleNodeClick  | function | -      | 左侧树列表点击事件                                                                                |
|     validate      | function | -      | 左侧树列表点击验证                                                                                |

## defaultProps 数据说明

```javascript
    defaultProps: {
        children: 'children',
        key: 'code',
        label: 'name'
    }
```

|  属性名  | 类型                         | 默认值 | 说明                                                 |
| :------: | :--------------------------- | :----- | ---------------------------------------------------- |
|   key    | string                       | -      | 每个树节点用来作为唯一标识的属性，整棵树应该是唯一的 |
| children | string                       | -      | 指定子树为节点对象的某个属性值                       |
|  label   | string, function(data, node) | -      | 指定节点标签为节点对象的某个属性值                   |

## 全局按钮方法

|  属性名   | 说明 |
| :-------: | ---- |
|    add    | 新增 |
|   view    | 查看 |
| detailSet | 设置 |
|  update   | 修改 |
|  remove   | 删除 |
|  refresh  | 刷新 |
|  export   | 导出 |
|   print   | 打印 |
|  expand   |      |

## mainData 数据说明

```javascript
    mainData: {
      initSearch: true;
      api: {},
      apiData:{}
      table:{},
      bottomBar:{}
    }
```

|   属性名   | 类型    | 默认值 | 说明                                                                  |
| :--------: | :------ | :----- | --------------------------------------------------------------------- |
|  isTopBar  | Boolean | false  | 列表数据上方是否有按钮组                                              |
|   topBar   | Boolean | false  | 按钮组数据                                                            |
| initSearch | Boolean | false  | 初始化是否查询默认条件下的列表数据                                    |
|    api     | object  | -      | 右侧表格对应 api：{search：'' //列表数据请求,doDelete:''列表数据删除} |
|  apiData   | object  | -      | 右侧表格对应 api 参数                                                 |
|   table    | object  | -      | 右侧表格列表数据 参数详情见[ table 数据说明](#table)                  |
| bottomBar  | object  | -      | 右侧表格分页数据                                                      |

## table

```javascript
table:{
    rowKey:'',
    showIndex:''
    showCheckbox:false,
    cols:[]
}
```

|  属性名   | 类型                  | 默认值 | 说明                                                                                    |
| :-------: | :-------------------- | :----- | --------------------------------------------------------------------------------------- |
| showIndex | boolean               | -      | 是否显示列表索引                                                                        |
|  rowKey   | Function(row)/String- |        | 行数据的 Key，用来优化 Table 的渲染                                                     |
| sortable  | boolean               | false  | 对应列是否可以排序，设置为 'custom'，则代表用户希望远程排序                             |
|   cols    | array                 | -      | 表格列数据数组 属性详情见[cols 属性说明](pages/dialog/QmDialogArrayTable#cols-属性说明) |

## cols

```javascript
table: {
  cols: [
    {
      prop: "voucherType",
      label: "凭证类型",
      width: 150,
      format: {
        func: 'dateFormat'//默认dataDictFormat字典码表过滤
        dict:'' this.$t(dictType)
        dictType:''//字典码表名称
      },
    },
  ];
}
```

|  属性名  | 类型    | 默认值 | 说明                              |
| :------: | :------ | :----- | --------------------------------- |
|   prop   | string  | -      | 对应列内容的字段名                |
|  width   | string  | -      | 对应列宽度                        |
| minWidth | string  | -      | 对应列最小宽度                    |
|  label   | string  | -      | 对应列名称                        |
|  isShow  | boolean | false  | 是否显示对应列                    |
|  isSlot  | boolean | false  | 是否显示自定义内容                |
|  format  | object  | -      | 对应列内容格式化[format](#format) |
| sortable | boolean | true   | 对应列是否可以排序                |

## format

```javascript
 format: {
        func: 'dateFormat'//默认dataDictFormat字典码表过滤
        dict:'' this.$t(dictType)
        dictType:''
      },
```

|  属性名  | 类型   | 默认值         | 说明                      |
| :------: | :----- | :------------- | ------------------------- |
|   func   | string | dataDictFormat | 过滤器名称                |
|   dict   | array  | -              | 对应列下拉选数据数组 list |
| dictType | string | -              | 对应列下拉选数据 value    |

![图例](../../images/QmTreeFormTable.jpg)
