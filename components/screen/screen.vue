<template>
  <view class="screen">
    <view class="screen-top">
    	<view 
        data-index="0" 
        v-for="(item, index) in select"
        :key="index"
        @tap="screen(item, index)"
        :class="['top-item', tabIndex == index ? 'text-bold text-theme' : '']">
    		<view class="screen-top-name">{{ item.name }}</view>
        <!-- 排序 -->
        <view 
          v-if="item.type === 'sort'" 
          class="margin-left-xs flex flex-direction"
         >
          <text :class="['lg', 'cuIcon-triangleupfill', item.sort == 'asc' ? 'text-theme' : 'text-black']" style="position: relative;top: 10rpx;"></text>
          <text :class="['lg', 'cuIcon-triangledownfill', item.sort == 'desc' ? 'text-theme' : 'text-black']" style="position: relative;top: -8rpx;"></text>
        </view>
        <!-- 子选项 -->
    		<view 
          v-if="item.selectH" 
          :class="['lg', maskShow ? 'cuIcon-fold' : 'cuIcon-unfold', tabIndex == index ? 'text-theme' : '']">
        </view>
      </view>
      <!-- 下拉列表 -->
      <view 
        class="dropdownlist" 
        :class="[maskShow ? 'dropdownlist-show' : '']"
        @touchmove.stop.prevent="preventTouch">
        <view class="list">
          <view
            :class="['dropdownlist-item', val.selected ? 'text-bold text-theme' : '']"
            v-for="(val, key) in selectChild"
            :key="key"
            @tap.stop="dropdownItem(val)"
            :data-index="key">
            <text class="tui-ml tui-middle">{{ val.name }}</text>
            <view class="lg cuIcon-check text-theme" v-if="val.selected"></view>
          </view>
        </view>
      </view>
      <view class="dropdownlist-mask" :class="[maskShow ? 'mask-show' : '']" @tap.stop="hideDropdownList"></view>
    </view>
  </view>
</template>

<script>
  export default {
    props: {
      select: {
        type: Array,
        default: () => []
      },
    },
    data() {
      return {
        tabIndex: 0,
        maskShow: 0,
        selectChild: [],
        selectChildCurrent: 0
      }
    },
    methods: {
      hideDropdownList() {
        this.maskShow = 0;
      },
      screen(item, index) {
        if(this.tabIndex != index || !this.selectChild.length) {
          this.selectChild = this.copySelect(item).selectH || [];
          this.selectChildCurrent = 0;
        }
        this.maskShow = item.selectH ? item.selectH.length : 0;
        if(item.selectH) {
          this.selectChildCurrent = index;
        }else {
          this.tabIndex = index;
          this.$emit('screenTap', item, index);
        }
      },
      dropdownItem(val) {
        this.maskShow = 0;
        this.selectChild = this.selectChild.map( item => {
          item.selected = false;
          if(val.name == item.name) {
            val.selected = true;
          }
          return item;
        })
        this.tabIndex = this.selectChildCurrent;
        this.$emit('screenTap', val, this.tabIndex);
      },
      copySelect(data) {
        return JSON.parse(JSON.stringify(data));
      },
      preventTouch(){}
    }
  }
</script>

<style lang="scss" scoped>
  .screen {
    width: 100%;
    box-sizing: border-box;
    background: #fff;
  }
  
  .screen-top{
  	display: flex;
  	align-items: center;
  	justify-content: space-between;
  	font-size: 28rpx;
  	color: #333;
    height: 88rpx;
    position: relative;
    background: #fff;
  }
  
  .top-item {
  	height: 100%;
  	flex: 1;
  	display: flex;
  	align-items: center;
  	justify-content: center;
  }
  
  .topitem-active {
  	color: #e41f19;
  }
  
  .screen-top-name {
    line-height: 1;
  }
  
  /*顶部下拉选择 综合*/
  
  .dropdownlist {
  	width: 100%;
  	position: absolute;
  	background-color: #fff;
  	border-bottom-left-radius: 24rpx;
  	border-bottom-right-radius: 24rpx;
  	overflow: hidden;
  	box-sizing: border-box;
  	padding-top: 10rpx;
  	padding-bottom: 26rpx;
  	left: 0;
  	top: 88rpx;
  	visibility: hidden;
  	z-index: 999;
    color: #333;
    
    .list {
      width: 100%;
      height: 100%;
      overflow-y: visible;
    }
  }
  
  .dropdownlist-show {
  	visibility: visible;
  }
  
  .dropdownlist-item {
  	height: 70rpx;
  	font-size: 28rpx;
  	padding: 0 40rpx;
  	box-sizing: border-box;
  	display: flex;
  	align-items: center;
  	justify-content: space-between;
  }
  
  .dropdownlist-mask {
  	position: fixed;
  	top: 0;
  	left: 0;
  	right: 0;
  	bottom: 0;
  	background-color: rgba(0, 0, 0, 0.6);
  	z-index: -1;
  	transition: all 0.2s ease-in-out;
  	opacity: 0;
  	visibility: hidden;
  }
  
  .mask-show {
  	opacity: 1;
  	visibility: visible;
  }
  
  .text-theme {
    color: $theme;
  }
</style>
