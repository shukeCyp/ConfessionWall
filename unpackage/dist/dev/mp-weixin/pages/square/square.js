"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      isRefreshing: false,
      bannerList: [
        { image: "/static/banner.png" },
        { image: "/static/banner.png" },
        { image: "/static/banner.png" }
      ],
      posts: [],
      page: 1,
      pageSize: 10,
      hasMore: true,
      isLoading: false,
      screenWidth: 0
    };
  },
  onLoad() {
    const systemInfo = common_vendor.index.getSystemInfoSync();
    this.screenWidth = systemInfo.windowWidth;
    this.loadPosts();
  },
  methods: {
    loadPosts(refresh = false) {
      if (this.isLoading)
        return;
      if (refresh) {
        this.page = 1;
        this.hasMore = true;
      }
      this.isLoading = true;
      common_vendor.index.request({
        url: `https://confession.lyvideo.top/get_posts?state=1&page=${this.page}&page_size=${this.pageSize}`,
        method: "GET",
        success: (res) => {
          const { data, total_pages } = res.data;
          console.log("API返回的原始数据：", data);
          const formattedPosts = data.map((post) => {
            const formattedPost = {
              id: post.id,
              avatar: post.avatar_url ? `${post.avatar_url}` : "/static/logo.png",
              nickname: post.nickname || "匿名用户",
              content: post.content,
              time: this.formatTime(post.created_at),
              media_list: post.media_list || []
            };
            console.log("帖子ID:", post.id, "的媒体列表:", post.media_list);
            return formattedPost;
          });
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
    // 格式化时间
    formatTime(timeStr) {
      const date = new Date(timeStr);
      const now = /* @__PURE__ */ new Date();
      const diff = now - date;
      if (diff < 6e4) {
        return "刚刚";
      }
      if (diff < 36e5) {
        return Math.floor(diff / 6e4) + "分钟前";
      }
      if (diff < 864e5) {
        return Math.floor(diff / 36e5) + "小时前";
      }
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
    // 添加图片预览方法
    previewImage(urls, current) {
      console.log("预览图片URLs:", urls);
      common_vendor.index.previewImage({
        urls,
        current: urls[current]
      });
    },
    // 检查登录状态
    checkLogin() {
      const userId = common_vendor.index.getStorageSync("userId");
      if (!userId) {
        common_vendor.index.showModal({
          title: "提示",
          content: "请先登录",
          success: (res) => {
            if (res.confirm) {
              common_vendor.index.navigateTo({
                url: "/pages/login/login"
              });
            }
          }
        });
        return false;
      }
      return true;
    },
    handleLike(index) {
      if (!this.checkLogin())
        return;
      this.posts[index].isLiked = !this.posts[index].isLiked;
      this.posts[index].likes += this.posts[index].isLiked ? 1 : -1;
    },
    handleComment(index) {
      if (!this.checkLogin())
        return;
      common_vendor.index.showToast({
        title: "评论功能开发中",
        icon: "none"
      });
    },
    showActionSheet() {
      if (!this.checkLogin())
        return;
      const handlePublish = (type) => {
        if (type === "text") {
          common_vendor.index.navigateTo({
            url: "/pages/post/post?type=text"
          });
        } else if (type === "image") {
          common_vendor.index.chooseImage({
            count: 9,
            sizeType: ["compressed"],
            sourceType: ["album"],
            success: (res) => {
              const images = res.tempFilePaths.map((path) => ({
                type: "image",
                path
              }));
              common_vendor.index.navigateTo({
                url: `/pages/post/post?type=image&images=${JSON.stringify(images)}`
              });
            }
          });
        } else {
          common_vendor.index.chooseVideo({
            sourceType: ["album"],
            maxDuration: 60,
            camera: "back",
            success: (res) => {
              const video = [{
                type: "video",
                path: res.tempFilePath,
                cover: res.thumbTempFilePath
              }];
              common_vendor.index.navigateTo({
                url: `/pages/post/post?type=image&images=${JSON.stringify(video)}`
              });
            }
          });
        }
      };
      common_vendor.index.showActionSheet({
        itemList: ["发布文字", "发布图片"],
        success: (res) => {
          const types = ["text", "image"];
          handlePublish(types[res.tapIndex]);
        }
      });
    },
    hidePopup() {
      this.$refs.popup && this.$refs.popup.close();
    },
    handleAction(type) {
      this.hidePopup();
      if (type === "text") {
        common_vendor.index.navigateTo({
          url: "/pages/post/post?type=text"
        });
      } else if (type === "image") {
        common_vendor.index.navigateTo({
          url: "/pages/post/post?type=image"
        });
      }
    },
    // 查看全部评论
    viewAllComments(postIndex) {
      if (!this.checkLogin())
        return;
      common_vendor.index.navigateTo({
        url: `/pages/comments/comments?postId=${postIndex}`
      });
    },
    // 监听弹窗状态变化
    popupChange(e) {
      console.log("popup status:", e.show);
    },
    // 添加视频播放方法
    playVideo(url) {
      common_vendor.index.navigateTo({
        url: "/pages/video-player/video-player"
      });
      common_vendor.index.$emit("video-data", {
        url,
        cover: url
      });
    },
    // 计算视频显示宽度
    getVideoWidth(media) {
      const maxWidth = this.screenWidth * 0.4;
      media.width / media.height;
      return Math.min(maxWidth, media.width);
    },
    // 计算视频显示高度
    getVideoHeight(media) {
      const width = this.getVideoWidth(media);
      return width / (media.width / media.height);
    },
    handleImageError(e, postIndex, mediaIndex) {
      this.posts[postIndex].media_list[mediaIndex].url = "static/default-image.png";
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.f($data.bannerList, (item, index, i0) => {
      return {
        a: item.image,
        b: index
      };
    }),
    b: common_vendor.f($data.posts, (item, index, i0) => {
      var _a, _b, _c, _d;
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
        g: item.media_list && ((_c = item.media_list[0]) == null ? void 0 : _c.type) === 1
      }, item.media_list && ((_d = item.media_list[0]) == null ? void 0 : _d.type) === 1 ? {
        h: `https://${item.media_list[0].url}`,
        i: `https://${item.media_list[0].url}?x-oss-process=video/snapshot,t_1000,f_jpg`,
        j: common_vendor.o(($event) => $options.playVideo(item.media_list[0].url), index),
        k: `${item.media_list[0].width} / ${item.media_list[0].height}`
      } : {}, {
        l: common_vendor.t(item.time),
        m: index
      });
    }),
    c: $data.isRefreshing,
    d: common_vendor.o((...args) => $options.onRefresh && $options.onRefresh(...args)),
    e: common_vendor.o((...args) => $options.onLoadMore && $options.onLoadMore(...args)),
    f: common_vendor.o((...args) => $options.showActionSheet && $options.showActionSheet(...args))
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
