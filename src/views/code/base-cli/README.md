# 项目模板

## 依赖项安装
```
npm install
```
## 项目运行
```
npm run dev
```
## 开发环境打包
```
npm run build
```
目录：dist
## 测试环境打包
```
npm run build:test
```
目录：dist
## 生产环境打包
```
npm run build:production
```
目录：dist
## 变量文件
- 开发环境变量文件 .env.development
- 生产环境变量文件 .env.production
- 测试环境变量文件 .env.test
## 变量解释
- VUE_APP_API_URL: 项目接口地址
- VUE_APP_UNIFIED_PLATFORM: 三中心接口地址
- VUE_APP_SOCKET_URL: websocket接口地址

## 所需代理配置
```nginx
server {
  location /agency {
    proxy_pass VUE_APP_UNIFIED_PLATFORM;
  }
}
```
## 目录结构
```
mange-web-base
├── public
│   ├── favicon.ico
│   ├── index.html
│   └── socketJS                  // 统一平台的 socket 库，用于 socket 对接 
├── src
│   ├── api                       // api 接口目录，已封装 login 相关接口请求
│   ├── assets                    // 公共图片资源文件
│   ├── common                    // 公共
│   │   ├── css
│   │   └── js
│   ├── components
│   ├── layout
│   ├── mixins
│   ├── router
│   ├── store
│   ├── utils
│   ├── views
│   │
│   ├── App.vue
│   ├── components.js
│   ├── element.js
│   ├── main.js
│   ├── permission.js
├── babel.config.js
├── debug.log
├── package-lock.json
├── package.json
├── postcss.config.js
├── README.md
├── vue.config.js
└── yarn.lock
```
