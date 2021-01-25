<script>
export default {
  onLaunch: function () {
    console.log("App Launch");
    // 检查登录状态
    this.$store.dispatch("account/detectLoginStatus");
  },
  onShow: function () {
    console.log("App Show");
  },
  onHide: function () {
    console.log("App Hide");
  },
};
</script>

<style lang="scss">
/*每个页面公共css */
@import "/components/colorui/icon.css";
@import "/components/colorui/main.css";
</style>
