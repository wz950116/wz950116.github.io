# 文件上传 v2(可定义回调函数)

## 组件使用

```html
<qm-upload-v2
  :showFileList="true"
  :accept="accept"
  :multiple="multiple"
  :uploadUrl="uploadUrl"
></qm-upload-v2>
```

## 属性说明

|         参数         | 说明                                                  | 类型     | 可选值     | 默认值                                        |
| :------------------: | :---------------------------------------------------- | -------- | ---------- | --------------------------------------------- |
|      uploadUrl       | 必选参数，上传的地址                                  | string   | -          | process.env.BASE_API + '/api/sys/file/upload' |
|        accept        | 接受上传的文件类型（thumbnail-mode 模式下此参数无效） | -        | -          | '\*.\*'                                       |
|       disabled       | 是否禁用                                              | Boolean  | false/true | false                                         |
|       btnName        | 按钮名称                                              | String   | -          | 上传                                          |
|      notifyFlag      | 是否弹出信息                                          | Boolean  | -          | false                                         |
|     showFileList     | 是否展示文件列表                                      | Boolean  | -          | false                                         |
|       multiple       | 是否可多选                                            | Boolean  | -          | false                                         |
|      permission      | 操作权限                                              | Array    | -          | null                                          |
|      paramData       | 参数数据                                              | Object   | -          | -                                             |
|       iconName       | icon 名称                                             | String   | -          | 线性-上传                                     |
| beforeUploadCallback | 文件上传前回调                                        | Function | -          | Function(file)                                |
|   progressCallback   | 文件上传时回调                                        | Function | -          | function(event, file, fileList)               |
|   successCallback    | 文件上传成功回调                                      | Function | -          | function(response, file, fileList)            |
|    errorCallback     | 文件上传错误回调                                      | Function | -          | function(err, file, fileList)                 |
|    changeCallback    | 文件状态改变回调                                      | Function | -          | function(file, fileList)                      |
