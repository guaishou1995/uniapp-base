/**
 * 
 * 微信js支付官方代码示例
 * function onBridgeReady(){
	   WeixinJSBridge.invoke(
		  'getBrandWCPayRequest', {
			 "appId":"wx2421b1c4370ec43b",     //公众号名称，由商户传入     
			 "timeStamp":"1395712654",         //时间戳，自1970年以来的秒数     
			 "nonceStr":"e61463f8efa94090b1f366cccfbbb444", //随机串     
			 "package":"prepay_id=u802345jgfjsdfgsdg888",     
			 "signType":"MD5",         //微信签名方式：     
			 "paySign":"70EA570631E4BB79628FBCA90534C63FF7FADD89" //微信签名 
		  },
		  function(res){
		  if(res.err_msg == "get_brand_wcpay_request:ok" ){
		  // 使用以上方式判断前端返回,微信团队郑重提示：
				//res.err_msg将在用户支付成功后返回ok，但并不保证它绝对可靠。
		  } 
	   }); 
	}
	if (typeof WeixinJSBridge == "undefined"){
	   if( document.addEventListener ){
		   document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false);
	   }else if (document.attachEvent){
		   document.attachEvent('WeixinJSBridgeReady', onBridgeReady); 
		   document.attachEvent('onWeixinJSBridgeReady', onBridgeReady);
	   }
	}else{
	   onBridgeReady();
	}
 */
export default class H5pay{
  static wxjspay(options = {
       "appId":"",     //公众号名称，由商户传入     
       "timeStamp":"",         //时间戳，自1970年以来的秒数     
       "nonceStr":"", //随机串     
       "package":"",     
       "signType":"MD5",         //微信签名方式：     
       "paySign":"" //微信签名 
    }) {
    return new Promise((resolve, reject) => {
      if(typeof WeixinJSBridge == "undefined") {
        reject({
          err_code: -1,
          err_desc: "只允许微信里使用",
          err_msg: "WeixinJSBridge:undefined"
        })
      }else {
        console.log(options,'pay')
        console.log(options.appId)
        WeixinJSBridge.invoke( 'getBrandWCPayRequest', { ...options }, (res) => {
        			if (res.err_msg == "get_brand_wcpay_request:ok") {
        				resolve(res);
        			} else if (res.err_msg == "get_brand_wcpay_request:cancel") {
        				resolve(res);
        			} else {
        				//alert(res.err_code + res.err_desc + res.err_msg);
        				reject(res);
        			}
        		}
        )
      }
    })
  }
	static alijspay(options = {
		data: {
			tradeNO:""
		},
		success:  function(res){}, //支付成功回调
		error: function(res){}, //支付失败回调
		cancel: function(res){} //支付取消回调
	}){
		if (typeof AlipayJSBridge == "undefined"){
			let res = {
				err_code:-1,
				err_desc:"只允许支付宝里使用",
				err_msg:"AlipayJSBridge:undefined"
			}
			error(res);
		}else{
			let {data , success , error , cancel} = options;
			AlipayJSBridge.call("tradePay",data, function(result) {
				if(result.resultCode == '9000' || result.resultCode == '8000' || result.resultCode == '6004'){
					success(result);
				}else if(result.resultCode == '6001'){
					cancel(result);
				}else{
					error(result);
				}
			})
		}
	}
	/**
	 * 支付宝支付H5页面支付的话，后台向支付提交订单之后，后台会返回一个跳转到阿里的支付h5页面的地址，并自动唤醒支付宝APP进行支付
	 * @param {String} url https://openapi.alipay.com/gateway.do?alipay_sdk=lokielse%2Fomnipay-alipay&app_id=2018022402261552&biz_content=%7B%22subject%22%3A%22%5Cu652f%5Cu4ed8%5Cu6d4b%5Cu8bd5%22%2C%22out_trade_no%22%3A%22C19052408592061611%22%2C%22total_amount%22%3A%2212.00%22%2C%22product_code%22%3A%22QUICK_MSECURITY_PAY%22%7D&charset=UTF-8&format=JSON&method=alipay.trade.wap.pay&sign_type=RSA2&timestamp=2019-05-24+09%3A54%3A09&version=1.0&sign=OvnGVasCdWTt3HKlX4E%2FpCdCsNqT1xtQs36jihm8Wg0dyXMmlZHvCc6Qm5NvTpuwa2OJ5xWJBQnSqBovVcj%2BZ4Z4vXfbCfF2Sg0X2fTDQigZ9j24BqqxaLOx5tuOZ94OAYFhyqAm6IxtF4CgoJJhVGO3hLsQTCscLJWbm2qSeZPpZXasivV3uL%2Brx%2FZJFfdDsqCBITFXG6iyOR4ifeK5Lrg1wrOWQ4mgAH3baq33M%2Beg6Wu4RJSykWyTjfWCdAoOSqYZvs1y3lzYJtGW2jzkxWIOQwx0gdRJcGRC6vaCznkz1Xzc45RdQO5KdwAFWUJcXJpDS%2FFyXwJ4LXJTln895g%3D%3D
	 */
	static aliwappay(url){
		// #ifdef APP-PLUS
		plus.runtime.openURL(url)
		// #endif
		
		// #ifdef H5
		window.location.href = url
		// #endif
	}
}