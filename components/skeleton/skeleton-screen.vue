<template>
	<view class="skeleton-box" :style="{'display': hidden ? 'none' :'block' }">
		<view class="skeleton-top"></view>
    <view class="skeleton-card">
      <view class="skeleton-card-item">
        <view class="skeleton-card-item-line"></view>
        <view class="skeleton-card-item-line"></view>
      </view>
      <view class="skeleton-card-item">
        <view class="skeleton-card-item-line"></view>
        <view class="skeleton-card-item-line"></view>
      </view>
    </view>
    <template v-if="type == 8">
    	<!-- 酒店列表 -->
    	<view class="skeleton-list">
    		<view class="list-item" v-for="(item,index) of 4" :key="index"></view>
    	</view>
    </template>
		<view class="main">
			<view class="main-title"></view>
			<view>
				<view class="main-text" v-for="(item,index) of 3" :key="index"></view>
			</view>
			<view class="main-text" style="margin-top: 60rpx;"></view>
			<view class="main-img"></view>
		</view>
	</view>
</template>

<script>
	export default {
		props:{
			hidden:{
				type:Boolean,
				default:false,
			},
			type:{
				type: Number,
				default: 7
			}
		},
		data() {
			return {
			}
		},
	}
</script>

<style lang="scss" scoped>
	@import './style/style.scss';
	
	.skeleton-box{
		width: 750rpx;
		height: 100%;
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		z-index: 11;
		background: #fff;
		overflow: hidden;
		
		.skeleton-top{
      @include skeleton-fade($backgroundFade);
			width: 750rpx;
			height: 460rpx;
		}
		.skeleton-title{
      @include skeleton-fade($backgroundFade);
			width: 420rpx;
			height: 68rpx;
			margin: 30rpx 40rpx;
		}
	}
  
  .skeleton-card {
    @include skeleton-fade($backgroundFade);
    height: 280rpx;
    width: 100%;
    display: flex;
    flex-flow: column;
    align-items: center;
    position: absolute;
    top: 300rpx;
    
    .skeleton-card-item {
      width: 700rpx;
      background: #fff;
      border-radius: 10rpx;
      overflow: hidden;
      margin-bottom: 20rpx;
      display: flex;
      flex-flow: column;
      align-items: center;
      padding: 20rpx 30rpx;
      box-sizing: border-box;
      
      .skeleton-card-item-line {
        @include skeleton-fade($backgroundFade);
        width: 100%;
        height: 33rpx;
        margin-bottom: 20rpx;
        
        &:last-child {
          margin-bottom: 0;
        }
      }
    }
  }

  .skeleton-list{
  	width: 750rpx;
  	display: flex;
  	flex-flow: column;
  	padding: 0 50rpx;
  	box-sizing: border-box;
    margin-top: 130rpx;
  	
  	.list-item{
  		width: 100%;
  		height: 180rpx;
  		border-bottom: 1px solid $backgroundSkeleton;
  		background-repeat: no-repeat;
  		background-image:
  			linear-gradient($item-img-skeleton), /* 图片 */
  			linear-gradient($item-title-skeleton), /* 标题 */
  			linear-gradient($item-title-skeleton),
  			linear-gradient($item-title-skeleton),
  			linear-gradient($item-price-skeleton),
  			linear-gradient(#fff 100%, transparent 0); /* 背景 */
  		background-size:
  			$item-img-width $item-img-height,  /* 头像 */
  			$item-title-width $item-title-height,  /* 标题 */
  			$item-title-width $item-title-height, 
  			$item-title-width $item-title-height, 
  			$item-title-width $item-price-height, 
  			100% 100%; /* 背景 */
  		background-position:
  			$item-img-position,  /* 图片 */
  			$item-title-position, /* 标题 */
  			210rpx 76rpx,
  			210rpx 130rpx,
  			460rpx 100rpx,
  			0 0;        /* 背景 */
  	}
  }

	.main{
		display: flex;
		width: 750rpx;
		padding: 30rpx 50rpx;
		box-sizing: border-box;
		flex-flow: column;
    margin-top: 100rpx;
		
		.main-title{
      @include skeleton-fade($backgroundFade);
			width: 450rpx;
			margin: 50rpx auto 0;
			padding: 20rpx 0;
		}
		.main-text{
      @include skeleton-fade($backgroundFade);
			width: 100%;
			height: 30rpx;
			margin-top: 20rpx;
			
			&:last-child{
				width: 70%;
			}
		}
		.main-img{
      @include skeleton-fade($backgroundFade);
			width: 100%;
			height: 300rpx;
			margin-top: 20rpx;
		}
	}
</style>
