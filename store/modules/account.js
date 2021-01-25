const defaultAvatarSrc = "/static/images/wu.jpg";

// todo: tokenStartTime
// todo: 登录的电话号码
// todo 整合token管理
export default {
  namespaced: true,

  state: {
    userInfo: {
      avatar: defaultAvatarSrc,
    },

    bindLocalAccountInfo: {
      provider: null,
      bind_code: null,
    },
  },

  getters: {
    genderText(state) {
      return state.userInfo.gender == 1
        ? "男"
        : state.userInfo.gender == 2
        ? "女"
        : "未知";
    },
    authenticatedRealName(state) {
      return state.userInfo.face_auth === 1;
    },

    tokenInvalid: (state) => {
      return !state.userInfo.token;
    },
    // currentTimestamp 获取两次或有时间差问题， 精度要求不高，暂不考虑
    // token过期
    tokenExpired: (state) => {
      return () => {
        const currentTimestamp = Date.parse(new Date()) / 1000;
        // const exipreTimestamp = state.token_expire - 8640000; // 测试过期可用
        const exipreTimestamp = state.userInfo.token_expire;

        return currentTimestamp >= exipreTimestamp;
      };
    },

    // token 刷新两种方案
    // [x] 记录 最后一次token时间 + （时间间隔） > 当前时间 // 要多一个缓存 最后一次token时间
    // [ ] 过期时间 - （时间间隔） < 当前时间  // 该方案token过期几率较大， 刚好几天没开就过期了
    // token 刷新最小间隔： 86400
    // 24小时内只刷新一次token
    tokenInDueTime: (state) => {
      return () => {
        const interval = 86400;
        // const interval = 1;
        const currentTimestamp = Date.parse(new Date()) / 1000;
        const tokenStartTime = state.userInfo.tokenStartTime;

        return tokenStartTime + interval >= currentTimestamp;
      };
    },
  },

  mutations: {
    setBindLocalAccountInfo(state, obj) {
      state.bindLocalAccountInfo = {
        ...state.bindLocalAccountInfo,
        ...obj,
      };
    },

    signin(state, data) {
      data.avatar = data.avatar === "" ? defaultAvatarSrc : data.avatar;
      state.userInfo = data;
      console.log("=== userInfo ===", state.userInfo);
      uni.setStorageSync("accountUserInfo", state.userInfo);

      state.tokenStartTime = Date.parse(new Date()) / 1000;
      uni.setStorageSync("tokenStartTime", state.tokenStartTime);
    },

    signout(state) {
      state.userInfo = {
        avatar: defaultAvatarSrc,
      };
      uni.removeStorageSync("accountUserInfo");
    },
  },

  actions: {
    detectLoginStatus({ commit }) {
      const userInfo = uni.getStorageSync("accountUserInfo");
      if (userInfo) {
        commit("signin", userInfo);
      } else {
        // 不需要强制登录
        // dispatch("handleTokenInvalid");
      }
    },

    handleFaceAuthInvalid() {
      uni.navigateTo({
        url: "/pages/account/login",
      });
    },

    // 适用于服务端token失效时转到登录页
    handleTokenInvalid({ commit }) {
      commit("signout");
      uni.navigateTo({
        url: "/pages/account/login",
      });
    },
  },
};
