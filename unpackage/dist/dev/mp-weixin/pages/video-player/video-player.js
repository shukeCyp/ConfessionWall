"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      videoUrl: "",
      videoCover: ""
    };
  },
  onLoad() {
    common_vendor.index.$on("video-data", (data) => {
      this.videoUrl = data.url;
      this.videoCover = data.cover;
    });
  },
  onUnload() {
    common_vendor.index.$off("video-data");
  },
  methods: {
    goBack() {
      common_vendor.index.navigateBack();
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: $data.videoUrl,
    b: $data.videoCover,
    c: common_vendor.o((...args) => $options.goBack && $options.goBack(...args))
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
