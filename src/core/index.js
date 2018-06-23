import 'es6-promise/auto';
import 'normalize.css';
import 'core/styles/index.scss';
import Vue from 'vue';
import './config';
import * as directive from './directive';
import lodash from 'lodash';
import './util'


Object.defineProperty(Vue.prototype, '_', { value: lodash });


Object.keys(directive).forEach((name) => Vue.directive(name, directive[name]));
