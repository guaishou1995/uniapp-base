import DEFINED from './defined';
import H5pay from '@/utils/ys/lib/h5pay';
import Browser from '@/utils/ys/lib/browser.js';
class Pay {
	static getWxPayType() {
		let type = "";
		// #ifdef APP-PLUS
		type = DEFINED.PAY_TYPE.WECAHTPAY_APP
		// #endif
		// #ifdef H5
		let browser = new Browser();
		if(browser.browser == "Wechat"){
			type = DEFINED.PAY_TYPE.WECAHTPAY_JS_PUBLIC
		}else{	
			type = DEFINED.PAY_TYPE.WECHATPAY_WAP
		}
		// #endif
		// #ifdef MP-WEIXIN
		type = DEFINED.PAY_TYPE.WECAHTPAY_JS_PROGRAM
		// #endif
		return type
	}
	static getAlipayType() {
		let type = "";
		// 支付宝
		// #ifdef APP-PLUS
		type = DEFINED.PAY_TYPE.ALIPAY_APP
		// #endif
		// #ifdef H5
		let browser = new Browser();
		if(browser.browser == "Alipay"){
			type = DEFINED.PAY_TYPE.ALIPAY_JS
		}else{	
			type = DEFINED.PAY_TYPE.ALIPAY_WAP
		}
		// #endif
		// #ifdef MP-ALIPAY
		type = DEFINED.PAY_TYPE.ALIPAY_JS
		// #endif
		return type;
	}
	/**
	 * 发起支付请求唤醒支付应用程序
	 * @param {Object} type
	 * @param {Object} options
	 */
	static requestPayment(type, options) {
    return new Promise( (reslove, reject) => {
      // #ifdef APP-PLUS || MP
      console.log(type)
      let requestPaymentOptions = {};
      requestPaymentOptions.provider = type;
      requestPaymentOptions.orderInfo = options.orderInfo ? options.orderInfo : {};
      switch (type) {
        case "alipay":
          break;
        case "wxpay":
          // #ifdef MP-WEIXIN
          requestPaymentOptions.timeStamp = options.orderInfo.timeStamp ? options.orderInfo.timeStamp : "";
          requestPaymentOptions.nonceStr = options.orderInfo.nonceStr ? options.orderInfo.nonceStr : ""
          requestPaymentOptions.package = options.orderInfo.package ? options.orderInfo.package : "";
          requestPaymentOptions.signType = options.orderInfo.signType || '';
          requestPaymentOptions.paySign = options.orderInfo.paySign ? options.orderInfo.paySign : "";
          // #endif
          break;
        default:
          break;
      }
      // 调用微信支付
      uni.requestPayment({
        ...requestPaymentOptions,
        success() {
          reslove(true);
        },fail() {
          reject(false);
        }
      });
      // #endif
      
      // #ifdef H5
      console.log(options,'h5');
      H5pay.wxjspay(options.orderInfo).then((res) => {
        reslove(res);
      }).catch((e) => {
        reject(e);
      });
      // #endif
    })
	}
}

export default Pay
