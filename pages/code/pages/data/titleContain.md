# 弹窗头部

## 组件使用

> template 下直接引入组件

```html
<title-contain
  :titleName="$t('office.handle.children.selectAuditor')"
  @TitleFun="$emit('closeHandler')"
/>
```

## 属性说明

|   属性名    | 类型    | 默认值 | 说明             |
| :---------: | :------ | :----- | ---------------- |
|  titleName  | String  | -      | 头部名称         |
| isShowClose | Boolean | -      | 是否显示关闭按钮 |

# Event

|   事件名称   | 说明                 | 回调参数 |
| :----------: | :------------------- | -------- |
|   TitleFun   | 弹窗关闭回调         | -        |
| screenChange | 弹窗最大化最小化回调 | -        |
