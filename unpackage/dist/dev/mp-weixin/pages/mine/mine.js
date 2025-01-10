"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      avatarUrl: "/static/avatar.png",
      // 默认头像
      nickName: "未登录",
      menuItems: [
        { name: "我的表白", icon: "cuIcon-favor" },
        { name: "我的评论", icon: "cuIcon-comment" },
        { name: "我的点赞", icon: "cuIcon-appreciate" },
        { name: "设置", icon: "cuIcon-settings" }
      ]
    };
  },
  onShow() {
    this.getUserInfo();
  },
  methods: {
    getUserInfo() {
      const avatarUrl = common_vendor.index.getStorageSync("avatarUrl");
      const nickName = common_vendor.index.getStorageSync("nickName");
      if (avatarUrl) {
        this.avatarUrl = avatarUrl;
      }
      if (nickName) {
        this.nickName = nickName;
      }
    },
    handleMenu(item) {
      common_vendor.index.showToast({
        title: `点击了${item.name}`,
        icon: "none"
      });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: $data.avatarUrl,
    b: common_vendor.t($data.nickName),
    c: common_vendor.f($data.menuItems, (item, index, i0) => {
      return {
        a: common_vendor.n(item.icon),
        b: common_vendor.t(item.name),
        c: index,
        d: common_vendor.o(($event) => $options.handleMenu(item), index)
      };
    })
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
