<template>
  <!-- expand-on-click-node: 默认值为 true，如果为 false，则只有点箭头图标的时候才会展开或者收缩节点 -->
  <!-- check-on-click-node: 默认值为 false，即只有在点击复选框时才会选中节点 -->
  <!-- check-strictly 在显示复选框的情况下，是否严格的遵循父子不互相关联的做法，默认为 false -->
  <el-popover ref="popover" placement="bottom" trigger="click" :disabled="disabled" @show="onShowPopover">
    <el-tree
      v-if="treeData && treeData.length > 0 && !isClear"
      ref="tree"
      :style="{'min-width': treeWidth, height: '300px', 'overflow-y': 'auto'}"
      class="select-tree"
      :data="treeData"
      :props="defaultProps"
      :node-key="nodeKey"
      :show-checkbox="multiple"
      :expand-on-click-node="!clickParent"
      :check-on-click-node="multiple"
      :check-strictly="strictly"
      :default-expand-all="defaultExpandAll"
      :default-expanded-keys="defaultExpandedKeys"
      :default-checked-keys="defaultCheckedKeys"
      :filter-node-method="filterNode"
      highlight-current
      @node-click="handleNodeClick"
      @check="handleCheckClick">
    </el-tree>
    <div v-else :style="{'min-width': treeWidth, 'height': '100px', 'line-height': '100px', 'text-align': 'center'}">暂无数据</div>
    <el-input
      slot="reference"
      ref="input"
      v-model="treeValue"
      placeholder=""
      :readonly="!isFilter"
      :clearable="clearable"
      @clear="clearFun"
      @focus="focusFun"
      @blur="blurFun"></el-input>
  </el-popover>
</template>

