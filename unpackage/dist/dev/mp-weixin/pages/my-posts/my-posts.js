"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      currentStatus: 1,
      // 默认显示已发布的
      isRefreshing: false,
      posts: [],
      page: 1,
      pageSize: 10,
      hasMore: true,
      isLoading: false,
      userId: ""
    };
  },
  onLoad() {
    this.userId = common_vendor.index.getStorageSync("userId");
    this.loadPosts();
  },
  methods: {
    switchStatus(status) {
      if (this.currentStatus === status)
        return;
      this.currentStatus = status;
      this.page = 1;
      this.posts = [];
      this.hasMore = true;
      this.loadPosts();
    },
    loadPosts(refresh = false) {
      if (this.isLoading)
        return;
      if (refresh) {
        this.page = 1;
        this.hasMore = true;
      }
      this.isLoading = true;
      common_vendor.index.request({
        url: `https://confession.lyvideo.top/user_posts?user_id=${this.userId}&state=${this.currentStatus}&page=${this.page}&page_size=${this.pageSize}`,
        method: "GET",
        success: (res) => {
          const { data, total_pages } = res.data;
          const formattedPosts = data.map((post) => ({
            id: post.id,
            avatar: post.avatar_url ? `${post.avatar_url}` : "/static/logo.png",
            nickname: post.nickname || "匿名用户",
            content: post.content,
            time: this.formatTime(post.created_at),
            media_list: post.media_list || []
          }));
          if (refresh) {
            this.posts = formattedPosts;
          } else {
            this.posts = [...this.posts, ...formattedPosts];
          }
          this.hasMore = this.page < total_pages;
          if (this.hasMore) {
            this.page++;
          }
        },
        complete: () => {
          this.isLoading = false;
          if (refresh) {
            this.isRefreshing = false;
          }
        }
      });
    },
    formatTime(timeStr) {
      const date = new Date(timeStr);
      const now = /* @__PURE__ */ new Date();
      const diff = now - date;
      if (diff < 6e4)
        return "刚刚";
      if (diff < 36e5)
        return Math.floor(diff / 6e4) + "分钟前";
      if (diff < 864e5)
        return Math.floor(diff / 36e5) + "小时前";
      return Math.floor(diff / 864e5) + "天前";
    },
    onRefresh() {
      this.isRefreshing = true;
      this.loadPosts(true);
    },
    onLoadMore() {
      if (this.hasMore && !this.isLoading) {
        this.loadPosts();
      }
    },
    previewImage(urls, current) {
      common_vendor.index.previewImage({
        urls,
        current: urls[current]
      });
    },
    playVideo(url) {
      common_vendor.index.navigateTo({
        url: "/pages/video-player/video-player"
      });
      common_vendor.index.$emit("video-data", {
        url,
        cover: url
      });
    },
    handleImageError(e, postIndex, mediaIndex) {
      this.posts[postIndex].media_list[mediaIndex].url = "static/default-image.png";
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $data.currentStatus === 1 ? 1 : "",
    b: common_vendor.o(($event) => $options.switchStatus(1)),
    c: $data.currentStatus === 0 ? 1 : "",
    d: common_vendor.o(($event) => $options.switchStatus(0)),
    e: common_vendor.f($data.posts, (item, index, i0) => {
      var _a, _b;
      return common_vendor.e({
        a: item.avatar,
        b: common_vendor.t(item.nickname),
        c: common_vendor.t(item.content),
        d: !item.content ? 1 : "",
        e: item.media_list && ((_a = item.media_list[0]) == null ? void 0 : _a.type) === 0
      }, item.media_list && ((_b = item.media_list[0]) == null ? void 0 : _b.type) === 0 ? {
        f: common_vendor.f(item.media_list, (media, mediaIndex, i1) => {
          return {
            a: mediaIndex,
            b: `https://${media.url}`,
            c: common_vendor.o(($event) => $options.previewImage(item.media_list.map((m) => `https://${m.url}`), mediaIndex), mediaIndex),
            d: common_vendor.o(($event) => $options.handleImageError($event, index, mediaIndex), mediaIndex)
          };
        })
      } : {}, {
        g: common_vendor.t(item.time),
        h: index
      });
    }),
    f: common_vendor.t($data.currentStatus === 0 ? "审核中" : ""),
    g: $data.currentStatus === 0 ? 1 : "",
    h: $data.posts.length === 0
  }, $data.posts.length === 0 ? {
    i: common_vendor.t($data.currentStatus === 0 ? "暂无待审核的表白" : "暂无已发布的表白")
  } : {}, {
    j: $data.isRefreshing,
    k: common_vendor.o((...args) => $options.onRefresh && $options.onRefresh(...args)),
    l: common_vendor.o((...args) => $options.onLoadMore && $options.onLoadMore(...args))
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
