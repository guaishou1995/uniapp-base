import $store from "@/store/index.js";

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
}

export default new Utils();
