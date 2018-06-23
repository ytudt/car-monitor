import Vue from 'vue';
import Router from 'vue-router';
import Cookies from 'js-cookie';


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
        KeepAlive: true,
      },
    },
    {
      path: '/config',
      name: 'Config',
      component: (r) => require.ensure([], () => r(require('src/pages/Config')), 'Config'),
      children: [
        {
          path: 'user',
          name: 'userConfig',
          component: (r) => require.ensure([], () => r(require('src/pages/userConfig')), 'userConfig'),
        },
        {
          path: 'role',
          name: 'roleConfig',
          component: (r) => require.ensure([], () => r(require('src/pages/roleConfig')), 'roleConfig'),
          meta: {
            title: '在线申请',
          },
        },
      ],
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
  // next();
});

router.afterEach((to) => {
});


export default router;
