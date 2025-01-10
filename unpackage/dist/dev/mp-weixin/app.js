"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const common_vendor = require("./common/vendor.js");
if (!Math) {
  "./pages/login/login.js";
  "./pages/square/square.js";
  "./pages/discover/discover.js";
  "./pages/mine/mine.js";
  "./pages/comments/comments.js";
}
const _sfc_main = {
  onLaunch: function() {
    console.log("App Launch");
    this.checkLoginStatus();
  },
  methods: {
    checkLoginStatus() {
      try {
        const openid = common_vendor.index.getStorageSync("openid");
        if (!openid) {
          console.log("未登录，跳转到登录页");
          common_vendor.index.reLaunch({
            url: "/pages/login/login"
          });
        } else {
          console.log("已登录，openid:", openid);
        }
      } catch (e) {
        console.error("检查登录状态失败：", e);
        common_vendor.index.reLaunch({
          url: "/pages/login/login"
        });
      }
    }
  },
  onShow: function() {
    console.log("App Show");
  },
  onHide: function() {
    console.log("App Hide");
  }
};
function createApp() {
  const app = common_vendor.createSSRApp(_sfc_main);
  return {
    app
  };
}
createApp().app.mount("#app");
exports.createApp = createApp;
