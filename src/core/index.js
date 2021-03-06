import 'es6-promise/auto';
import 'normalize.css';
import './styles/index.scss';
import Vue from 'vue';
import $ from 'jquery'
import './lib/BSJFlashVideo'
import './config';
import * as directive from './directive';
import lodash from 'lodash';
import './util'

window.$ = $;

Object.defineProperty(Vue.prototype, '_', { value: lodash });


Object.keys(directive).forEach((name) => Vue.directive(name, directive[name]));
