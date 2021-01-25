const commonConfig = {
  // 请求地址
  BASE_API: "",
  SHOP_API: "",
  // 请求签名
  SIGN_KEY: "yskey.key",
  PLATFORM: "test",
};

// 微信小程序配置
const wxConfig = {
  PLATFORM: "Wechatprogram",
  APPID: "xiaoshanwenlv_wx",
};

const h5Config = {
  PLATFORM: "H5",
  STATE: "wechat_login",
  APPID: "wxfa0e53da24ae1831",
  REDIRECT_URL: "",
};

export default {
  ...commonConfig,

  // #ifdef MP-WEIXIN
  // 微信小程序配置
  ...wxConfig,
  // #endif

  // #ifdef H5
  ...h5Config,
  // #endif
};
