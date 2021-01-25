import globalConfig from "@/config/index";
import $http from "@/api";
import $store from "@/store";

/**
 * 登录/绑定
 * TODO{$1}：内部不处理具体操作，如导航跳转、弹窗等操作， 使用 Promise 返回结果给调用方处理
 *
 * @class Login
 */
class Login {
  constructor() {
    this.bindURL = "/pages/account/sign/sign-in";
  }

  /**
   * 统一的三方服务登录/绑定入口
   * @param {String} provider 服务类型
   */
  providerLogin(provider) {
    return new Promise((reslove, rejcet) => {
      uni.login({
        provider: provider,
        success: (res) => {
          let resData = '';
          switch (provider) {
            case "weixin":
              resData = this._loginWechat(res.code);
              break;
            case "alipay":
              resData = this._loginAlipay(res.authCode);
              break;
            default:
              console.warn("未知的服务:", provider);
              break;
          }
          reslove(resData);
        },
        fail: (err) => {
          const msgCode = {
            [-2]: "取消了授权",
          };
          const msg = msgCode[err.code] || "授权失败";
          uni.showToast({
            title: msg,
            icon: "none",
          });
          rejcet(err);
        },
      });
    })
  }
  
  wechatLogin() {
    let appid = globalConfig.APPID;
    let redirect_uri = encodeURIComponent(globalConfig.REDIRECT_URL);
    window.location.href = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appid}&redirect_uri=${redirect_uri}&response_type=code&scope=snsapi_userinfo&state=wechat_login#wechat_redirect`
  }

  /**
   * 获得用户设置
   */
  getSettingPro() {
    return new Promise((reslove, reject) => {
      uni.getSetting({
        success(res) {
          reslove(res);
        },
        fail(error) {
          reject(error);
        },
      });
    });
  }

  /**
   * 向用户发起授权 (支付宝小程序不需要)
   * @param {String} scope
   */
  getAuthorizePro(scope) {
    return new Promise((reslove, reject) => {
      uni.authorize({
        scope: scope,
        success(res) {
          reslove(res);
        },
        fail(error) {
          uni.openSetting({
            success(e) {
              console.log(e);
            },
            fail(e) {
              console.log(e);
            },
          });
          reject(error);
        },
      });
    });
  }

  /**
   * 获取用户信息
   */
  async getUserInfoPro() {
    // #ifdef MP-WEIXIN
    // 可以通过 uni.getSetting 先查询一下用户是否授权了
    let setRes = await this.getSettingPro();
    if (!setRes.authSetting["scope.userInfo"]) {
      await this.getAuthorizePro("scope.userInfo");
    }
    // #endif
    return new Promise((reslove, reject) => {
      uni.getUserInfo({
        success(infoRes) {
          reslove(infoRes);
        },
        fail(error) {
          reject(error);
        },
      });
    });
  }

  /**
   * 微信小程序登录
   * 微信小程序授权一定要先 uni.login 拿 code， 再通过 uni.getUserInfo 拿 iv/encryptedData
   * >>> 因为 uni.login 会影响 iv/encryptedData ， 导致对应不上而解析失败
   * 拿到三个参数后传给后台
   * @param {string} code uni.login -> code
   */
  async _loginWechat(code) {
    let infoRes = await this.getUserInfoPro();
    const params = {
      type: "wechat_program",
      code: code,
      iv: infoRes.iv,
      encryptedData: infoRes.encryptedData,
    };
    return await this._login3rd(params);
  }

  /**
   * 支付宝小程序登录
   * @param {String} auth_code 第三方登录服务商
   * @memberof Login
   */
  async _loginAlipay(auth_code) {
    let infoRes = await this.getUserInfoPro();
    const info = JSON.parse(infoRes.response).response;
    const params = {
      type: "ali_program",
      auth_code: auth_code,
      nick_name: info.nickName,
      ...info,
    };
    return await this._login3rd(params);
  }

  /**
   * 【未登录】第三方登录
   *
   * @param {Object} params
   * @param {String} params.provider 第三方登录服务商
   * @return 绑定过手机会直接登录， 未注册过会前往绑定手机号
   * @memberof Login
   */
  async _login3rd(params) {
    uni.showLoading({
      title: "加载中...",
      mask: true,
    });
    try{
      let res = await $http.api_login3rd(params);
      const serverRes = res;
      if (serverRes.bind_code) {
        // 存下绑定信息
        $store.commit("account/setBindLocalAccountInfo", {
          provider: params.type,
          bind_code: serverRes.bind_code,
        });
        // 前往绑定手机号后再登录
        uni.redirectTo({
          url: this.bindURL,
        });
      } else {
        this.localSignin(serverRes);
      }
      uni.hideLoading();
      return 
    }catch(e) {
      console.log(e)
    }
  }

  /**
   * 刷新token
   */
  async _refreshToken() {
    let res = await $http.api_refresh_token();
    $store.commit("account/setToken", res.token);
  }

  /**
   * 【已登录】第三方平台绑定手机号
   *
   * @param {Object} params
   * @param {String} params.provider 第三方登录服务商
   * @memberof Login
   */
  async bindAccount(params) {
    try {
      let serverRes = await $http.api.api_bind_account(params);
      this.localSignin(serverRes);
      uni.showToast({
        title: "绑定成功",
        mask: true,
        success: () =>
          uni.navigateBack({
            delta: 1,
          }),
      });
    } catch (e) {
      uni.showToast({
        title: "绑定失败",
        icon: "none",
        mask: true,
        // 等 TODO{$1} 完成后可以移除。 用于防止页面状态显示不正确的情况
        success: () =>
          uni.navigateBack({
            delta: 1,
          }),
      });
    }
  }

  /**
   * 保存用户信息
   * @param {Object} userInfo
   */
  localSignin(userInfo) {
    $store.commit("account/signin", userInfo);
  }
}

export default new Login();
