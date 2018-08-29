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

router.beforeEach((to, from, next) => {
  let authId = to.meta.authId;
  console.log(to.name);
  if(to.name === 'Login') return next();
  if(store.state.menuList){
    if(authId && store.state.menuList.indexOf(authId) === -1) return next({name: 'Main'});
    next();
  }else{
    api.core.getMenuList()
      .then(({data}) => {
        store.dispatch('updateMenulist', data.data || [])
        if(authId && store.state.menuList.indexOf(authId) === -1) return next({name: 'Main'});
        next();
      });
  }
});

export default router;
