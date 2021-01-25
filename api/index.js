import { http } from "@/utils/uni/http";
import apiConfig from "./apiConfig";
import config from "@/config";

const contactApi = apiConfig;
const modulesFuncGather = {};
contactApi.forEach(({ funcName, url, method }) => {
  /**
   * @{params} data 普通参数
   * @{params} options 局部参数，覆盖之前的设定
   * @{params} files 触发文件上传
   */
  modulesFuncGather[funcName] = function (
    data,
    { options = {}, files = [] } = {}
  ) {
    if (files.length === 0) {
      return http.request({
        method,
        url,
        data,
        ...options,
      });
    } else {
      return http.upload(url, {
        method,
        formData: data,

        // 非 app||h5 不支持多文件上传
        // #ifndef APP-PLUS || H5
        name: files[0].name,
        filePath: files[0].uri,
        // #endif

        // #ifdef APP-PLUS || H5
        files,
        // #endif
      });
    }
  };
});

export default modulesFuncGather;
