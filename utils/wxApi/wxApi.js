import wx from "@/utils/wxApi/jweixin-1.6.0.js"
import api from "@/api/index.js";

class WxApi {
  constructor(arg = {}) {
    this.config = {
      debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
      appId: arg.appId, // 必填，公众号的唯一标识
      timestamp: arg.timestamp, // 必填，生成签名的时间戳
      nonceStr: arg.nonceStr, // 必填，生成签名的随机串
      signature: arg.signature,// 必填，签名
      jsApiList: arg.jsApiList, // 必填，需要使用的JS接口列表
    };
  }
  
  init(arg = {}) {
    this.config = Object.assign(this.config, arg);
    wx.config(this.config)
    return this;
  }
  
  ready() {
    const self = this;
    return new Promise( (reslove, rejcet) => {
      // config信息验证后会执行ready方法，所有接口调用都必须在config接口获得结果之后，config是一个客户端的异步操作
      wx.ready(async () => {
        try{
          let res = await self.checkApi();
          reslove(res);
        }catch(e){
          reject(e);
        }
      })
    })
  }
  
  checkApi() {
    const self = this;
    return new Promise((reslove) => {
      wx.checkJsApi({
        jsApiList: self.config.jsApiList,
        success(res) {
          console.log(res);
          reslove(JSON.parse(res.checkResult));
        }
      })
    })
  }
  
  scan() {
    return new Promise( (reslove, reject ) => {
      wx.scanQRCode({
        needResult: 1,
        scanType: ["qrCode","barCode"],
        success(res) {
          console.log(res);
          reslove(res)
        },
        fail(res) {
          reject(res)
        }
      })
    })
  }
  
  wxPay(data) {
    return new Promise( (reslove, reject) => {
      wx.chooseWXPay({
        ...data,
        success(res) {
          reslove(res);
        },
        fail(err) {
          reject(err);
        }
      })
    })
  }
  
  error() {
    wx.error(res => {
      console.log(res);
      // this.ajaxConfig();
    })
  }
  
  ajaxConfig(url) {
    const self = this;
    return new Promise(async (reslove) => {
      let res = await api.common.config({
        url
      })
      self.config = Object.assign(self.config, res.result);
      reslove(self)
    })
  }
}

export { WxApi };