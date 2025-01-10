"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      avatarUrl: "",
      nickName: "",
      userId: "",
      menuItems: [
        { name: "我的表白", icon: "cuIcon-favor" },
        { name: "我的评论", icon: "cuIcon-comment" },
        { name: "我的点赞", icon: "cuIcon-appreciate" },
        { name: "设置", icon: "cuIcon-settings" }
      ]
    };
  },
  onShow() {
    this.avatarUrl = common_vendor.index.getStorageSync("avatarUrl");
    this.nickName = common_vendor.index.getStorageSync("nickName");
    this.userId = common_vendor.index.getStorageSync("userId");
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: $data.avatarUrl || "/static/logo.png",
    b: common_vendor.t($data.nickName || "未登录"),
    c: common_vendor.t($data.userId || "--"),
    d: common_vendor.f($data.menuItems, (item, index, i0) => {
      return {
        a: common_vendor.n(item.icon),
        b: common_vendor.t(item.name),
        c: index,
        d: common_vendor.o(($event) => _ctx.handleMenu(item), index)
      };
    })
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
