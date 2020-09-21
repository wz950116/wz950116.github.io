# 格式化输入框

## 组件使用

```html
<input-formatter
  :min="f.attrs.startMin"
  :max="f.attrs.startMax !== undefined ? f.attrs.startMax : listQuery.data[f.props[1]]"
  v-model="listQuery.data[f.props[0]]"
  v-bind="f.attrs"
  size="mini"
></input-formatter>
```

## 属性说明

|      参数       | 说明                                     | 类型            | 可选值                | 默认值                         |
| :-------------: | :--------------------------------------- | --------------- | --------------------- | ------------------------------ |
| value / v-model | 绑定值                                   | string / number | -                     | -                              |
|    disabled     | 禁用                                     | boolean         | -                     | false                          |
|    readonly     | 是否只读                                 | boolean         | -                     | false                          |
|      size       | 输入框尺寸，只在 type!="textarea" 时有效 | string          | medium / small / mini | medium                         |
|    maxlength    | 最大输入长度                             | numbe           | max                   |                                |  | r | - | 50 |
|   placeholder   | 输入框占位文本                           | string          | -                     | -                              |
|    clearable    | 是否可清空                               | boolean         | -                     | false                          |
|  showPassword   | 是否显示切换密码图标                     | boolean         | -                     | false                          |
|     prepend     | 输入框前置内容，只对 type="text" 有效    | -               | -                     | -                              |
|     append      | 输入框后置内容，只对 type="text" 有效    | -               | -                     | -                              |
|      type       | 需要格式化类型 详细见下表                | string          | -                     | text                           |
|  validateType   | 验证类型                                 | string          |                       | 不允许 空格 特殊符号 表情 输入 |
|    precision    | 精度                                     | number          |                       | 0                              |
|      ltmax      | 允许输入最大值(不包含)                   | Number, String  |                       |                                |
|       max       | 允许输入最大值(包含)                     | Number, String  |                       |                                |
|      gtmin      | 允许输入最小值(不包含)                   | Number, String  |                       |                                |
|       min       | 允许输入最小值(包含)                     | Number, String  |                       |                                |
|   isValidate    | 是否开启验证                             | boolean         |                       | true                           |

## type

|     名称     | 说明                                 | 格式                        |
| :----------: | :----------------------------------- | --------------------------- |
|     num      | 数量                                 | num:'###,###'               |
|    weight    | 重量                                 | weight:'###,###.000'        |
|    price     | 单价                                 | price:'###,###.00'          |
|    money     | 金额                                 | money:'###,###.00'          |
|   exprice    | 无税单价                             | exprice:'###,###.000000'    |
|   taxrate    | 税率                                 | taxrate:'###,###.00'        |
| exchangeRate | 汇率                                 | exchangeRate:'###,###.0000' |
|  thousands   | 千分化 配合 max、min、precision 使用 |                             |
|   percent    | 百分数                               |                             |

## Input Events

|  事件名称  | 说明                                        | 回调参数                 |
| :--------: | :------------------------------------------ | ------------------------ |
|   event    | 在 Input 值改变时触发                       | (value: string / number) |
|   change   | 仅在输入框失去焦点或用户按下回车时触发      | (value: string / number) |
| userChange | 用户直接输入所产生的事件,不包含后台修改数据 | null                     |
| dataChange | 包含用户直接输入以及后台修改数据的变更      | null                     |
