/*
 * @Description: 
 * @Author: wangzhen
 * @Date: 2021-02-19 16:03:55
 * @LastEditTime: 2022-02-17 16:57:12
 * @LastEditors: wangzhen
 */
import { createApp } from 'vue';
import App from './App.vue';
import ElementPlus from 'element-plus';
import 'element-plus/lib/theme-chalk/index.css';
import { createWebHashHistory, createRouter } from 'vue-router';

const history = createWebHashHistory();
const router = createRouter({
  history,
  routes: [{
    path: '/',
    component: () => import(/* webpackChunkName: "index" */ './views/index.vue')
  }, {
    path: '/sl',
    component: () => import(/* webpackChunkName: "sl" */ './views/sl.vue')
  }, {
    path: '/pvx',
    component: () => import(/* webpackChunkName: "pvx" */ './views/pvx.vue')
  }, {
    path: '/pve',
    component: () => import(/* webpackChunkName: "pve" */ './views/pve.vue')
  }, {
    path: '/qy',
    component: () => import(/* webpackChunkName: "qy" */ './views/qy.vue')
  }, {
    path: '/dl',
    component: () => import('./views/dl.vue')
  }]
});


const app = createApp(App);
app.use(ElementPlus).use(router).mount('#app');
