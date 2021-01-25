import Vue from "vue";
import App from "./App";
import http from "@/api";
import store from "@/store";
import utils from "@/utils/utils";

Vue.config.productionTip = false;
Vue.prototype.$http = http;
Vue.prototype.$utils = utils;

const app = new Vue({
  ...App,
  store,
})
app.$mount();
