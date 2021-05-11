import $store from "@/store/index.js";

const MAX_TIMEOUT = 10000;
let UploadOwnLocation_TIMER = null;
class Utils {
  //计算2点间距离
  getDistance(lat1, lng1, lat2, lng2) {
    const rad = function (d) {
      return (d * Math.PI) / 180.0;
    };
    let radLat1 = rad(lat1);
    let radLat2 = rad(lat2);
    let a = radLat1 - radLat2;
    let b = rad(lng1) - rad(lng2);
    let s =
      2 *
      Math.asin(
        Math.sqrt(
          Math.pow(Math.sin(a / 2), 2) +
            Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)
        )
      );
    s = Math.round(s * 6378.137 * 1000);
    let distance = 0;
    if (s > 1000) {
      distance = s / 1000 + "km";
    } else {
      distance = s + "m";
    }
    return distance;
  }

  // 有没有token
  hasToken() {
    return new Promise((resolve, reject) => {
      const token = $store.getters["account/tokenInvalid"];
      if (token) {
        uni.showToast({
          title: "请先登录",
          icon: "none",
        });
        reject(token);
      } else {
        resolve(token);
      }
    });
  }

  // 需要token的跳转
  async jumpToken(url) {
    try{
      await this.hasToken();
      uni.navigateTo({
        url
      })
    }catch(e){
      uni.navigateTo({
        url: "/pages/account/login",
      });
    }
  }

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
  }

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
      });
    });
  }

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
  }

  breakUploadOwnLocation() {
    if (UploadOwnLocation_TIMER) {
      clearTimeout(UploadOwnLocation_TIMER);
    }
  }
}

export default new Utils();
