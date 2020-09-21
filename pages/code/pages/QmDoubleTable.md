# 双 table 组件

## 组件引入

> template 下直接引入组件

```html
<qm-double-table ref="qmTable" :treeTableData="treeTableData"></qm-double-table>
```

## treeTableData 数据说明

|   属性   | 类型   | 说明            | 默认值 |
| :------: | :----- | --------------- | ------ |
|   form   | object | 左侧 table 数据 | -      |
| mainData | object | 右侧 table 数据 | -      |

## form

|       属性        | 类型     | 说明                                                                                                                           | 默认值 |
| :---------------: | :------- | ------------------------------------------------------------------------------------------------------------------------------ | ------ |
|     treeName      | string   | 左侧内容标题名称                                                                                                               | -      |
|     isTopBar      | Boolean  | 是否显示按钮组                                                                                                                 | -      |
|      topBar       | array    | 按钮组数据 见下表 [topBar](#topBar)                                                                                            | -      |
|       table       | object   | table 表格数据                                                                                                                 | -      |
|        api        | object   | api:{getTreeList:'',doDelete:''}                                                                                               | -      |
|      apiData      | object   | api 参数                                                                                                                       | -      |
|     validate      | object   | 点击行列表验证信息                                                                                                             | -      |
|  handleNodeClick  | function | 当某一行被点击时会触发该事件 (row, column, event)                                                                              | -      |
| handleCheckChange | function | 当表格的当前行发生变化的时候会触发该事件，如果要高亮当前行，请打开表格的 highlight-current-row 属性(currentRow, oldCurrentRow) | -      |

## topBar

```javascript
topBar: [
  {
    name: "update",
    type: "dialog",
    component: () => import("./editTree.vue"),
  },
  {
    name: "remove",
    refTree: true,
    getParam: (data) => {
      return data.id;
    },
  },
  {
    refTree: true,
    name: "refresh",
  },
];
```

|     属性名     | 类型     | 默认  | 说明                    |
| :------------: | :------- | :---: | ----------------------- |
|    getParam    | function |   -   | 按钮传参                |
|      i18n      | string   |   -   | 按钮多语言名称          |
| successMsgInfo | string   |   -   | 按钮成功提示信息        |
|    refTree     | function | false |
|    validate    | function |   -   | 按钮做相应验证          |
|      msg       | Boolean  |   -   | 验证不通过提示信息      |
|      type      | string   |   -   | 按钮类型 dialog / route |
|   component    | function |   -   | 按钮弹窗组件引用        |
|   routeInfo    |          |   -   | 路由跳转信息            |
|     event      | string   |   -   | 按钮点击事件            |
|      name      | string   |   -   | 按钮名称                |
|    iconName    | string   |   -   | 按钮图标名称            |
|   permitName   | string   |   -   | 操作权限                |

## 全局按钮方法-

|   属性    | 说明 |
| :-------: | :--- |
|    add    | 新增 |
|   view    | 查看 |
| detailSet | 设置 |
|  update   | 修改 |
|  remove   | 删除 |
|  refresh  | 刷新 |
|  export   | 导出 |
|   print   | 打印 |

## mainData

|       属性        | 类型     | 说明                                                                                                                           | 默认值 |
| :---------------: | :------- | ------------------------------------------------------------------------------------------------------------------------------ | ------ |
|    initSearch     | Boolean  | 是否初始化查询列表信息                                                                                                         | -      |
|     treeName      | string   | 左侧内容标题名称                                                                                                               | -      |
|     isTopBar      | Boolean  | 是否显示按钮组                                                                                                                 | -      |
|      topBar       | array    | 按钮组数据                                                                                                                     | -      |
|       table       | object   | table 表格数据                                                                                                                 | -      |
|        api        | object   | api:{search:'',doDelete:''}                                                                                                    | -      |
|      apiData      | object   | api 参数                                                                                                                       | -      |
|  handleNodeClick  | function | 当某一行被点击时会触发该事件 (row, column, event)                                                                              | -      |
| handleCheckChange | function | 当表格的当前行发生变化的时候会触发该事件，如果要高亮当前行，请打开表格的 highlight-current-row 属性(currentRow, oldCurrentRow) | -      |
|     bottomBar     | object   | 底部分页部分                                                                                                                   | -      |

## table

|   属性    | 类型                 | 说明                                                                                         | 默认值 |
| :-------: | :------------------- | -------------------------------------------------------------------------------------------- | ------ |
|  rowKey   | Function(row)/String | 行数据的 Key，用来优化 Table 的渲染                                                          | -      |
| showIndex | Boolean              | 是否显示序列                                                                                 | false  |
| sortable  | boolean, string      | 对应列是否可以排序，如果设置为 'custom'，则代表用户希望远程排序 可选值 true, false, 'custom' | false  |
|   cols    | array                | 表格数据 见下表                                                                              |

## cols

|   属性    | 类型    | 说明                                                 | 默认值             |
| :-------: | :------ | ---------------------------------------------------- | ------------------ |
|   width   | string  | -                                                    | 对应列宽度         |
| minWidth  | string  | -                                                    | 对应列最小宽度     |
|  isShow   | Boolean | 是否展示该列                                         | true               |
| formatter | Boolean | 是否展示该列                                         | true               |
|   prop    | string  | -                                                    | 对应列内容的字段名 |
|   label   | string  | -                                                    | 对应列名称         |
|  isSlot   | boolean | false                                                | 是否显示自定义内容 |
|   style   |
|  format   |         | 对应列内容格式化[format](#format)func /dict/dictType |

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
