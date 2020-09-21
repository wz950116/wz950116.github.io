# QmEditTab 组件

> QmEdit 组件下的 tab 标签内容组件

## 组件引入

> template 下直接引入组件

```html
<qm-edit-tab ref="tab" :tab="tab" @addRow="addRowHandle"></qm-edit-tab>
```

## 属性说明

| 属性名 | 类型   | 默认值 | 说明                   |
| :----: | :----- | :----- | ---------------------- |
|  tab   | Object | -      | 索引列表需要的数据对象 |

## edit 数据格式说明

```javascript
data(){
    return{
        tab:{
            type:'',
            param:'',
            editForm:'',
            api:{},
            apiData:{},
            topBar:{},
            table:[],
            formData:[]
        }
    }
}

```

## edit 属性说明

|  属性名  | 类型   | 默认值 | 说明                                | 可选值                                                                |
| :------: | :----- | :----- | ----------------------------------- | --------------------------------------------------------------------- |
|   type   | string | view   | 页面类型                            | add/view/assist/audit/update                                          |
|  param   | string | -      | 页面接收参数                        |                                                                       |
|   api    | object |        | 页面对应 API                        | [api 属性说明](#api-属性说明)                                         |
| apiData  | object |        | 页面对应 API 传参                   |                                                                       |
|  topBar  | array  |        | tab 标签页内 table 表格顶部按钮数据 | [topBar 属性说明](#topBar-属性说明)                                   |
| formData | Array  |        | tab 标签页内容为表单信息时使用      | [formData 属性说明](pages/QmForm#formdata-属性说明)同 QmFrom 中的一致 |
|  tables  | Array  | -      | tab 标签页内容为 table 表格时使用   | [tables 属性说明](#tables-属性说明)                                   |

## api 属性说明

```javascript
 api: {
   search:''
},
```

| 属性名 |  类型  | 说明       |
| :----: | :----: | :--------- |
| search | string | 初始化数据 |

## topBar 属性说明

> tab 标签页内 table 表格顶部按钮数据

```javascript
 topBar: [
    {
        name: 'add',
        type: 'dialog',
        iconName: '线性-增行',
        i18n: '弹窗增行',
        getParam() {
            return {}
        },
        component: () => import('@/views/example/indexDemo/productSelect.vue'),
        validate: this.validateAdd,
        setDefault: this.doAdd
    },
],
```

|   属性名   | 类型     | 默认  | 说明                           |
| :--------: | :------- | :---: | ------------------------------ |
|    type    | string   |   -   | 按钮类型 dialog /route         |
|    name    | string   |   -   | 按钮名称                       |
|  iconName  | string   |   -   | 按钮图标名称                   |
|   event    | string   |   -   | 按钮点击事件                   |
|   isShow   | array    |       | 按钮是否显示()                 |
|  validate  | function |   -   | 按钮做相应验证,name='import 时 |
|   attrs    | string   |   -   | 按钮属性                       |
| component  | function |   -   | 按钮弹窗组件引用               |
|    i18n    | string   |   -   | 按钮多语言名称                 |
|  disabled  | Boolean  | false | 按钮是否可用                   |
|  getParam  | object   |       | 按钮传参                       |
| setDefault | function |   -   | 设置打开弹窗默认值             |
| initChoose | function |       | 按钮弹出弹窗初始化数据         |
|  callback  | function |   -   | 关闭弹窗回调                   |
|    msg     | string   |       | 验证不通过时提示信息           |

### 基础默认按钮相关

| 属性名 | 说明 |
| :----: | ---- |
|  add   | 增行 |
| delete | 删行 |
|  copy  | 复制 |
| update | 修改 |
|  set   | 设置 |
| print  | 打印 |

## tables 属性说明

```javascript
 table: {
     showSummary:true,
     showSelection:false,
     cols:[]
 }

```

|    属性名     | 类型                 | 默认  | 说明                                                               | 可选值                                               |
| :-----------: | :------------------- | :---: | ------------------------------------------------------------------ | ---------------------------------------------------- |
|  showSummary  | Boolean              |       | 是否在表尾显示合计行                                               |                                                      |
| showSelection | Boolean              |       | 是否显示多选框                                                     |                                                      |
|   sortable    | boolean, string      | false | 对应列是否可以排序，若设置为 'custom'，则用户希望远程排序          | true, false, 'custom'                                |
|   treeProps   | Object               |       | 渲染嵌套数据的配置选项                                             | { hasChildren: 'hasChildren', children: 'children' } |
|    rowKey     | Function(row)/String |       | 行数据的 Key，用来优化 Table 的渲染,显示树形数据时，该属性是必填的 |                                                      |
|     cols      | array                |       | 列设置                                                             |                                                      |

## cols 属性说明

```javascript
cols: [
  {
    label: "多事件",
    prop: "feeCode",
    width: "120",
    element: "base-select",
    required: true,
    attrs: {
      data: "DD_FEE_TYPE",
      clearable: true,
    },
    event: this.onFeeCodeChange,
    changeAll: this.onFeeCodeChangeAll,
    summary: true,
    format: {
      func: "price",
    },
  },
];
```

|  属性名   | 类型     | 默认  | 说明                                                     | 可选值                                                        |
| :-------: | :------- | :---: | -------------------------------------------------------- | ------------------------------------------------------------- |
|   type    | string   |   -   | 对应列的类型                                             |                                                               |
|   prop    | string   |   -   | 对应列内容的字段名，也可以使用 property 属性             |                                                               |
|   label   | string   |   -   | 显示的标题                                               | -                                                             |
|   width   | string   |   -   | 对应列的宽度                                             |                                                               |
|  element  | string   |   -   | 列属性对应的输入框类型                                   | input-validate/input-formatter/base-select/base-dialog-select |
|   attrs   | Object   |   -   | 对应列属性值 [cols.attrs 属性说明](#cols.attrs-属性说明) |                                                               |
|   event   | function |   -   | 按钮事件自定义                                           |                                                               |
| changeAll | function |   -   | 选中值发生变化时触发                                     |                                                               |
|  summary  | Boolean  |   -   | 是否计算合计数据                                         |                                                               |
|  format   | Object   |   -   | 对应列格式化                                             |                                                               |
|  isShow   | Boolean  | true  | 是否显示该列                                             |                                                               |
| required  | Boolean  | false | 是否为必填项                                             |                                                               |
|   list    | array    |       | 该列下拉选数据数组                                       |                                                               |
| component | function |   -   | 对应列弹窗组件 element: 'base-dialog-select'时使用       |                                                               |
| callback  | function |   -   | 对应列弹窗关闭回调                                       |                                                               |
|   clear   | function |   -   | 清空数据函数                                             |

## cols.attrs 属性说明

```js
 attrs: {
    data: "DD_FEE_TYPE",
    clearable: true,
    format: 'yyyy-MM-dd',
    'value-format': 'yyyyMMdd',
    style: 'text-align:right',
    min: 0,
    max: 999999999999.999,
    type: 'thousands',
    precision: 3,
    multiple
},
```

## 事件

|   事件名称   | 说明               | 回调参数         |
| :----------: | ------------------ | ---------------- |
| closeDialog  | 关闭当前页面或弹窗 | --               |
|   copyRow    | 增行函数事件       | 当前复制选中对象 |
|    addRow    | 增行函数事件       | 当前             |
|  deleteRow   | 删行回调           | 当前选中删行对象 |
|  selectRow   | 删行回调           | 选中当前行       |
| initCallback | tab 初始化数据回调 | 初始化数据       |

## 示例代码(1) 对应列含输入框 table

```javascript
table: {
    showSummary: true,
    showSelection: false,
    cols: [
    {
    label: '多事件',
    prop: 'feeCode',
    width: '120',
    element: 'base-select',
    required: true,
    attrs: {
    data: 'DD_FEE_TYPE',
    clearable: true
    },
    event: this.onFeeCodeChange,
    changeAll: this.onFeeCodeChangeAll,
    summary: true,
    format: {
    func: 'price'
    }
    }, {
    label: '查询选择',
    prop: 'productName',
    element: 'base-dialog-select',
    component: () => import('@/views/example/indexDemo/productSelect.vue'),
    attrs: {
    data: '品种弹窗选择',
    clearable: true
    },
    callback: this.dialogHandler,
    clear: this.onClear
    }, {
    label: '树查询选择',
    prop: 'productNames',
    element: 'base-dialog-select',
    component: () => import('@/views/example/indexDemo/productTreeSelect.vue'),
    attrs: {
    data: '品种树形弹窗选择',
    clearable: true
    }
    }, {
    label: '金额输入',
    prop: 'minCapacity',
    element: 'input-formatter',
    attrs: {
    min: 0,
    max: 999999999999.999,
    type: 'thousands',
    precision: 2
    },
    required: true
    }, {
    label: '数字输入',
    prop: 'maxCapacity',
    element: 'input-formatter',
    attrs: {
    min: 0,
    max: 999999999999.999,
    type: 'thousands',
    precision: 3
    },
    required: true,
    event: this.onBlur
    }, {
    prop: 'custName',
    label: '文本'
    }, {
    prop: 'custHeadline',
    label: '输入框',
    element: 'input-validate',
    attrs: {
    clearable: true,
    style: 'text-align:right;'
    },
    event: this.onBlur
    }, {
    prop: 'usingFlag',
    label: '数据字典输入',
    element: 'base-select',
    list: this.$t('datadict.usingFlag'),
    attrs: {
    clearable: true
    },
    event: this.changeUsingFlag
    }, {
    prop: 'date',
    label: '日期输入',
    type: 'date',
    attrs: {
    clearable: true,
    format: 'yyyy-MM-dd',
    'value-format': 'yyyyMMdd'
    }
    }]
}

```

## 示例代码(2) 对应列格式化

```javascript
table: {
  cols: [
    {
      label: "日期显示",
      prop: "date",
      format: {
        func: "dateFormat",
        dict: "YYYY-MM-DD",
      },
    },
    {
      label: "数字显示",
      prop: "count",
      format: {
        func: "thousands",
        dict: 3,
      },
    },
    {
      label: "金额显示",
      prop: "money",
      format: {
        func: "thousands",
        dict: 2,
      },
    },
    {
      label: "数据字典显示",
      prop: "usingFlag",
      format: {
        dict: this.$t("datadict.usingFlag"),
      },
    },
  ];
}
```

## 示例代码(3) tab 标签下为 from 格式

```javascript
formData: [
  {
    type: "date",
    label: "时间区间选择",
    props: ["startTime2", "endTime2"],
    attrs: {
      clearable: true,
      format: "yyyy-MM-dd",
      "value-format": "yyyyMMdd",
    },
  },
  {
    label: "查询选择",
    prop: "productName",
    element: "base-dialog-select",
    component: () => import("@/views/example/indexDemo/productSelect.vue"),
    attrs: {
      data: "品种弹窗选择",
      clearable: true,
    },
    callback: this.secondCloseCallback,
  },
  {
    label: "查询选择2",
    prop: "productName2",
    element: "base-dialog-select",
    component: () => import("@/views/example/indexDemo/productSelect.vue"),
    attrs: {
      data: "品种弹窗选择",
      clearable: true,
    },
    callback: this.thirdCloseCallback,
  },
  {
    label: "商品简称",
    prop: "productCategoryAbbr",
    element: "input-validate",
    attrs: {
      clearable: true,
      disabled: false,
    },
    validate: [
      {
        required: true,
        trigger: "blur",
      },
    ],
  },
  {
    label: "客户名称",
    prop: "customerCode",
    element: "base-select",
    attrs: {
      data: "CUST_INFO", // 统一基础档案组件，传值data区分
      clearable: true,
      params: {
        typeCode: "4", // 不写:所有客户供应商经济商仓储公司， '1'只显示客户，'2'只显示供应商，
      },
    },
    validate: [
      {
        required: true,
        trigger: "change",
      },
    ],
    event: {
      change: this.onChange,
      evn: this.onEvn,
      changeAll: this.onChangeAll,
    },
  },
  {
    label: "商品编码",
    prop: "productCategoryCode",
    element: "input-validate",
    attrs: {
      clearable: true,
    },
  },
  {
    label: "状态",
    prop: "usingFlag",
    element: "base-select",
    list: this.$t("datadict.usingFlag"),
    default: "0",
    attrs: {
      clearable: true,
    },
    validate: [
      {
        required: true,
        trigger: "change",
      },
    ],
  },
  {
    label: "备注",
    prop: "remark",
    element: "el-input",
    attrs: {
      clearable: true,
      cols: 2,
    },
  },
];
```

![图例](../images/QmEdit.jpg)
