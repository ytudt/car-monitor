import 'es6-promise/auto';
import 'normalize.css';
import 'core/styles/index.scss';
import Vue from 'vue';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import 'core/styles/index.scss';
import './config';
import * as directive from './directive';
import lodash from 'lodash';

Object.defineProperty(Vue.prototype, '_', { value: lodash });

Vue.use(ElementUI);
Object.keys(directive).forEach((name) => Vue.directive(name, directive[name]));
