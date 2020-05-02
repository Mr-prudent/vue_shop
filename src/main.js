import ZkTable from 'vue-table-with-tree-grid';
import moment from 'moment';
import Vue from 'vue';
import axios from 'axios';
import App from './App.vue';
import router from './router';
import './plugins/element.js';
import './assets/css/global.css';
import './assets/fonts/iconfont.css';


Vue.config.productionTip = false;
axios.defaults.baseURL = 'http://www.hcs.plus:8888/api/private/v1/';
axios.interceptors.request.use((config) => {
  config.headers.Authorization = window.sessionStorage.getItem('token');
  return config;
});
Vue.prototype.$http = axios;
Vue.component('tree-table', ZkTable);
Vue.filter('dataFormat', (originval) => moment(originval).format('YYYY-M-D h:mm:ss'));
new Vue({
  router,
  render: (h) => h(App),
}).$mount('#app');
