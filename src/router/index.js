import Vue from 'vue';
import Router from 'vue-router';
import Cookies from 'js-cookie';
import configRoutes from './configRoutes';
import {menuMap} from 'constant';
import store from '../store';
import api from 'api';

Vue.use(Router);

const router = new Router({
  routes: [
    {
      path: '/login',
      name: 'Login',
      component: (r) => require.ensure([], () => r(require('src/pages/Login')), 'login'),
    },
    {
      path: '/',
      name: 'Main',
      component: (r) => require.ensure([], () => r(require('src/pages/Main')), 'main'),
      meta:{
        KeepAlive: false,
        title: '首页',
      },
    },
    {
      path: '/config',
      name: 'Config',
      component: (r) => require.ensure([], () => r(require('src/pages/Config')), 'Config'),
      children: configRoutes,
      meta:{
        title: '配置台',
        authId: menuMap.config,
      },
    },
  ],
});

router.beforeEach((to, from, next) => {
  if(to.name !== 'Login'){
    api.core.getMenuList()
      .then(({data}) => {
        console.log(data);
      });
  }

  const token = Cookies.get('token');
  if(token && to.name === 'Login') {
    return next({
      name: 'Main',
    });
  }else if(!token && to.name !== 'Login') {
    return next({
      name: 'Login',
    });
  }else {
    next();
  }
});

router.afterEach((to) => {
});


export default router;
