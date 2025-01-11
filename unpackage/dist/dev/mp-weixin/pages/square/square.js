"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      isRefreshing: false,
      bannerList: [
        { image: "/static/banner.png", url: "" },
        { image: "/static/banner.png", url: "" },
        { image: "/static/banner.png", url: "" }
      ],
      posts: [
        // 纯文本
        {
          avatar: "/static/logo.png",
          nickname: "匿名用户",
          time: "刚刚",
          content: "今天天气真好，想和你一起散步",
          type: "text",
          likes: 12,
          likeUsers: ["张三", "李四", "王五"],
          comments: [
            {
              nickname: "张三",
              content: "真不错呢！",
              time: "5分钟前"
            },
            {
              nickname: "李四",
              content: "校园生活真美好",
              time: "3分钟前"
            },
            {
              nickname: "王五",
              content: "期待遇见你",
              time: "2分钟前"
            },
            {
              nickname: "赵六",
              content: "加油加油！",
              time: "1分钟前"
            },
            {
              nickname: "小明",
              content: "太棒了",
              time: "刚刚"
            },
            {
              nickname: "小红",
              content: "继续努力",
              time: "刚刚"
            }
          ],
          isLiked: false
        },
        // 单图文
        {
          avatar: "/static/logo.png",
          nickname: "匿名用户",
          time: "5分钟前",
          content: "期待与你相遇在校园的每个角落",
          type: "image",
          images: ["/static/banner.png"],
          likes: 8,
          likeUsers: ["张三", "李四"],
          comments: [
            {
              nickname: "张三",
              content: "真不错呢！",
              time: "5分钟前"
            },
            {
              nickname: "李四",
              content: "校园生活真美好",
              time: "3分钟前"
            },
            {
              nickname: "王五",
              content: "期待遇见你",
              time: "2分钟前"
            },
            {
              nickname: "赵六",
              content: "加油加油！",
              time: "1分钟前"
            },
            {
              nickname: "小明",
              content: "太棒了",
              time: "刚刚"
            },
            {
              nickname: "小红",
              content: "继续努力",
              time: "刚刚"
            }
          ],
          isLiked: false
        },
        // 九宫格
        {
          avatar: "/static/logo.png",
          nickname: "匿名用户",
          time: "10分钟前",
          content: "美好的校园生活",
          type: "images",
          images: [
            "/static/banner.png",
            "/static/banner.png",
            "/static/banner.png",
            "/static/banner.png",
            "/static/banner.png",
            "/static/banner.png",
            "/static/banner.png",
            "/static/banner.png",
            "/static/banner.png"
          ],
          likes: 15,
          likeUsers: ["张三", "李四", "王五"],
          comments: [
            {
              nickname: "张三",
              content: "真不错呢！",
              time: "5分钟前"
            },
            {
              nickname: "李四",
              content: "校园生活真美好",
              time: "3分钟前"
            },
            {
              nickname: "王五",
              content: "期待遇见你",
              time: "2分钟前"
            },
            {
              nickname: "赵六",
              content: "加油加油！",
              time: "1分钟前"
            },
            {
              nickname: "小明",
              content: "太棒了",
              time: "刚刚"
            },
            {
              nickname: "小红",
              content: "继续努力",
              time: "刚刚"
            }
          ],
          isLiked: false
        },
        // 视频
        {
          avatar: "/static/logo.png",
          nickname: "匿名用户",
          time: "30分钟前",
          content: "校园的一天",
          type: "video",
          video: "/static/video.mp4",
          videoCover: "/static/banner.png",
          likes: 20,
          likeUsers: ["张三", "李四", "王五"],
          comments: [
            {
              nickname: "张三",
              content: "真不错呢！",
              time: "5分钟前"
            },
            {
              nickname: "李四",
              content: "校园生活真美好",
              time: "3分钟前"
            },
            {
              nickname: "王五",
              content: "期待遇见你",
              time: "2分钟前"
            },
            {
              nickname: "赵六",
              content: "加油加油！",
              time: "1分钟前"
            },
            {
              nickname: "小明",
              content: "太棒了",
              time: "刚刚"
            },
            {
              nickname: "小红",
              content: "继续努力",
              time: "刚刚"
            }
          ],
          isLiked: false
        }
      ]
    };
  },
  methods: {
    handleBanner(item) {
      if (item.url) {
        common_vendor.index.navigateTo({
          url: item.url
        });
      }
    },
    onRefresh() {
      this.isRefreshing = true;
      setTimeout(() => {
        this.isRefreshing = false;
        common_vendor.index.showToast({
          title: "刷新成功",
          icon: "none"
        });
      }, 1e3);
    },
    previewImage(images, current) {
      common_vendor.index.previewImage({
        urls: images,
        current
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
      common_vendor.index.showActionSheet({
        itemList: ["发布文字", "发布图片"],
        success: (res) => {
          if (res.tapIndex === 0) {
            common_vendor.index.navigateTo({
              url: "/pages/post/post?type=text"
            });
          } else if (res.tapIndex === 1) {
            common_vendor.index.navigateTo({
              url: "/pages/post/post?type=image"
            });
          }
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
    }
  }
};
if (!Array) {
  const _component_uni_popup = common_vendor.resolveComponent("uni-popup");
  _component_uni_popup();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.f($data.bannerList, (item, index, i0) => {
      return {
        a: item.image,
        b: common_vendor.o(($event) => $options.handleBanner(item), index),
        c: index
      };
    }),
    b: common_vendor.f($data.posts, (item, index, i0) => {
      return common_vendor.e({
        a: item.avatar,
        b: common_vendor.t(item.nickname),
        c: common_vendor.t(item.content),
        d: item.type === "image"
      }, item.type === "image" ? {
        e: item.images[0],
        f: common_vendor.o(($event) => $options.previewImage(item.images, 0), index)
      } : {}, {
        g: item.type === "images"
      }, item.type === "images" ? {
        h: common_vendor.f(item.images, (img, imgIndex, i1) => {
          return {
            a: imgIndex,
            b: img,
            c: common_vendor.o(($event) => $options.previewImage(item.images, imgIndex), imgIndex)
          };
        })
      } : {}, {
        i: item.type === "video"
      }, item.type === "video" ? {
        j: item.video,
        k: item.videoCover,
        l: common_vendor.o((...args) => _ctx.playVideo && _ctx.playVideo(...args), index)
      } : {}, {
        m: common_vendor.t(item.time),
        n: common_vendor.n({
          "active": item.isLiked
        }),
        o: common_vendor.o(($event) => $options.handleLike(index), index),
        p: common_vendor.o(($event) => $options.handleComment(index), index),
        q: item.likes > 0 || item.comments.length > 0
      }, item.likes > 0 || item.comments.length > 0 ? common_vendor.e({
        r: item.likes > 0
      }, item.likes > 0 ? {
        s: common_vendor.t(item.likeUsers.join("、")),
        t: common_vendor.t(item.likes)
      } : {}, {
        v: item.comments.length > 0
      }, item.comments.length > 0 ? common_vendor.e({
        w: common_vendor.f(item.comments.slice(0, 5), (comment, cIndex, i1) => {
          return {
            a: common_vendor.t(comment.nickname),
            b: common_vendor.t(comment.content),
            c: cIndex
          };
        }),
        x: item.comments.length > 5
      }, item.comments.length > 5 ? {
        y: common_vendor.t(item.comments.length),
        z: common_vendor.o(($event) => $options.viewAllComments(index), index)
      } : {}) : {}) : {}, {
        A: index
      });
    }),
    c: common_vendor.o((...args) => $options.onRefresh && $options.onRefresh(...args)),
    d: $data.isRefreshing,
    e: common_vendor.o((...args) => $options.showActionSheet && $options.showActionSheet(...args)),
    f: common_vendor.o(($event) => $options.handleAction("text")),
    g: common_vendor.o(($event) => $options.handleAction("image")),
    h: common_vendor.o((...args) => $options.hidePopup && $options.hidePopup(...args)),
    i: common_vendor.sr("popup", "67c1daae-0"),
    j: common_vendor.o($options.popupChange),
    k: common_vendor.p({
      type: "bottom",
      ["mask-click"]: true
    })
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
