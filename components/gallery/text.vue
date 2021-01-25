<template>
  <view>
    <view
      v-for="(text, index) in arr"
      :key="index"
      class="cu-tag line-grey"
      @click="click(text)"
    >
      {{ text }}
    </view>
  </view>
</template>

<script>
export default {
  props: {
    arr: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {};
  },
  methods: {
    click(text) {
      this.$emit("click", text);
    },
  },
};
</script>

<style></style>
