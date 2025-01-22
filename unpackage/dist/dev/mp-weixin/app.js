"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const common_vendor = require("./common/vendor.js");
if (!Math) {
  "./pages/square/square.js";
  "./pages/login/login.js";
  "./pages/discover/discover.js";
  "./pages/mine/mine.js";
  "./pages/comments/comments.js";
  "./pages/post/post.js";
  "./pages/my-posts/my-posts.js";
}
const lazyCodeLoading = "requiredComponents";
const App = {
  lazyCodeLoading
};
function createApp() {
  const app = common_vendor.createSSRApp(App);
  return {
    app
  };
}
createApp().app.mount("#app");
exports.createApp = createApp;
