<template>
  <view>
    <view class="head">
      <view class="head__back">
        <view
          class="head__blur"
          :style="{ 'background-image': 'url(' + tabBar.img_path + ')' }"
        ></view>
      </view>
      <view class="head__cover">
        <navigator
          class="head__cover-main"
          :url="
            '/pages/scenic/detail?id=' + tabBar.id + '&travel=' + tabBar.title
          "
          :style="{ 'background-image': 'url(' + tabBar.img_path + ')' }"
        >
          <view class="text">
            <text class="text__title">{{ tabBar.title }}</text>
            <text class="text__content">{{ tabBar.introduction }}</text>
          </view>
        </navigator>
      </view>
    </view>
    <mescroll-body
      ref="mescrollRef"
      :up="upOption"
      :down="downOption"
      @init="mescrollInit"
      @down="downCallback"
      @up="upCallback"
    >
      <view class="lists">
        <waterfall ref="waterfall" :value="list">
          <template v-slot:left="{ leftList }">
            <view
              v-for="(item, index) in leftList"
              :key="index"
              class="lists__item"
              @tap="jump(item.id)"
            >
              <image
                :src="item.img_path ? item.img_path : '/static/images/wu.jpg'"
                class="img"
                :lazy-load="true"
                :style="{ height: item.height + 'rpx' }"
                mode="aspectFill"
              ></image>
              <view class="foot">
                <view class="foot__title">{{ item.title }}</view>
                <view class="foot__text">
                  <text class="lg cuIcon-locationfill foot__text-icon"></text>
                  距离您
                  <text class="foot__text-num">{{ item.distance }}</text>
                </view>
              </view>
            </view>
          </template>
          <template v-slot:right="{ rightList }">
            <view
              v-for="(item, index) in rightList"
              :key="index"
              class="lists__item"
              @tap="jump(item.id)"
            >
              <image
                :src="item.img_path ? item.img_path : '/static/images/wu.jpg'"
                class="img"
                :lazy-load="true"
                :style="{ height: item.height + 'rpx' }"
                mode="aspectFill"
              ></image>
              <view class="foot">
                <view class="foot__title">{{ item.title }}</view>
                <view class="foot__text">
                  <text class="lg cuIcon-locationfill foot__text-icon"></text>
                  距离您
                  <text class="foot__text-num">{{ item.distance }}</text>
                </view>
              </view>
            </view>
          </template>
        </waterfall>
      </view>
    </mescroll-body>
  </view>
</template>

<script>
import Waterfall from "@/components/waterfall/waterfall.vue";
import MescrollBody from "@/components/mescroll-uni/mescroll-body.vue";
import MescrollMixin from "@/components/mescroll-uni/mescroll-mixins.js";

export default {
  // 使用mixin (在main.js注册全局组件)
  components: {
    Waterfall,
    MescrollBody,
  },
  mixins: [MescrollMixin],
  data() {
    return {
      list: [],
      tabBar: {},
      locationLat: 0,
      locationLng: 0,
      downOption: {
        bgColor: "#fff",
        textColor: "#666",
      },
      upOption: {
        bgColor: "#f5f5f5",
        textColor: "#666",
      },
    };
  },
  onLoad() {
    this.$http.Travels_snicInfo().then((res) => {
      this.tabBar = res.map((val, key) => {
        val.isClick = key == 0 ? true : false;
        return val;
      })[0];
    });
  },
  //方法
  methods: {
    /*上拉加载的回调: 其中page.num:当前页 从1开始, page.size:每页数据条数,默认10 */
    upCallback(page) {
      //联网加载数据
      this.loadData(page);
    },
    async loadData(page) {
      try {
        if (!this.locationLat) {
          let res = await this.getLocation();
          this.locationLng = res.longitude;
          this.locationLat = res.latitude;
        }
        const params = {
          page_num: page.num,
          page_size: page.size,
          type: 3,
          scenic_id: 74,
          lat: this.locationLat,
          lng: this.locationLng,
        };
        if (page.num == 1) {
          this.clear();
          this.list = [];
        }
        this.$http.Travels_snicList(params).then((res) => {
          const curPageData = res.list.map((e) => {
            return {
              ...e,
            };
          });
          const curPageLen = curPageData.length;
          const totalPage = res.total;
          this.list.push(...curPageData);
          this.mescroll.endByPage(curPageLen, totalPage);
        });
      } catch (e) {
        console.log(e);
      }
    },
    getLocation() {
      return new Promise((resolve, reject) => {
        uni.getLocation({
          type: "wgs84",
          success: (res) => {
            resolve(res);
          },
          fail(e) {
            uni.showToast({
              title: "定位失败，请重新定位",
              position: "bottom",
              icon: "none",
            });
            reject(e);
          },
        });
      });
    },
    remove(id) {
      this.$refs.uWaterfall.remove(id);
    },
    clear() {
      this.$refs.waterfall.clear();
    },
    jump(id) {
      uni.navigateTo({
        url: "/pages/scenic/detail?id=" + id,
      });
    },
  },
};
</script>
<style lang="scss" scoped>
$border-top: 5px solid #f8f8f8;

