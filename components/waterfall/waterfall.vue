<template>
  <view class="waterfall" >
  	<view class="column">
      <slot name="left" :leftList="leftList"></slot>
    </view>
    <view class="column">
      <slot name="right" :rightList="rightList"></slot>
    </view>
  </view>
</template>
<script>
  /**
   * waterfall 瀑布流
   * @property {Array} tempList 用于渲染的数据
   * @property {Object} item 需要自带width: 列表宽度，img_widht: 图片宽度， img_height: 图片高度 用来计算图片高度
   * @example <waterfall :value="list" ref="waterfall"></waterfall>
   */
  export default {
    name: "waterfall",
    props: {
      value: {
        // 瀑布流数据
        type: Array,
        required: true,
        default: () => []
      },
    },
    data() {
      return {
        leftList: [],
        rightList: [],
        tempList: [],
        leftHeight: [],
        rightHeight: []
      }
    },
    watch: {
    	copyFlowList(nVal, oVal) {
    		let startIndex = Array.isArray(oVal) && oVal.length > 0 ? oVal.length : 0;
    		this.tempList = this.tempList.concat(this.cloneData(nVal.slice(startIndex)));
    		this.greedy();
    	}
    },
    computed: {
    	copyFlowList() {
    		return this.cloneData(this.value);
    	}
    },
    methods: {
      // 获得数据列表真实高度
      getListHeight() {
        return this.tempList.map( item => {
          const defaultWidth = 320;
          let width = item.img_width || defaultWidth;
          let height = item.img_height || defaultWidth;
          item.width = item.width || defaultWidth;
          item.height = parseInt(height / width * item.width);
          return item;
        })
      },
      // 获得左右列表
      greedy() {
        if (!this.tempList.length) return;
        const lists = this.getListHeight();
        lists.forEach( (item,index) => {
          if(this.sum(this.leftHeight) > this.sum(this.rightHeight)) {
            this.rightHeight.push(item.height);
            this.rightList.push(item);
          }else {
            this.leftHeight.push(item.height);
            this.leftList.push(item);
          }
        })
        this.tempList = [];
      },
      cloneData(data) {
      	return JSON.parse(JSON.stringify(data));
      },
      // 清空数据列表
      clear() {
      	this.leftList = [];
      	this.rightList = [];
        this.leftHeight = [];
        this.rightHeight = [];
      	this.$emit('input', []);
      },
      sum(arr) {
        return arr.length > 0 ? arr.reduce((prev, curr) => prev + curr) : 0;
      }
    }
  }
</script>


<style lang="scss" scoped>

.waterfall {
	display: flex;
	flex-direction: row;
	align-items: flex-start;
}

.column {
	display: flex;
	flex: 1;
	flex-direction: column;
	height: auto;
  margin-right: 30rpx;
  
  &:last-of-type {
    margin-right: 0;
  }
}
</style>