<script>
export default {
  name: 'ElTreeSelect',
  model: {
    prop: 'value',
    event: 'change'
  },
  props: {
    value: {
      type: [Number, String],
      default: null
    },
    defaultProps: {
      type: Object,
      default() {
        return {
          children: 'children',
          label: 'label'
        }
      }
    },
    // 是否默认展开所有节点
    defaultExpandAll: {
      type: Boolean,
      default: false
    },
    // 是否多选
    multiple: {
      type: Boolean,
      default: false
    },
    // 唯一标识对应字段
    nodeKey: {
      type: String,
      default: 'id'
    },
    // 父节点是否可点击
    clickParent: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    treeData: {
      type: Array,
      default() {
        return []
      }
    },
    // 是否关联父子节点
    strictly: {
      type: Boolean,
      default: false
    },
    clearable: {
      type: Boolean,
      default: true
    },
    selectCheck: {
      type: Function,
      default: null
    },
    isFilter: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      treeValue: '',
      treeWidth: 'auto',
      treeValueMap: {},
      isClear: false,
      defaultExpandedKeys: [], // 默认展开节点 key 的数组
      defaultCheckedKeys: [] // 默认勾选的节点的 key 的数组
    }
  },
  watch: {
    value(newValue) {
      if (this.$refs.tree) this.$refs.tree.setCheckedKeys([])
      if (!newValue || newValue.length === 0) {
        this.treeValue = ''
      } else {
        this.getTreeLabel(this.treeData, newValue)
      }
    },
    treeData(newList) {
      if (!this.value || this.value.length === 0) {
        this.treeValue = ''
      } else if (newList.length > 0) {
        this.getTreeLabel(newList, this.value)
      }
    }
  },
  created() {
    // 获取输入框宽度同步至树状菜单宽度
    this.$nextTick(() => {
      this.treeWidth = `${this.$refs.input.$el.clientWidth}px`
    })
  },
  mounted() {
    window.onresize = function() {
      this.treeWidth = `${this.$refs.input.$el.clientWidth}px`
    }
  },
  methods: {
    // 点击节点
    handleNodeClick(data, node) {
      if (!this.multiple) {
        const children = this.defaultProps.children
        if (this.clickParent || (data[children]) && !data[children].length) {
          if (this.selectCheck) {
            if (!this.selectCheck(data)) {
              return
            }
          }
          this.treeValue = data[this.defaultProps.label]
          this.$emit('change', data[this.nodeKey])
          this.$emit('changeAll', { data, node })
          this.$refs.popover.showPopper = false
        }
      }
    },
    // 点击多选框
    handleCheckClick(data, checked) {
      if (this.multiple) {
        if (this.selectCheck) {
          if (!this.selectCheck(data)) {
            return
          }
        }
        if (this.strictly) {
          const checks = []
          checked.checkedNodes.map(v => {
            checks.push(v[this.nodeKey])
          })
          this.$emit('change', checks)
          this.$emit('changeAll', checked.checkedNodes)
        } else {
          const checks = []
          checked.checkedNodes.map(v => {
            if (!v.children) checks.push(v[this.nodeKey])
          })
          this.$emit('change', checks)
          this.$emit('changeAll', checked.checkedNodes)
        }
      }
    },
    // 处理选中显示
    getTreeLabel(data, value) {
      if (value === '') {
        this.treeValue = ''
        this.clearFun()
        return
      }
      if (!this.multiple) {
        data.forEach(i => {
          if (i[this.nodeKey] === value) {
            this.treeValue = i[this.defaultProps.label]
          } else if (i[this.defaultProps.children] && i[this.defaultProps.children].length > 0) {
            this.getTreeLabel(i[this.defaultProps.children], value)
          }
        })
      } else {
        // 判断是否是数组
        if (value instanceof Array) {
          // 展开
          this.defaultExpandedKeys = value
          // 勾选
          this.defaultCheckedKeys = value
          // 显示在输入框
          this.recursionShowValue()
          const tmpArr = []
          value.forEach(i => {
            tmpArr.push(this.treeValueMap[i])
          })
          this.treeValue = tmpArr.join(',')
        }
      }
    },
    // 递归查询树形节点注入map
    recursionShowValue(data = this.treeData) {
      data.forEach(v => {
        this.treeValueMap[v[this.nodeKey]] = v[this.defaultProps.label]
        if (v.children && v.children.length > 0) {
          this.recursionShowValue(v.children)
        }
      })
    },
    // 树节点过滤方法
    filterNode(query, data) {
      if (!query) return true
      return data[this.defaultProps.label].indexOf(query) !== -1
    },
    // 获取焦点
    focusFun() {
      if (!this.$refs.tree) return
      this.$nextTick(() => {
        if (!this.value) {
          this.$refs.tree.filter('')
        } else {
          this.$refs.tree.filter(this.treeValue)
        }
      })
    },
    // 失去焦点
    blurFun() {
      if (this.treeValue === '' || !this.value) {
        this.treeValue = ''
        this.$emit('change', '')
        this.$emit('changeAll', null)
      } else if (this.value) {
        // 能匹配则自动补全
        this.getTreeLabel(this.treeData, this.value)
      }
    },
    // 清除
    clearFun() {
      if (!this.multiple) {
        this.$emit('change', '')
        this.$emit('changeAll', null)
        // 暂时移除 防止清除后再次点开有选中样式BUG
        this.isClear = true
      } else {
        this.$refs.tree.setCheckedKeys([])
        this.$emit('change', [])
        this.$emit('changeAll', null)
      }
      this.$nextTick(() => {
        this.$refs.popover.showPopper = false
        this.isClear = false
      })
    },
    // 每次打开列表
    onShowPopover() {
      this.$refs.tree.filter(false)
      this.$nextTick(() => {
        this.$refs.tree.setCurrentKey(this.value)
      })
    }
  }
}
</script>

<style scoped>
.select-tree {
  max-height: 200px;
  overflow-y: auto;
}
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
</style>

<style lang='scss'>
.el-popover {
  min-width: unset !important;
  padding: 0 !important;
  .el-tree-node {
    .el-tree-node__content {
      box-sizing: content-box;
      padding: 4px 8px 4px 0;
    }
  }
}
</style>
