import {menuMap} from 'constant';
const configRoutes = [
  {
    path: 'user',
    name: 'userConfig',
    component: (r) => require.ensure([], () => r(require('src/pages/userConfig')), 'userConfig'),
    meta: {
      title: '用户配置',
      authId: menuMap.config,
    },
  },
  {
    path: 'role',
    name: 'roleConfig',
    component: (r) => require.ensure([], () => r(require('src/pages/roleConfig')), 'roleConfig'),
    meta: {
      title: '角色配置',
      authId: menuMap.config,
    },
  },
  {
    path: 'auth',
    name: 'authConfig',
    component: (r) => require.ensure([], () => r(require('src/pages/authConfig')), 'authConfig'),
    meta: {
      title: '权限配置',
      authId: menuMap.config,
    },
  },
  {
    path: 'car',
    name: 'carConfig',
    component: (r) => require.ensure([], () => r(require('src/pages/CarConfig')), 'carConfig'),
    meta: {
      title: '车辆配置',
      authId: menuMap.config,
    },
  },
  // {
  //   path: 'order',
  //   name: 'orderConfig',
  //   component: (r) => require.ensure([], () => r(require('src/pages/orderConfig')), 'orderConfig'),
  //   meta: {
  //     title: '订单管理',
  //   },
  // },
];

export default configRoutes;
