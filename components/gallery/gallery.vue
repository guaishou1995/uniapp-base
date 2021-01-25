<template>
  <view class="cu-form-group" :style="'background: ' + bgColor">
    <!-- <view class="grid col-4 grid-square flex-sub"> -->
    <view class="img-wrap">
      <view
        v-for="(item, index) in pureImgList"
        :key="index"
        class="img-item"
        :data-url="pureImgList[index]"
        @tap="ViewImage"
      >
        <LazyImage :real-src="pureImgList[index]" />
        <view
          v-if="write"
          class="cu-tag bg-red img-close"
          :data-index="index"
          @tap.stop="DelImg"
        >
          <text class="cuIcon-close"></text>
        </view>
      </view>
      <view
        v-if="pureImgList.length < maxLength && write"
        class="img-item"
        @tap="ChooseImage"
      >
        <slot name="add">
          <view class="solids img-add">
            <text class="cuIcon-cameraadd"></text>
          </view>
        </slot>
      </view>
    </view>
  </view>
</template>

<script>
import LazyImage from "@/components/lazy-image/lazy-image.vue";
export default {
  name: "Gallery",
  components: {
    LazyImage,
  },
  props: {
    write: {
      type: Boolean,
      default: false,
    },
    maxLength: {
      type: Number,
      default: 0,
    },
    imgList: {
      type: Array,
      default: () => [],
    },
    bgColor: {
      type: String,
      default: "transparent",
    },
  },
  data() {
    return {};
  },
  computed: {
    // 兼容图片数组格式
    pureImgList() {
      return this.imgList.map((e) => {
        if (e.uri) return e.uri;
        if (e.url) return e.url;
        return e;
      });
    },
  },
  watch: {},
  methods: {
    ChooseImage() {
      const remain = this.maxLength - this.imgList.length;
      if (remain <= 0) return;
      uni.chooseImage({
        count: this.maxLength, //默认9
        sizeType: ["original", "compressed"],
        sourceType: ["camera", "album"], // , // 以后可能也允许从相册选
        success: (res) => {
          // #ifdef APP-PLUS
          // 拍摄的照片保存到相册里
          // sourceType 若是包含了 album，想从相册选择 ， 那保存得区分清楚， 不然会出现选出来的文件不能正常使用的问题
          uni.saveImageToPhotosAlbum({
            filePath: res.tempFilePaths[0],
          });
          // #endif
          const validNum =
            res.tempFiles.length > remain ? remain : res.tempFiles.length;
          const imgs = res.tempFiles.splice(0, validNum).map((file) => {
            return {
              uri: file.path,
            };
          });
          this.$emit("add", imgs);
        },
      });
    },
    ViewImage(e) {
      uni.previewImage({
        urls: this.pureImgList,
        current: e.currentTarget.dataset.url,
      });
    },
    DelImg(e) {
      this.$emit("del", e.currentTarget.dataset.index);
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

  .img-item {
    width: 160rpx;
    height: 160rpx;
    margin-bottom: 10rpx;
    position: relative;
    margin: 10rpx;

    .img-add {
      width: 100%;
      height: 100%;
      color: #8799a3;
      font-size: 26px;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .img-close {
      position: absolute;
      right: 0;
      top: 0;
    }
  }
}
</style>
