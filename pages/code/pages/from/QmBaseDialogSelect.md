# QmBaseDialogSelect 弹窗选择器

## 组件使用

```html
<base-dialog-select></base-dialog-select>
```

## 属性说明

|     属性      | 类型          | 说明                         | 默认值 |
| :-----------: | :------------ | ---------------------------- | ------ |
| value/v-moedl | String, Array | 绑定值                       | -      |
|     size      | String        | 输入框尺寸 medium/small/mini | -      |
|     attrs     | Object        | 下拉选择器其他属性，见下表   | -      |

## attrs

|   属性    | 类型          | 说明                         | 默认值 |
| :-------: | :------------ | ---------------------------- | ------ |
| clearable | String, Array | 是否可清空                   | -      |
|   size    | String        | 输入框尺寸 medium/small/mini | -      |

## Event

|   事件名称   | 说明                                        | 回调参数       |
| :----------: | :------------------------------------------ | -------------- |
| handleSelect | 在 Input 获得焦点时触发                     | (event: Event) |
|  clear /evn  | 在点击由 clearable 属性生成的清空按钮时触发 | (event: Event) |
