import Vue from 'vue';
import axios from 'axios';
import App from './App.vue';
import router from './router';
import './plugins/element.js';
import './assets/css/global.css';


Vue.config.productionTip = false;
Vue.prototype.$http = axios;
axios.defaults.baseURL = 'http://www.hcs.plus:8888/api/private/v1/';
new Vue({
  router,
  render: (h) => h(App),
}).$mount('#app');
