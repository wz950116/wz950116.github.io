# 上传

## 组件使用

```html
<qm-upload
  :uploadUrl="licUrl"
  :notifyFlag="false"
  btnName="上传lic文件"
  @onFileChange="uploadLic"
></qm-upload>
```

## 属性说明

|    参数    | 说明                                                  | 类型    | 可选值     | 默认值                                        |
| :--------: | :---------------------------------------------------- | ------- | ---------- | --------------------------------------------- |
| uploadUrl  | 必选参数，上传的地址                                  | string  | -          | process.env.BASE_API + '/api/sys/file/upload' |
|   accept   | 接受上传的文件类型（thumbnail-mode 模式下此参数无效） | -       | -          | '\*.\*'                                       |
|  disabled  | 是否禁用                                              | Boolean | false/true | false                                         |
|  btnName   | 按钮名称                                              | String  | -          | 上传                                          |
| notifyFlag | 是否弹出信息                                          | Boolean |            | false                                         |

## Events

|   事件名称   | 说明               | 回调参数             |
| :----------: | :----------------- | -------------------- |
| onFileChange | 文件上传成功后函数 | 上传文件返回所有参数 |
