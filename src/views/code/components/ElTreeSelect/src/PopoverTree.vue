<!-- 树状选择器 -->
<template>
  <el-popover
    ref="popover"
    class="select-tree-popover"
    :disabled="disabled"
    placement="bottom-start"
    trigger="click"
    @show="onShowPopover">
    <el-tree
      ref="tree"
      class="select-tree"
      highlight-current
      :style="`min-width: ${treeWidth}`"
      :data="data"
      :props="treeProps"
      :expand-on-click-node="true"
      :filter-node-method="filterNode"
      :default-expand-all="false"
      @node-click="onClickNode">
    </el-tree>
    <el-input
      slot="reference"
      ref="input"
      v-model="labelModel"
      :disabled="disabled"
      :style="`width: ${width}px`"
      :class="{ 'rotate': showStatus }"
      suffix-icon="el-icon-arrow-down"
      :clearable="clearable"
      :placeholder="placeholder"
      @clear="onClear">
    </el-input>
  </el-popover>
</template>

<script>
export default {
  name: 'Pagination',
  // 设置绑定参数
  model: {
    prop: 'value',
    event: 'selected'
  },
  props: {
    clearable: {
      type: Boolean,
      default: true
    },
    // 是否禁用
    disabled: {
      type: Boolean,
      default: false
    },
    // 只能末端节点点击
    onlyChild: {
      type: Boolean,
      default: false
    },
    // 接收绑定参数
    value: {
      type: [String, Number],
      default: null
    },
    // 输入框宽度
    width: {
      type: String,
      default: ''
    },
    // 选项数据
    options: {
      type: Array,
      required: true
    },
    // 输入框占位符
    placeholder: {
      type: String,
      required: false,
      default: '请选择'
    },
    // 树节点配置选项
    treeProps: {
      type: Object,
      required: false,
      default: () => ({
        parent: 'parentId',
        value: 'rowGuid',
        label: 'areaName',
        children: 'children'
      })
    }
  },
  data() {
    return {
      // 树状菜单显示状态
      showStatus: false,
      // 菜单宽度
      treeWidth: 'auto',
      // 输入框显示值
      labelModel: '',
      // 实际请求传值
      valueModel: '',
      // 当前节点对象
      currentNode: {}
    }
  },
  computed: {
    // 是否为树状结构数据
    dataType() {
      const jsonStr = JSON.stringify(this.options)
      return jsonStr.indexOf(this.treeProps.children) !== -1
    },
    // 若非树状结构，则转化为树状结构数据
    data() {
      return this.dataType ? this.options : this.switchTree()
    }
  },
  watch: {
    labelModel(val) {
      if (!val) {
        this.valueModel = ''
      }
      this.$refs.tree.filter(val)
    },
    value(val) {
      this.labelModel = this.queryTree(this.data, val) && this.queryTree(this.data, val)[this.treeProps.label]
      this.$emit('change', this.currentNode)
    }
  },
  created() {
    // 检测输入框原有值并显示对应 label
    if (this.value) {
      this.valueModel = this.value
      this.labelModel = this.queryTree(this.data, this.value) && this.queryTree(this.data, this.value)[this.treeProps.label]
    }
    // 获取输入框宽度同步至树状菜单宽度
    this.$nextTick(() => {
      this.treeWidth = `${(this.width || this.$refs.input.$refs.input.clientWidth) - 24}px`
    })
  },
  methods: {
    // 单击节点
    onClickNode(node) {
      // 只能选择末端节点
      if (this.onlyChild) {
        if (!node[this.treeProps.children] || node[this.treeProps.children].length === 0) {
          this.labelModel = node[this.treeProps.label]
          this.valueModel = node[this.treeProps.value]
          this.currentNode = node
        } else {
          return
        }
      } else {
        this.labelModel = node[this.treeProps.label]
        this.valueModel = node[this.treeProps.value]
        this.currentNode = node
      }
      this.onCloseTree()
    },
    // 偏平数组转化为树状层级结构
    switchTree() {
      return this.cleanChildren(this.buildTree(this.options, '0'))
    },
    // 隐藏树状菜单
    onCloseTree() {
      this.onHidePopover()
      this.$refs.popover.showPopper = false
    },
    // 显示时触发
    onShowPopover() {
      this.showStatus = true
      this.$refs.tree.filter(false)
    },
    // 隐藏时触发
    onHidePopover() {
      this.showStatus = false
      this.$emit('selected', this.valueModel)
    },
    // 清空
    onClear() {
      this.$emit('selected', '')
      this.$emit('change', null)
    },
    // 树节点过滤方法
    filterNode(query, data) {
      if (!query) return true
      return data[this.treeProps.label].indexOf(query) !== -1
    },
    // 搜索树状数据中的 ID
    queryTree(tree, id) {
      let stark = []
      stark = stark.concat(tree)
      while (stark.length) {
        const temp = stark.shift()
        if (temp[this.treeProps.children]) {
          stark = stark.concat(temp[this.treeProps.children])
        }
        if (temp[this.treeProps.value] === id) {
          return temp
        }
      }
      return ''
    },
    // 将一维的扁平数组转换为多层级对象
    buildTree(data, id = '0') {
      const fa = (parentId) => {
        const temp = []
        for (let i = 0; i < data.length; i++) {
          const n = data[i]
          if (n[this.treeProps.parent] === parentId) {
            n.children = fa(n.rowGuid)
            temp.push(n)
          }
        }
        return temp
      }
      return fa(id)
    },
    // 清除空 children项
    cleanChildren(data) {
      const fa = (list) => {
        list.map((e) => {
          if (e.children.length) {
            fa(e.children)
          } else {
            delete e.children
          }
          return e
        })
        return list
      }
      return fa(data)
    }
  }
}
</script>

<style lang="scss">
.select-tree-popover{
  display: block;
  height: 40px;
  .el-input.el-input--suffix {
    cursor: pointer;
    overflow: hidden;
  }
  .el-input.el-input--suffix.rotate .el-input__suffix {
    transform: rotate(180deg);
  }
  .select-tree {
    max-height: 350px;
    overflow-y: scroll;
  }
  /* 菜单滚动条 */
  .select-tree::-webkit-scrollbar {
    z-index: 11;
    width: 6px;
  }
  .select-tree::-webkit-scrollbar-track,
  .select-tree::-webkit-scrollbar-corner {
    background: #fff;
  }
  .select-tree::-webkit-scrollbar-thumb {
    border-radius: 5px;
    width: 6px;
    background: #b4bccc;
  }
  .select-tree::-webkit-scrollbar-track-piece {
    background: #fff;
    width: 6px;
  }
}
</style>
