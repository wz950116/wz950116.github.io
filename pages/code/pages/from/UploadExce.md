# 文件上传按钮

## 组件使用

```html
<template>
  <upload-excel-component
    :on-success="handleSuccess"
    :before-upload="beforeUpload"
    :btnName="$t('biz.btn.chooseFile')"
  />
</template>

<script>
  import UploadExcelComponent from "@/components/frame/UploadExcel/index.vue";
  export default {
    components: {
      UploadExcelComponent,
    },
  };
</script>
```

## 属性说明

|     属性      | 类型                          | 说明             | 默认值 |
| :-----------: | :---------------------------- | ---------------- | ------ |
|    btnName    | String                        | 按钮名称         | 上传   |
| before-upload | Function(file)                | 文件校验         | -      |
|  on-success   | Function({ results, header }) | 文件上传成功回调 | -      |
