/* eslint-disable import/no-extraneous-dependencies */
import Vue from 'vue';
import VueRouter from 'vue-router';
import VueQuillEditor from 'vue-quill-editor';
import 'quill/dist/quill.core.css'; // import styles
import 'quill/dist/quill.snow.css'; // for snow theme
import 'quill/dist/quill.bubble.css'; // for bubble theme
import Login from '../components/Login.vue';
import Home from '../components/Home.vue';
import Welcome from '../components/Welcome.vue';
import Users from '../components/user/Users.vue';
import Rights from '../components/power/Rights.vue';
import Roles from '../components/power/Roles.vue';
import Cate from '../components/goods/Cate.vue';
import Params from '../components/goods/Params.vue';
import List from '../components/goods/List.vue';
import Add from '../components/goods/Add.vue';
import Order from '../components/order/order.vue';
import Report from '../components/report/Report.vue';

Vue.use(VueRouter);
Vue.use(VueQuillEditor /* { default global options } */);
const routes = [
  {
    path: '/',
    redirect: '/login',
  },
  {
    path: '/login',
    component: Login,
  },
  {
    path: '/home',
    component: Home,
    redirect: '/welcome',
    children: [
      {
        path: '/welcome',
        component: Welcome,
      },
      {
        path: '/users',
        component: Users,
      },
      {
        path: '/rights',
        component: Rights,
      },
      {
        path: '/roles',
        component: Roles,
      },
      {
        path: '/categories',
        component: Cate,
      },
      {
        path: '/params',
        component: Params,
      },
      {
        path: '/goods',
        component: List,
      },
      {
        path: '/goods/add',
        component: Add,
      },
      {
        path: '/orders',
        component: Order,
      },
      {
        path: '/reports',
        component: Report,
      },
    ],
  },
];

const router = new VueRouter({
  routes,
  mode: 'history',
});

router.beforeEach((to, from, next) => {
  // to 将要访问的路径
  // from 从哪个路径跳转
  // next 表示放行 next('/login') 强制跳转
  if (to.path === '/login') return next();
  const tokenStr = window.sessionStorage.getItem('token');
  if (!tokenStr) {
    return next('/login');
  }
  next();
  return true;
});

export default router;
