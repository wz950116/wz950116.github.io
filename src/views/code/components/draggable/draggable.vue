<template>
  <draggable
    v-model="tableColumn"
    v-bind="dragOptions"
    handle=".icon-tuodong"
    @start="drag = true"
    @end="drag = false"
  >
    <transition-group :name="drag ? null:'flip-list' ">
      <el-row v-for="col in tableColumn" :key="col.prop">
        <el-col :span="17">
          <el-checkbox v-model="col.show"></el-checkbox>
          <span style="margin-left:20px">{{ col.label }}</span>
        </el-col>
        <el-col style="text-align: center;" :span="4">
          <i class="iconfont icon-tuodong"></i>
        </el-col>
      </el-row>
    </transition-group>
  </draggable>
</template>

<script>
import draggable from 'vuedraggable';
export default {
  components: {
    draggable
  },
  data() {
    return {
      drag: false,
      dragOptions: {
        animation: 300,
        disabled: false,
        ghostClass: 'sortable-ghost', // Class name for the drop placeholder
        chosenClass: 'sortable-chosen', // Class name for the chosen item
        dragClass: 'sortable-drag' // Class name for the dragging item
      },
      tableColumn: [{
        prop: 'toDate',
        label: '当前阶段到达时间',
        minWidth: '180',
        show: false,
        sortable: true
      },
      {
        prop: 'taskBegin',
        label: '当前阶段开始时间',
        minWidth: '180',
        show: false,
        sortable: true
      },
      {
        prop: 'taskEnd',
        label: '当前阶段截至时间',
        minWidth: '180',
        show: false,
        sortable: true
      }]
    };
  }
};
</script>
