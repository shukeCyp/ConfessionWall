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
  },
  methods: {
    goToLogin() {
      common_vendor.index.navigateTo({
        url: "/pages/login/login"
      });
    },
    handleMenu(item) {
      if (!this.userId) {
        common_vendor.index.showModal({
          title: "提示",
          content: "请先登录",
          success: (res) => {
            if (res.confirm) {
              this.goToLogin();
            }
          }
        });
        return;
      }
      common_vendor.index.showToast({
        title: `点击了${item.name}`,
        icon: "none"
      });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $data.avatarUrl || "/static/logo.png",
    b: common_vendor.t($data.nickName || "未登录"),
    c: $data.userId
  }, $data.userId ? {
    d: common_vendor.t($data.userId)
  } : {}, {
    e: !$data.userId
  }, !$data.userId ? {
    f: common_vendor.o((...args) => $options.goToLogin && $options.goToLogin(...args))
  } : {}, {
    g: common_vendor.t($data.userId ? "12" : "--"),
    h: common_vendor.t($data.userId ? "28" : "--"),
    i: common_vendor.t($data.userId ? "5" : "--"),
    j: common_vendor.f($data.menuItems, (item, index, i0) => {
      return {
        a: common_vendor.n(item.icon),
        b: common_vendor.t(item.name),
        c: index,
        d: common_vendor.o(($event) => $options.handleMenu(item), index)
      };
    })
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