.head {
  width: 750rpx;
  box-sizing: border-box;
  background: #fff;

  &__back {
    width: 750rpx;
    height: 410rpx;
    /* #ifdef APP-PLUS */
    height: 520rpx;
    /* #endif */
    position: relative;
    overflow: hidden;
  }

  &__blur {
    filter: blur(10rpx) brightness(85%);
    position: relative;
    top: 0;
    left: 0;
    width: 950rpx;
    height: 410rpx;
    /* #ifdef APP-PLUS */
    height: 500rpx;
    /* #endif */
    background-size: cover;
    background-position: center;
    margin-left: -100rpx;
    margin-top: -100rpx;
  }

  &__cover {
    width: 750rpx;
    z-index: 1;
    position: absolute;
    top: 0;
    left: 0;
    box-sizing: border-box;
    display: flex;
    flex-flow: column;
  }
  &__cover-main {
    width: 674rpx;
    height: 310rpx;
    background-size: cover;
    background-position: center;
    margin: 0 38rpx;
    // box-shadow:0 -5rpx 40rpx rgba(0, 0, 0, 0.5);
    border-radius: 10rpx;
    box-sizing: border-box;
    overflow: hidden;
    justify-content: flex-end;
    display: flex;
    flex-flow: column;
    margin-top: 90rpx;
    /* #ifdef APP-PLUS */
    margin-top: calc(120rpx + var(--status-bar-height));
    /* #endif */

    .text {
      display: flex;
      flex-flow: column;
      justify-content: flex-end;
      padding: 20rpx;
      box-sizing: border-box;
      width: 100%;
      height: 150rpx;
      background: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.5) 90rpx);
    }

    .text__title {
      color: #fff;
      font-size: 30rpx;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .text__content {
      color: #fff;
      line-height: 40rpx;
      font-size: 28rpx;
      @include lineAmount(1);
    }
  }
}
.lists {
  margin-top: 20rpx;
  padding: 0 38rpx;
  box-sizing: border-box;
  background: linear-gradient(180deg, #fff 10%, #f5f5f5 90%);
  // width: 750rpx;
  &__item {
    margin-bottom: 30rpx;
    background: #fff;
    position: relative;
    border-radius: 10rpx;
    overflow: hidden;
    box-shadow: 0 0rpx 10rpx rgba(215, 215, 215, 0.3);

    .img {
      width: 100%;
    }
    .foot {
      display: flex;
      align-items: center;
      flex-flow: column;
      padding: 10rpx;
      box-sizing: border-box;
    }
    .foot__title {
      width: 100%;
      font-size: 30rpx;
      color: #333;
      height: 40rpx;
      line-height: 40rpx;
      @include lineAmount(1);
      padding: 0 6rpx;
      box-sizing: border-box;
      padding-bottom: 6rpx;
    }
    .foot__text {
      width: 100%;
      line-height: 40rpx;
      color: #888;
      font-size: 21rpx;
      display: flex;
      align-items: center;
    }
    .foot__text-icon {
      font-size: 23rpx;
      margin-right: 4rpx;
    }
    .foot__text-num {
      color: #ff6f28;
      font-size: 21rpx;
      line-height: 36rpx;
      margin-left: 6rpx;
    }
  }
}
</style>
