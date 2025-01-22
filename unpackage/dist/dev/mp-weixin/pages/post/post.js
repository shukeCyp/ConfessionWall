"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      statusBarHeight: 0,
      type: "text",
      postType: "",
      // 'video' 或 'image'
      content: "",
      maxLength: 1e3,
      mediaList: [],
      screenWidth: 0,
      screenHeight: 0,
      isVideoHorizontal: false,
      isRefreshing: false
    };
  },
  onLoad(options) {
    var _a;
    const systemInfo = common_vendor.index.getSystemInfoSync();
    this.statusBarHeight = systemInfo.statusBarHeight;
    this.type = options.type || "text";
    if (options.images) {
      const media = JSON.parse(options.images);
      this.mediaList = media;
      this.postType = ((_a = media[0]) == null ? void 0 : _a.type) || "image";
    }
    this.screenWidth = systemInfo.windowWidth;
    this.screenHeight = systemInfo.windowHeight;
  },
  methods: {
    previewVideo() {
      if (!this.mediaList[0])
        return;
      common_vendor.index.navigateTo({
        url: "/pages/video-player/video-player",
        success: () => {
          common_vendor.index.$emit("video-data", {
            url: this.mediaList[0].path,
            cover: this.mediaList[0].cover
          });
        }
      });
    },
    deleteVideo() {
      common_vendor.index.showModal({
        title: "提示",
        content: "确定要删除这个视频吗？",
        success: (res) => {
          if (res.confirm) {
            this.mediaList = [];
            this.goBack();
          }
        }
      });
    },
    goBack() {
      common_vendor.index.navigateBack();
    },
    // 预览并支持删除图片
    previewMedia(index) {
      common_vendor.index.previewImage({
        urls: this.mediaList.map((item) => item.path),
        current: index,
        showmenu: true,
        // 显示操作菜单
        success: () => {
          common_vendor.index.$once("uni-preview-menu-click", () => {
            common_vendor.index.showModal({
              title: "提示",
              content: "确定要删除这张图片吗？",
              success: (res) => {
                if (res.confirm) {
                  this.mediaList.splice(index, 1);
                }
              }
            });
          });
        }
      });
    },
    // 选择图片
    chooseImage() {
      const maxCount = 9 - this.mediaList.length;
      if (maxCount <= 0) {
        common_vendor.index.showToast({
          title: "最多选择9张图片",
          icon: "none"
        });
        return;
      }
      common_vendor.index.chooseImage({
        count: maxCount,
        sizeType: ["compressed"],
        sourceType: ["album"],
        success: (res) => {
          const newImages = res.tempFilePaths.map((path) => ({
            type: "image",
            path
          }));
          this.mediaList = [...this.mediaList, ...newImages];
        }
      });
    },
    // 监听视频封面图加载完成
    onVideoLoad(e) {
      const { width, height } = e.detail;
      this.isVideoHorizontal = width > height;
    },
    // 修改 publish 方法
    async publish() {
      if (!this.canPublish)
        return;
      const userId = common_vendor.index.getStorageSync("userId");
      if (!userId) {
        common_vendor.index.showToast({
          title: "请先登录",
          icon: "none"
        });
        return;
      }
      common_vendor.index.showLoading({
        title: "发布中...",
        mask: true
      });
      try {
        common_vendor.index.request({
          url: `https://confession.lyvideo.top/posts?user_id=${userId}`,
          method: "POST",
          data: {
            content: this.content.trim()
          },
          header: {
            "accept": "application/json",
            "Content-Type": "application/json"
          },
          success: (res) => {
            console.log("帖子创建成功，返回数据：", res.data);
            if (this.mediaList.length > 0) {
              this.uploadMedia(res.data.id).then(() => {
                common_vendor.index.hideLoading();
                this.handleUploadComplete();
              }).catch((err) => {
                common_vendor.index.hideLoading();
                this.handleUploadError(err);
              });
            } else {
              common_vendor.index.hideLoading();
              this.handleUploadComplete();
            }
          },
          fail: (err) => {
            console.error("发布失败：", err);
            common_vendor.index.hideLoading();
            common_vendor.index.showToast({
              title: "发布失败，请重试",
              icon: "none"
            });
          }
        });
      } catch (err) {
        common_vendor.index.hideLoading();
        common_vendor.index.showToast({
          title: err.message || "内容审核未通过，请修改后重试",
          icon: "none",
          duration: 2e3
        });
      }
    },
    // 上传媒体文件
    uploadMedia(postId) {
      if (this.postType === "video") {
        return this.uploadVideo(postId);
      } else {
        return this.uploadImages(postId);
      }
    },
    // 上传图片
    uploadImages(postId) {
      const uploadTasks = this.mediaList.map((media) => {
        return new Promise((resolve, reject) => {
          common_vendor.index.uploadFile({
            url: `https://confession.lyvideo.top/posts/${postId}/images`,
            filePath: media.path,
            name: "files",
            formData: {
              post_id: postId
            },
            header: {
              "accept": "application/json"
            },
            success: (res) => {
              if (res.statusCode === 200) {
                console.log("图片上传成功：", res);
                resolve(res);
              } else {
                const error = JSON.parse(res.data);
                console.error("图片上传失败：", error);
                reject(error);
              }
            },
            fail: (err) => {
              console.error("图片上传失败：", err);
              reject(err);
            }
          });
        });
      });
      return Promise.all(uploadTasks);
    },
    // 上传视频
    uploadVideo(postId) {
      return new Promise((resolve, reject) => {
        common_vendor.index.uploadFile({
          url: `https://confession.lyvideo.top/posts/${postId}/video`,
          filePath: this.mediaList[0].path,
          name: "file",
          formData: {
            post_id: postId
          },
          header: {
            "accept": "application/json"
          },
          success: (res) => {
            if (res.statusCode === 200) {
              console.log("视频上传成功：", res);
              resolve(res);
            } else {
              const error = JSON.parse(res.data);
              console.error("视频上传失败：", error);
              reject(error);
            }
          },
          fail: (err) => {
            console.error("视频上传失败：", err);
            reject(err);
          }
        });
      });
    },
    // 发布完成处理
    handleUploadComplete() {
      common_vendor.index.showToast({
        title: "等待审核",
        icon: "success",
        duration: 1500
      });
      setTimeout(() => {
        this.goBack();
      }, 1500);
    },
    // 发布失败处理
    handleUploadError(err) {
      console.error("媒体上传失败：", err);
      common_vendor.index.showToast({
        title: "媒体上传失败，请重试",
        icon: "none",
        duration: 2e3
      });
    },
    onRefresh() {
      this.isRefreshing = true;
      setTimeout(() => {
        this.isRefreshing = false;
      }, 1e3);
    }
  },
  computed: {
    canPublish() {
      return this.content.trim().length > 0 || this.mediaList.length > 0;
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $data.statusBarHeight + "px",
    b: common_vendor.t($data.postType === "video" ? "发布视频" : "发布图片"),
    c: $data.postType === "video" ? "添加视频描述..." : "这一刻的想法...",
    d: $data.maxLength,
    e: $data.content,
    f: common_vendor.o(($event) => $data.content = $event.detail.value),
    g: $data.postType === "image"
  }, $data.postType === "image" ? common_vendor.e({
    h: common_vendor.f($data.mediaList, (item, index, i0) => {
      return {
        a: item.path,
        b: common_vendor.o(($event) => $options.previewMedia(index), index),
        c: index
      };
    }),
    i: $data.mediaList.length < 9
  }, $data.mediaList.length < 9 ? {
    j: common_vendor.o((...args) => $options.chooseImage && $options.chooseImage(...args))
  } : {}) : {}, {
    k: common_vendor.o((...args) => $options.goBack && $options.goBack(...args)),
    l: $options.canPublish ? 1 : "",
    m: common_vendor.o((...args) => $options.publish && $options.publish(...args))
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
