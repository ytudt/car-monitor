import Vue from 'vue';
import Router from 'vue-router';


Vue.use(Router);

const router = new Router({
  routes: [
    {
      path: '/',
      name: 'Map',
      component: (r) => require.ensure([], () => r(require('src/pages/Map')), 'map'),
    },
    {
      path: '/login',
      name: 'Login',
      component: (r) => require.ensure([], () => r(require('src/pages/Login')), 'login'),
    },
  ],
});

router.beforeEach((to, from, next) => {
  next();
});

router.afterEach((to) => {
});


export default router;
