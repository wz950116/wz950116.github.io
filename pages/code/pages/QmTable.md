# QmTable 组件

## 组件引入

> template 下直接引入组件

```
 <qm-table ref='qmTable' :mainData='mainData' @initCallback='initCallback'></qm-table>
```

> 自定义列添加

```
 <qm-table ref='qmTable' :mainData='mainData' @initCallback='initCallback'>
    <template slot='isException' slot-scope='scope'>
        <el-tag size="mini" type="danger">{{121}}</el-tag>
        <el-tag size="mini" v-if="scope.row.isException==='1'" type="danger">{{$t('sys.log.fail')}}</el-tag>
        <el-tag size="mini" v-else type="success">{{$t('sys.log.success')}}</el-tag>
    </template>
 </qm-table>

```

## 属性说明

|  属性名  | 类型   | 默认值 | 说明               |
| :------: | :----- | :----- | ------------------ |
| mainData | Object | -      | 列表需要的数据对象 |

## mainData 属性说明

```
data(){
    return{
        mainData:{
            api:{}
            isTopBar: true,
            topBar: [],
            initSearch: false,
            isColset: true,
            table:{},
            bottomBar:{}
        }
    }
}

```

|   属性名   | 类型    | 默认值 | 说明                   | 可选值                                    |
| :--------: | :------ | :----- | ---------------------- | ----------------------------------------- |
|    api     | Object  |        | 列表对应 api           | [api 属性说明](#api-属性说明)             |
|  isTopBar  | boolean | -      | 是否显示表格上的按钮行 | 默认 false                                |
|   topBar   | array   | -      | 表格上的按钮行属性     | [topBar 属性说明](#topBar-属性说明)       |
| initSearch | boolean | -      | 列表初始化是否调用查询 | 默认 true                                 |
|  isColset  | boolean | -      | 是否开启列设置         | 默认 false                                |
|   table    | array   | -      | 表格信息属性           | [table 属性说明](#table-属性说明)         |
| bottomBar  | array   | -      | 底部分页               | [bottomBar 属性说明](#bottomBar-属性说明) |

## api 属性说明

```
api:{
    search: '/api/dd/product/list',
    doDelete: '/api/dd/product/remove',
    cancelAudit: '/api/dd/product/cancelAudit'
}
```

|     属性名      | 说明         |
| :-------------: | ------------ |
|     search      | 查询         |
| base-selectload | 树列表懒加载 |
|    doDelete     | 删除         |
|   cancelAudit   | 确认取消审核 |
|     submit      | 提交         |
|     export      | 导出         |
|       set       | 设置         |

## topBar 属性说明

```
 topBar: [
            {
                name: 'add',
                type: 'dialog',
                component: () => import('@/views/example/indexDemo/dialog.vue')
            },
            {
                name: 'add',
                i18n: '路由GET新增',
                type: 'route',
                routeInfo() {
                    return {
                        name: 'editTagDemo',
                        query: {
                            type: 'update',
                            id: '10086'
                        }
                    }
                }
            },
            {
                name: 'add',
                i18n: '路由POST新增',
                type: 'route',
                routeInfo() {
                    return {
                        name: 'editTagDemo',
                        params: {
                            type: 'update',
                            id: '200086'
                        }
                    }
                },
                validate: row => {
                    // 针对多个条件设置
                    return [
                        {
                            result: row.usingFlag === '0',
                            msg: this.$t('当前状态不可删除该条数据')
                        }
                    ]
                }
            },
            {
                name: 'remove',
                getParam(row) {
                    return row.id
                },
                validateApi(row) {
                    return {
                        url: '/check', // 接口
                        data: row // 参数
                    }
                },
                msg: this.$t('当前状态不可删除该条数据'),
                validate(row) {
                    return row.usingFlag === '1'
                }
            },
            {
                name: 'more',
                list: [
                    {
                        name: 'refresh'
                    },
                    {
                        name: 'defined',
                        permitName: ['add'], // 按钮权限标识
                        iconName: '线性-查看',
                        i18n: '自定义9527',
                        event: this.onDefined
                    }
                ]
            }
        ],
```

|   属性名    | 类型     | 说明             | 可选值                                                  |
| :---------: | :------- | ---------------- | :------------------------------------------------------ |
|    name     | string   | 按钮属性名称     | [全局按钮方法](# 全局按钮方法)                          |
|    type     | string   | 按钮选择类型     | dialog/route                                            |
|    i18n     | string   | 按钮自定义名称   |                                                         |
| permitName  | array    | 按钮权限标识     |                                                         |
|  iconName   | string   | 按钮图标名称     |                                                         |
|    event    |          | 按钮自定义事件   |                                                         |
|  component  | Function | 引入弹窗组件     | type:'dialog'时使用                                     |
|  routeInfo  | Function | 路由跳转信息     | type:'route'时使用                                      |
|  validate   | Function | 列表信息前端验证 | return 信息: result(验证条件) msg(验证不通过时提示信息) |
|     msg     | string   | 前端验证提示信息 |                                                         |
| validateApi | Function | 列表信息后端验证 | return 信息: url(验证接口) data(验证参数)               |
|  getParam   | Function | 传参             | return 参数信息                                         |
|    list     | array    | 下拉按钮数据     | name:'more'时使用                                       |

## 全局按钮方法

|     name      | 说明     |
| :-----------: | -------- |
|      add      | 新增     |
|     view      | 查看     |
|    update     | 修改     |
|    remove     | 删除     |
|  submitAudit  | 审核     |
| withdrawAudit | 撤回审核 |
|    refresh    | 刷新     |
| auditHistory  | 审核历史 |
|  cancelAudit  | 弃审     |
|    export     | 导出     |
|     print     | 打印     |
|    detail     | 查看明细 |
|    modify     | 变更     |
|      set      | 设置     |
|  selectBill   | 单据联查 |
|   generate    | 生成弹窗 |

## table 属性说明

```java
    table: {
        id: 'loginId',
        sortable: 'custom',
        showSummary: false,
        defineSummaryFun: this.showSummary,
        showCheckbox: true,
        selectionFixed: true,
        cols: [
              {
                prop: 'isException',
                label: 'table.status',
                isSlot: true,  //是否开启自定义列设置
                align: 'center',
            },
            {
                prop: 'productCategoryCode',
                width: '220',
                label: '商品编码',
                sortable: true, // 是否可以排序
                sortProp: 'abc'
            },

            {
                prop: 'usingFlag',
                minWidth: '500',
                align: 'center',
                label: '状态',
                format: { //格式化
                    dict: this.$t('datadict.usingFlag') //字典码表
                },
                summary: true //合计计算
            },
            {
                prop: 'money',
                label: '金额显示',
                width: '220',
                format: {
                    func: 'thousands',
                    dict: 2
                }
            },
            {
                prop: 'date',
                label: '日期显示',
                width: '220',
                format: {
                    func: 'dateFormat',
                    dict: 'YYYY-MM-DD'
                }
            }
        ]
    },
```

|      属性名      | 类型                        | 说明                                                                                                |      可选值       |
| :--------------: | :-------------------------- | --------------------------------------------------------------------------------------------------- | :---------------: |
|        id        | string                      | 列表 id                                                                                             |         -         |
|     sortable     | string                      | 对应列是否可以排序，如果设置为 'custom'，则代表用户希望远程排序，需要监听 Table 的 sort-change 事件 |         -         |
|   showSummary    | string                      | 是否在表尾显示合计行                                                                                |         -         |
| defineSummaryFun | Function({ columns, data }) | 自定义的合计计算方法                                                                                |         -         |
|   showCheckbox   | boolean                     | 是否显示多选框一列                                                                                  |    默认 false     |
|  selectionFixed  | string, boolean             | 列是否固定在左侧或者右侧，true 表示固定在左侧                                                       | true, left, right |
|  defineSpanFun   | Function({ columns, data }) | 合并行或列的计算方法                                                                                |         -         |
|    expandAll     | Boolean                     | 是否默认展开所有行，当 Table 包含展开行存在或者为树形表格时有效                                     |    默认 false     |
|   showCheckbox   | string                      |                                                                                                     |         -         |
|       cols       | array                       | 显示的数据                                                                                          |         -         |

## bottomBar-属性说明

```
 bottomBar: {
        pagination: {
            show: true,
            layout: 'total, sizes, prev, pager, next, jumper',
            pageSizes: [20, 40, 60, 80, 100]
        }
    }
```

|  属性名   | 类型     | 说明                         | 默认值                                 |
| :-------: | :------- | :--------------------------- | -------------------------------------- |
|   show    | boolean  | 是否显示分页                 | 默认 false                             |
|  layout   | String   | 组件布局，子组件名用逗号分隔 | 'prev, pager, next, jumper, ->, total' |
| pageSizes | number[] | 每页显示个数选择器的选项设置 | [10, 20, 30, 40, 50, 100]              |

## 方法

|    方法名    | 说明           |
| :----------: | -------------- |
| initCallback | 初始化回调函数 |

## 图例

![图例](../images/qmtable.jpg)
