<template>
  <!-- 复制文本插件 -->
  <div>
    <el-link
      id="description"
      :data-clipboard-text="description"
      style="margin-left:20px"
      :underline="false"
      type="warning"
    >复制问题描述</el-link>
    <span>{{ description }}</span>
  </div>
</template>

<script>
import ClipboardJS from 'clipboard';
export default {
  computed: {
    description() {
      return '---------------';
    }
  },
  mounted() {
    this.clipboard = new ClipboardJS('#description');
    this.initClipboardJS();
  },
  beforeDestroy() {
    this.clipboard.off('success', this.clipboardSuccess);
    this.clipboard = null;
  },
  methods: {
    initClipboardJS() {
      const clipboard = this.clipboard;
      clipboard.on('success', this.clipboardSuccess);
    },
    clipboardSuccess(e) {
      this.$message.success('复制成功');
      e.clearSelection();
    }
  }
};
</script>
