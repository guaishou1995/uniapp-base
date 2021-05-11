import Vue from "vue";
import App from "./App";
import http from "@/api";
import store from "@/store";
import utils from "@/utils/utils";
import i18n from '@/common/langs/index';
import uView from 'uview-ui';

Vue.prototype.$http = http;
Vue.prototype.$utils = utils;

Vue.use(uView);

const app = new Vue({
  ...App,
  store,
	i18n,
})
app.$mount();
