"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      postId: null,
      comments: [],
      newComment: ""
    };
  },
  onLoad(options) {
    this.postId = options.postId;
    this.getComments();
  },
  methods: {
    getComments() {
      this.comments = this.posts[this.postId].comments;
    },
    submitComment() {
      if (!this.newComment.trim()) {
        return;
      }
      this.comments.unshift({
        nickname: "我",
        content: this.newComment,
        time: "刚刚",
        avatar: common_vendor.index.getStorageSync("avatarUrl")
      });
      this.newComment = "";
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.f($data.comments, (comment, index, i0) => {
      return {
        a: comment.avatar || "/static/logo.png",
        b: common_vendor.t(comment.nickname),
        c: common_vendor.t(comment.time),
        d: common_vendor.t(comment.content),
        e: index
      };
    }),
    b: common_vendor.o((...args) => $options.submitComment && $options.submitComment(...args)),
    c: $data.newComment,
    d: common_vendor.o(($event) => $data.newComment = $event.detail.value),
    e: common_vendor.o((...args) => $options.submitComment && $options.submitComment(...args))
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
