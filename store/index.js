import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

// 参数：1. 你要引入文件的目录 2.是否要查找该目录下的子级目录 3.匹配要引入的文件
const modulesFiles = require.context("./modules", true, /\.js$/);

// 不需要 import app from './modules/app'
// 它将自动 require 模块文件中的所有Vuex模块
const modules = modulesFiles.keys().reduce((modules, modulePath) => {
  // set './app.js' => 'app'
  const moduleName = modulePath.replace(/^\.\/(.*)\.\w+$/, "$1");
  const value = modulesFiles(modulePath);
  modules[moduleName] = value.default;
  return modules;
}, {});

export default new Vuex.Store({
  // 全局状态
  state: {},
  mutations: {},
  actions: {},
  modules,
});
