import Request from "./luch-request/request";
import globalConfig from "@/config/index";
import dayjs from "dayjs";
import md5 from "blueimp-md5";
import $store from "@/store/index";

const http = new Request();

http.setConfig((config) => {
  config.baseUrl = globalConfig.BASE_API;
  config.header = {
    ...config.header,
    platform: globalConfig.PLATFORM,
    // appid: globalConfig.APPID,
    // time: dayjs(new Date()).unix() + "",
  };
  return config;
});

/**
 * 拦截器 - 请求之前
 */
http.interceptor.request((config) => {
  const isUploadRequest = Boolean(config.formData);

  // 根据是否是文件上传获取对应的 data 字段
  let dataKeyName = isUploadRequest ? "formData" : "data";
  const token = $store.state.account.userInfo.token || "";
  const data = {
    ...filterObjectNullVal(config[dataKeyName]),
    token,
    timestamp: dayjs(new Date()).format("YYYY-MM-DD HH:mm"),
    time: dayjs(new Date()).unix() + "",
  };

  // 生成签名
  let sign = generateSign({ ...data });

  config[dataKeyName] = {
    ...data,
    sign,
  };
  // const data = {
  //   ...filterObjectNullVal(config[dataKeyName]),
  // };

  // // 生成签名
  // config.header.sign = generateSign({
  //   ...data,
  //   ...filterObjectNullVal(config.params),
  // });
  // config.header.token = $store.state.account.token || "";
  // config[dataKeyName] = data;
  return config;
});

/**
 * 拦截器 - 请求之后
 */
http.interceptor.response(
  (response) => {
    // 服务端返回的状态码不等于200，则reject()
    if (response.statusCode !== 200) {
      return Promise.reject(response);
    }
    if (typeof response.data === "string") {
      response.data = JSON.parse(response.data);
    }
    // 如果接口错误码不为0，则进行错误处理
    const isInvalidResult = response.data.error_code !== 0;
    if (isInvalidResult) {
      apiErrorCodeHandling(response);
      return Promise.reject(response);
    }

    return response.data.result;
  },

  // HTTP 状态码 错误处理
  (httpStatusError) => {
    httpCodeHandling(httpStatusError);
    return httpStatusError;
  }
);

/**
 * 错误返回码 统一处理
 */
function apiErrorCodeHandling(errorObj) {
  // console.error('apiErrorCodeHandling: ', console.log(JSON.stringify(errorObj)))
  // 错误返回码
  let error_code = Number(errorObj.data.error_code);
  let message = errorObj.data.message || "";
  switch (error_code) {
    // 登录错误
    case 10001:
      // message = `${message}`
      break;
    // 系统繁忙
    case -1:
    case 10002: // 参数丢失
    case 10003: // 参数错误
    case 10004: // 权限错误fa
    case 10005: // 签名错误
    case 10006: // 参数非法
    case 10007: // 验证错误
    case 10008: // 数据错误
      message = `${message}【${error_code}】`;
      break;
    case 10011: // token超时
      message = `登录已失效，请重新登录`;
      $store.dispatch("account/handleTokenInvalid");
      break;
    case 99999:
      message = `${message}`;
      break;

    // token过期
    case 30004:
      // message = `ERROR_CODE:${error_code}::TOKEN_EXPIRE`
      message = `登录已失效，请重新登录`;
      $store.dispatch("account/handleTokenInvalid");
      break;

    default:
      message = `ERROR_CODE:${error_code}::UNKNOWN ERROR`;
      break;
  }
  uni.showToast({
    title: message,
    duration: 3000,
    mask: true,
    icon: "none",
  });
}

/**
 * HTTP 状态码 错误处理
 */
function httpCodeHandling(response) {
  console.error("httpCodeHandling: ", console.log(JSON.stringify(response)));
  if (!response || response.errMsg === "request:fail abort") {
    uni.showToast({
      title: `无法连接至服务器`,
      icon: "none",
      duration: 2000,
    });
    return false;
  }

  const code = response.statusCode;
  switch (code) {
    case 401:
      break;
    case 404:
      uni.showToast({
        title: "接口不存在",
        icon: "none",
        duration: 2000,
      });
      break;
    case 408:
      uni.showToast({
        title: "服务器繁忙,请稍后再试",
        icon: "none",
        duration: 2000,
      });
      break;
    case 500:
      uni.showToast({
        title: "服务器错误,请稍后再试",
        icon: "none",
        duration: 2000,
      });
      break;
    default:
      uni.showToast({
        title: `UNHANDLED_HTTP_CODE:${code}`,
        icon: "none",
        duration: 2000,
      });
      break;
  }
}

/**
 * 生成sign
 * @param {object} params get的query参数， post的query、body参数
 */
function generateSign(params) {
  // 签名的key
  const signKey = globalConfig.SIGN_KEY;
  let keyArrSort = Object.keys(params).sort();
  let sign = "";
  keyArrSort.map((key, index) => {
    const isEmptyVal = params[key] === "";
    if (!isEmptyVal) {
      sign += `${key}=${params[key]}&`;
    }
  });
  if (sign.trim().substr(-1) == "&") {
    sign = sign.substring(0, sign.length - 1);
  }
  sign = (sign + signKey).trim();
  return md5(sign);
}

/**
 * 筛选得到非null字段
 * @param {object} params 对象
 */
function filterObjectNullVal(params) {
  const result = {};
  for (const key in params) {
    if (Object.prototype.hasOwnProperty.call(params, key)) {
      const isNullVal = params[key] === null;
      if (!isNullVal) {
        result[key] = params[key];
      }
    }
  }
  return result;
}

export { http };
