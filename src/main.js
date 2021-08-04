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
    component: () => import('./views/index.vue')
  }, {
    path: '/sl',
    component: () => import('./views/sl.vue')
  }, {
    path: '/pvx',
    component: () => import('./views/pvx.vue')
  }, {
    path: '/pve',
    component: () => import('./views/pve.vue')
  }, {
    path: '/qy',
    component: () => import('./views/qy.vue')
  }, {
    path: '/dl',
    component: () => import('./views/dl.vue')
  }]
});


const app = createApp(App);
app.use(ElementPlus).use(router).mount('#app');
