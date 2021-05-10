import Vue from "vue";
import App from "./App";
import http from "@/api";
import store from "@/store";
import utils from "@/utils/utils";
import i18n from '@/common/langs/index';

Vue.prototype.$http = http;
Vue.prototype.$utils = utils;

const app = new Vue({
  ...App,
  store,
	i18n,
})
app.$mount();
