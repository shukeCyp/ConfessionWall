"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      avatarUrl: "",
      nickName: "",
      userId: "",
      userStats: {
        postCount: 0,
        pendingCount: 0,
        rejectedCount: 0,
        totalPosts: 0,
        // 总帖子数
        likes: 0,
        // 获赞数
        comments: 0
        // 评论数
      },
      menuItems: [
        { name: "我的表白", icon: "cuIcon-favor" },
        { name: "我的评论", icon: "cuIcon-comment" },
        { name: "我的点赞", icon: "cuIcon-appreciate" },
        { name: "设置", icon: "cuIcon-settings" }
      ]
    };
  },
  onShow() {
    this.userId = common_vendor.index.getStorageSync("userId");
    if (this.userId) {
      this.loadUserInfo();
    } else {
      this.avatarUrl = "";
      this.nickName = "";
      this.resetUserStats();
    }
  },
  methods: {
    // 重置用户统计数据
    resetUserStats() {
      this.userStats = {
        postCount: 0,
        pendingCount: 0,
        rejectedCount: 0,
        totalPosts: 0,
        likes: 0,
        comments: 0
      };
    },
    // 加载用户信息
    loadUserInfo() {
      common_vendor.index.request({
        url: `https://confession.lyvideo.top/get_userinfo/${this.userId}`,
        method: "GET",
        success: (res) => {
          if (res.data) {
            this.avatarUrl = res.data.avatar_url;
            this.nickName = res.data.nickname;
            this.userStats.postCount = res.data.post_count || 0;
            this.userStats.pendingCount = res.data.pending_count || 0;
            this.userStats.rejectedCount = res.data.rejected_count || 0;
            this.userStats.totalPosts = this.userStats.postCount + this.userStats.pendingCount + this.userStats.rejectedCount;
            this.userStats.likes = 0;
            this.userStats.comments = 0;
            common_vendor.index.setStorageSync("avatarUrl", this.avatarUrl);
            common_vendor.index.setStorageSync("nickName", this.nickName);
          }
        },
        fail: (err) => {
          console.error("获取用户信息失败：", err);
        }
      });
    },
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
      switch (item.name) {
        case "我的表白":
          common_vendor.index.navigateTo({
            url: "/pages/my-posts/my-posts"
          });
          break;
        case "我的评论":
          common_vendor.index.showToast({
            title: "评论功能开发中",
            icon: "none"
          });
          break;
        case "我的点赞":
          common_vendor.index.showToast({
            title: "点赞功能开发中",
            icon: "none"
          });
          break;
        case "设置":
          common_vendor.index.showToast({
            title: "设置功能开发中",
            icon: "none"
          });
          break;
      }
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
    g: common_vendor.t($data.userId ? $data.userStats.totalPosts : "--"),
    h: common_vendor.t($data.userId ? $data.userStats.likes : "--"),
    i: common_vendor.t($data.userId ? $data.userStats.comments : "--"),
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
