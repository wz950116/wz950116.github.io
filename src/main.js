/*
 * @Description: 
 * @Author: wangzhen
 * @Date: 2021-02-19 16:03:55
 * @LastEditTime: 2022-03-02 11:37:04
 * @LastEditors: wangzhen
 */
import { createApp } from 'vue';
import App from './App.vue';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css'
import { createWebHashHistory, createRouter } from 'vue-router';

const history = createWebHashHistory();
const router = createRouter({
  history,
  routes: [{
    path: '/layout',
    component: () => import(/* webpackChunkName: "layout" */ './views/layout.vue'),
    children: [{
      path: '',
      component: () => import(/* webpackChunkName: "index" */ './views/index.vue')
    }]
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
    path: '/printscreen',
    component: () => import(/* webpackChunkName: "dl" */ './views/printscreen.vue')
  }, {
    path: '/dl',
    component: () => import(/* webpackChunkName: "dl" */ './views/dl.vue')
  }, {
    path: '/qy',
    component: () => import(/* webpackChunkName: "qy" */ './views/qy.vue')
  }, {
    path: '/qs',
    component: () => import(/* webpackChunkName: "qy" */ './views/qs.vue')
  }, {
    path: '/xj',
    component: () => import(/* webpackChunkName: "code" */ './views/xj.vue')
  }, {
    path: '/code',
    component: () => import(/* webpackChunkName: "code" */ './views/code/utils.vue')
  }]
});


const app = createApp(App);
app.use(ElementPlus).use(router).mount('#app');
