// import { uniqueId } from "lodash";
const MAX_TIMEOUT = 10000;
// const TIMER_POOL = []; //
let UploadOwnLocation_TIMER = null;

const Location = {
  getLocation(type = "gcj02") {
    if (typeof type !== "string") {
      throw new Error("Location.getLocation:: params.type !== string");
    }
    return new Promise((resolve, reject) => {
      const timer = setTimeout(
        () => reject(`getLocation timeout ${MAX_TIMEOUT}ms`),
        MAX_TIMEOUT
      );

      uni.getLocation({
        type,
        success: function (res) {
          clearTimeout(timer);
          resolve(res);
        },
        fail: function (err) {
          clearTimeout(timer);
          reject(err);
        },
      });
    });
  },

  /**
   * @param {Object} params.type - 3：patrol；2：maintain
   * @param {String} params.morph_id - 计划ID
   * @param {String} params.lnglat - 当前所在位置 lng,lat
   * @param {String} params.project_id - 项目ID
   *
   * @returns Promise 当且仅当成功获取完定位、api提交成功才触发 resolve
   */
  _uploadOwnLocation(params) {
    return new Promise(() => {
      Location.getLocation().then((res) => {
        params.lnglat = `${res.longitude},${res.latitude}`;
        // apiSundry
        //     .uploadOwnLocation(params)
        //     .then(() => resolve())
        //     .catch(err => reject(err))
      });
    });
  },

  // 持续获取定位
  continueUploadOwnLocation(params) {
    this._uploadOwnLocation(params)
      .catch((err) => {
        console.error("持续上报定位错误", err);
      })
      .finally(() => {
        UploadOwnLocation_TIMER = setTimeout(
          () => this.continueUploadOwnLocation(params),
          8000
        );
      });
  },

  breakUploadOwnLocation() {
    if (UploadOwnLocation_TIMER) {
      clearTimeout(UploadOwnLocation_TIMER);
    }
  },
};

export default Location;
