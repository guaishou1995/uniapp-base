<script>
export default {
  onLaunch: function () {
    console.log("App Launch");
    // 检查登录状态
    // this.$store.dispatch("account/detectLoginStatus");
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
@import "/static/style/css/iconfont.css";
@import "uview-ui/index.scss";
</style>
