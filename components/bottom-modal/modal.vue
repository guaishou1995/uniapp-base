<template>
  <view>
    <view v-if="show" class="background" @tap="close()"></view>
    <view class="modal-box" :style="{ height: show ? modalHeight : '0' }">
      <view :style="{ height: height ? height : 'auto'}">
        <view class="title">
          <text class="title-name">{{ title }}</text>
          <view class="close" @tap="close()">
            <text class="cuIcon-close"></text>
          </view>
        </view>
        <slot name="main">
          <view style="height: 100%;">
            <uParse class="content" :html="content"></uParse>
          </view>
        </slot>
      </view>
    </view>
  </view>
</template>

<script>
import uParse from "@/components/u-parse/u-parse.vue";
export default {
  components: {
    uParse,
  },
  computed: {
    modalHeight() {
      return this.height != '' ? this.height : uni.getSystemInfoSync().windowHeight * 0.8 + "px";
    }
  },
  props: {
    content: {
      type: String,
      default: "",
    },
    height: {
      type: String,
      default: ''
    },
    show: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: "",
    },
  },
  methods: {
    close(param) {
      this.$emit("close", param);
    },
  },
};
</script>

<style lang="scss" scoped>
@mixin iconRight(
  $right: 0,
  $top: 10rpx,
  $bottom: 10rpx,
  $color: #333,
  $length: 30rpx
) {
  &:before {
    content: "";
    display: block;
    width: $length;
    height: 2px;
    background: #888;
    position: absolute;
    right: $right;
    border-radius: 10px;
    transform: rotate(45deg);
    top: $top;
  }
  &:after {
    content: "";
    display: block;
    width: $length;
    height: 2px;
    background: #888;
    position: absolute;
    right: $right;
    border-radius: 10px;
    transform: rotate(-45deg);
    bottom: $bottom;
  }
}

.background {
  position: fixed;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  background: rgba(0, 0, 0, 0.6);
  z-index: 9;
}

.modal-box {
  width: 750rpx;
  height: 0;
  background: #fff;
  position: absolute;
  bottom: 0;
  left: 0;
  border-top-left-radius: 20rpx;
  border-top-right-radius: 20rpx;
  overflow: hidden;
  transition: height 0.2s;
  z-index: 10;

  .title {
    height: 100rpx;
    width: 750rpx;
    background: #f5f5f9;
    padding: 0 30rpx;
    display: flex;
    align-items: center;
    justify-content: space-between;
    box-sizing: border-box;

    .icon-left {
      width: 60rpx;
      height: 60rpx;
      position: relative;
      @include iconRight(40rpx, 34rpx, 36rpx, #333, 20rpx);
    }
    .title-name {
      color: #333;
      font-size: 32rpx;
      color: #333;
    }
    .close {
      width: 40rpx;
      height: 40rpx;
      border-radius: 50%;
      background: #fff;
      position: relative;
      box-sizing: border-box;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }

  .content {
    padding: 30rpx 20rpx;
    box-sizing: border-box;
  }
}
.bg-active {
  height: calc(100% - 200rpx);
}
</style>
