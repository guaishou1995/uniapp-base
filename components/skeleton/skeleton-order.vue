<template>
  <view class="skeleton" v-if="show">
    <view class="skeleton-fill width-750"></view>
    <view class="skeleton-background">
      <view class="skeleton-fill width-100"></view>
      <view class="flex">
        <view class="skeleton-fill width-img"></view>
        <view class="skeleton-fill width-300"></view>
      </view>
      <view class="skeleton-fill width-600"></view>
      <view class="skeleton-fill width-600"></view>
    </view>
    <view class="skeleton-background">
      <view class="skeleton-fill width-100"></view>
      <view class="skeleton-fill width-600"></view>
      <view class="skeleton-fill width-600"></view>
    </view>
  </view>
</template>

<script>
  export default {
  	props:{
  		show:{
  			type: Boolean,
  			default: true,
  		},
  	},
  	data() {
  		return {
  		}
  	},
  }
</script>

<style lang="scss" scoped>
  @import "./style/style.scss";
  
  .skeleton {
    width: 750rpx;
    height: 100%;
    position: fixed;
    left: 0;
    top: 0;
    background: #f8f8f8;
    box-sizing: border-box;
    padding: 0 20rpx;
    z-index: 3;
    box-sizing: border-box;
  }
  
  .skeleton-fill {
    border-radius: 10rpx;
    margin: 30rpx 0;
    @include skeleton-fade($backgroundFade);
  }
  
  .skeleton-background {
    background: #fff;
    padding: 30rpx;
    margin: 30rpx 0;
  }
  
  .width-750 {
    width: 750rpx;
    height: 140rpx;
  }
  
  .width-300 {
    width: 300rpx;
    height: 50rpx;
  }
  
  .width-600 {
    width: 600rpx;
    height: 50rpx;
  }
  
  .width-100 {
    width: 100rpx;
    height: 50rpx;
  }
  
  .width-img {
    width: 130rpx;
    height: 130rpx;
    margin-right: 20rpx;
  }
</style>
