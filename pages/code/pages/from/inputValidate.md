# 非法验证输入框

## 组件使用

```html
<input-validate
  v-model="scope.row.datadict"
  size="mini"
  placeholder="例:datadict.yesNo"
></input-validate>
```

## 属性说明

|      参数       | 说明                                     | 类型            | 可选值                                      | 默认值                         |
| :-------------: | :--------------------------------------- | --------------- | ------------------------------------------- | ------------------------------ |
| value / v-model | 绑定值                                   | string / number | -                                           | -                              |
|    disabled     | 禁用                                     | boolean         | -                                           | false                          |
|      size       | 输入框尺寸，只在 type!="textarea" 时有效 | string          | medium / small / mini                       | medium                         |
|    maxlength    | 最大输入长度                             | number          | -                                           | 50                             |
|   placeholder   | 输入框占位文本                           | string          | -                                           | -                              |
|    clearable    | 是否可清空                               | boolean         | -                                           | false                          |
|  showPassword   | 是否显示切换密码图标                     | boolean         | -                                           | false                          |
|     prepend     | 输入框前置内容，只对 type="text" 有效    | -               | -                                           | -                              |
|     append      | 输入框后置内容，只对 type="text" 有效    | -               | -                                           | -                              |
|      type       | 类型                                     | string          | text，textarea 和其他 原生 input 的 type 值 | text                           |
|  validateType   | 验证类型                                 | string          | email/phone/account/name(只允许输入汉字)    | 不允许 空格 特殊符号 表情 输入 |

## Input Events

| 事件名称 | 说明                                   | 回调参数                 |
| :------: | :------------------------------------- | ------------------------ |
|  event   | 在 Input 值改变时触发                  | (value: string / number) |
|  change  | 仅在输入框失去焦点或用户按下回车时触发 | (value: string / number) |
