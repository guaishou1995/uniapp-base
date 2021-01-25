<template>
  <view
    class="cu-form-group img-wrap"
    :class="{ num1: maxLength === 1 || purelist.length === 1, hide: hide }"
    :style="'background: ' + bgColor"
  >
    <!-- <view class="grid col-4 grid-square flex-sub"> -->
    <view class="placeholder-hide"></view>
    <view
      v-for="(item, index) in purelist"
      :key="index"
      class="img-item"
      :data-url="purelist[index]"
    >
      <video
        class="video"
        :src="item"
        controls
        direction="0"
        @error="videoErrorCallback"
      >
        <cover-view
          v-if="write"
          class="cu-tag bg-red img-close"
          :data-index="index"
          @click.stop="DelImg"
        >
          X
        </cover-view>
      </video>
    </view>

    <view
      v-if="purelist.length < maxLength && write"
      class="img-item solids img-add"
      @tap="ChooseImage"
    >
      <text class="cuIcon-cameraadd"></text>
    </view>
  </view>
</template>

<script>
export default {
  name: "Gallery",
  components: {},
  props: {
    write: {
      type: Boolean,
      default: false,
    },
    maxLength: {
      type: Number,
      default: 0,
    },
    list: {
      type: Array,
      default: () => [],
    },
    bgColor: {
      type: String,
      default: "transparent",
    },
    hide: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {};
  },
  computed: {
    // 兼容图片数组格式
    purelist() {
      console.log(this.list);
      return this.list.map((e) => {
        if (e.uri) return e.uri;
        if (e.url) return e.url;
        return e;
      });
    },
  },
  watch: {},
  methods: {
    ChooseImage() {
      uni.chooseVideo({
        count: 1, // TODO: 属性存疑
        maxDuration: 60, // 拍摄视频最长拍摄时间，单位秒。最长支持 60 秒。
        sizeType: ["original", "compressed"],
        sourceType: ["camera", "album"], // "album", // 以后可能也允许从相册选
        success: (res) => {
          console.log("choose res ", res);
          // #ifdef APP-PLUS
          // 拍摄的照片保存到相册里
          // sourceType 若是包含了 album，想从相册选择 ， 那保存得区分清楚， 不然会出现选出来的文件不能正常使用的问题
          // uni.saveVideoToPhotosAlbum({
          //     filePath: path,
          // })
          // #endif
          this.$emit("add", res.tempFilePath);
        },
      });
    },
    ViewImage(e) {
      uni.previewImage({
        urls: this.list,
        current: e.currentTarget.dataset.url,
      });
    },
    DelImg(e) {
      // this.list.splice(e.currentTarget.dataset.index, 1);
      this.$emit("del", e.currentTarget.dataset.index);
    },
    videoErrorCallback(e) {
      console.log("err", e);
      if (!e.target.errMsg) return;
      uni.showModal({
        content: e.target.errMsg,
        showCancel: false,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.cu-bar .action:first-child {
  margin-left: 0;
}
.cu-form-group {
  padding: 0;
}
.img-wrap {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  padding-bottom: 10rpx;
  position: relative;

  &.hide {
    .placeholder-hide {
      display: block;
    }
    .img-item {
      display: none;
    }
  }

  &.num1 {
    .img-item {
      width: 100%;
      height: 360rpx;
    }
  }

  .placeholder-hide {
    height: 360rpx;
    display: none;
  }

  .img-item {
    width: 320rpx;
    height: 180rpx;
    margin-bottom: 10rpx;
    position: relative;

    + .img-item {
      margin-left: 16rpx;
    }

    &:nth-child(2n + 1) {
      margin-left: 0;
    }
    &.img-add {
      color: #8799a3;
      font-size: 26px;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .video {
      width: 100%;
      height: 100%;
    }
    .img-close {
      width: 80rpx;
      height: 56rpx;
      line-height: 56rpx;
      text-align: center;
      position: absolute;
      right: -20rpx;
      top: 0;
    }
  }
}
</style>
