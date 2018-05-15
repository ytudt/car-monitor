import 'es6-promise/auto';
import 'normalize.css';
import Vue from 'vue';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import 'core/styles/index.scss';
import './config';
import lodash from 'lodash';

Object.defineProperty(Vue.prototype, '_', { value: lodash });

Vue.use(ElementUI);
