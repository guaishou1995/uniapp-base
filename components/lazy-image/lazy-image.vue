<template>
  <view class="lazy-image-wrap" @click="_onClick">
    <image class="lazy-image" :src="realSrc" :mode="mode" @load="onLoaded" />
    <view class="lazy-image-placeholder" :class="{ loaded: loaded }">
      <image class="lazy-image" :src="placeholdSrc" :mode="mode" />
    </view>
    <!-- #ifdef APP-PLUS || MP -->
    <!-- <image class="lazy-image" lazy-load="true" :src="realSrc" :mode="mode" /> -->
    <!-- #endif -->
  </view>
</template>

<script>
export default {
  name: "LazyImage",
  props: {
    mode: {
      type: String,
      default: "aspectFill",
    },
    placeholdSrc: {
      type: String,
      default: "/static/images/img-placeholder.jpg",
    },
    realSrc: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      loaded: false,
    };
  },
  methods: {
    onLoaded() {
      this.loaded = true;
    },
    _onClick() {
      if (this.disabled) {
        return;
      }
      this.$emit("click");
    },
  },
};
</script>

<style lang="scss" scoped>
.lazy-image-wrap {
  height: 100%;
  width: 100%;
  display: flex;
  position: relative;

  .lazy-image {
    width: 100%;
    height: 100%;
  }

  .lazy-image-placeholder {
    background-color: #eee;
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    transition: opacity 0.4s linear;
  }

  .loaded {
    opacity: 0;
  }
}
</style>
