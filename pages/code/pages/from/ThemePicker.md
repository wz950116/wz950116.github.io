# 主题换色

## 组件使用

```html
<template>
  <theme-picker :title="$t('navbar.theme')"></theme-picker>
</template>

<script>
  import ThemePicker from "@/components/frame/ThemePicker";
  export default {
    components: {
      ThemePicker,
    },
  };
</script>
```

## 属性说明

| 属性  | 类型   | 说明         | 默认值 |
| :---: | :----- | ------------ | ------ |
| title | String | 鼠标提示名称 | -      |
