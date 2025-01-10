"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      topics: [
        { name: "表白大作战", count: 128 },
        { name: "今日心动", count: 56 },
        { name: "校园偶遇", count: 89 }
      ],
      recommends: [
        {
          content: "遇见你是我最美好的意外...",
          likes: 23,
          comments: 5
        },
        {
          content: "想和你一起看落日余晖...",
          likes: 18,
          comments: 3
        }
      ]
    };
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.f($data.topics, (item, index, i0) => {
      return {
        a: common_vendor.t(item.name),
        b: common_vendor.t(item.count),
        c: index
      };
    }),
    b: common_vendor.f($data.recommends, (item, index, i0) => {
      return {
        a: common_vendor.t(item.content),
        b: common_vendor.t(item.likes),
        c: common_vendor.t(item.comments),
        d: index
      };
    })
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
