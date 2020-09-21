# QmBaseSelect

> 基本下拉选择器

##

```html
<base-select
  size="mini"
  v-moedl="page.parentCode"
  :attrs="{data: 'CODE_FORM', disabled:true  }"
></base-select>
```

## 属性说明

|     属性      | 类型          | 说明                                       | 默认值 |
| :-----------: | :------------ | ------------------------------------------ | ------ |
| value/v-moedl | String, Array | 绑定值                                     | -      |
|    opType     | String        | 弹窗打开方式                               | -      |
|     type      | String        |                                            | -      |
|     size      | String        | 输入框尺寸 medium/small/mini               | -      |
|    newList    | Array         | 自定义下拉选数据                           | -      |
|  newRowList   | Array         | 自定义下拉选数据 canChangeList:true 时有效 | -      |
|     attrs     | Object        | 下拉选择器其他属性，见下表                 | -      |

# attrs

|     属性      | 类型     | 说明                                                                | 默认值 |
| :-----------: | :------- | ------------------------------------------------------------------- | ------ |
|   datadict    | String   | 字典码表对应属性名                                                  | -      |
|     data      | String   | 字典码表对应属性名详细见下表                                        | -      |
| labelShowCode | Boolean  | 下拉选是否展示 code                                                 | false  |
| canChangeList | Boolean  | 是否自定义下拉选数据                                                | false  |
|  filterable   | Boolean  | 是否可搜索                                                          | false  |
|    remote     | Boolean  | 是否为远程搜索                                                      | false  |
|   disabled    | Boolean  | 是否禁用                                                            | false  |
|   clearable   | Boolean  | 是否可以清空选项                                                    | false  |
|    remote     | Boolean  | 是否为远程搜索                                                      | false  |
|    params     | String[] | 附加参数                                                            |
| showMoreList  | Boolean  | 模糊查询是否显示更多的值 ,对应显示条数 对应 params 下的 size 属性值 | false  |
|   dataAuth    | String   | 获取下拉选 dataAuth 参数                                            | -      |
|   dispField   | String   | 显示字段                                                            | -      |
|   component   | function | 弹窗选择                                                            | -      |

## data

|     属性      | 说明                 |
| :-----------: | :------------------- |
|     DATE      | 年度选择下拉组件     |
|  TREE_ORGAN   | 树形机构下拉组件     |
|  TREE_ORGAN   | 树形部门下拉组件     |
|  TREE_STAFF   | 树形人员表下拉组件   |
| TREE_ORG_DEPT | 树形机构部门下拉组件 |
|   TREE_AREA   | 树形地区下拉组件     |

## Event

|   事件名称    | 说明                  | 回调参数                      |
| :-----------: | :-------------------- | ----------------------------- |
|      evn      | 选中值发生变化时触发  | 目前的选中值                  |
|    change     | 选中值发生变化时触发  | 目前的选中值                  |
|   changeAll   | 点击节点              | 当前点击的节点的所有参数      |
| visibleChange | 下拉框出现/隐藏时触发 | 出现则为 true，隐藏则为 false |
| handleSelect  | 保存当前组件配置项    | -                             |
| closeHandler  | 关闭更多数据选择弹窗  | -                             |
