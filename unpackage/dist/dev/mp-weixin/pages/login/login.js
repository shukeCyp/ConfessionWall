"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const _sfc_main = {
  data() {
    return {
      isAgree: false,
      apiBaseUrl: "https://confession.lyvideo.top",
      showUserInfoDialog: false,
      tempUserInfo: {
        avatarUrl: "/static/logo.png",
        // 设置默认头像
        nickName: ""
      }
    };
  },
  methods: {
    handleWXLogin() {
      if (!this.isAgree) {
        common_vendor.index.showToast({
          title: "请先同意用户协议和隐私政策",
          icon: "none"
        });
        return;
      }
      this.showUserInfoDialog = true;
    },
    // 选择头像回调
    onChooseAvatar(e) {
      console.log("选择头像回调：" + e.detail.avatarUrl);
      common_vendor.wx$1.getFileSystemManager().saveFile({
        tempFilePath: e.detail.avatarUrl,
        success: async (res) => {
          const savedFilePath = res.savedFilePath;
          console.log("保存的头像文件路径：" + savedFilePath);
          try {
            const uploadRes = await common_vendor.index.uploadFile({
              url: `${this.apiBaseUrl}/users/1/avatar`,
              filePath: savedFilePath,
              name: "file",
              success: (uploadRes2) => {
                const data = JSON.parse(uploadRes2.data);
                this.tempUserInfo.avatarUrl = data.avatar_url;
              },
              fail: (err) => {
                console.error("上传头像失败:", err);
                common_vendor.index.showToast({
                  title: "上传头像失败",
                  icon: "none"
                });
              }
            });
          } catch (err) {
            console.error("上传头像失败:", err);
            common_vendor.index.showToast({
              title: "上传头像失败",
              icon: "none"
            });
          }
        },
        fail: (err) => {
          console.error("保存头像失败:", err);
          common_vendor.index.showToast({
            title: "保存头像失败",
            icon: "none"
          });
        }
      });
    },
    // 确认用户信息
    confirmUserInfo() {
      if (!this.tempUserInfo.avatarUrl || !this.tempUserInfo.nickName) {
        common_vendor.index.showToast({
          title: "请完善头像和昵称",
          icon: "none"
        });
        return;
      }
      common_vendor.index.setStorageSync("avatarUrl", this.tempUserInfo.avatarUrl);
      common_vendor.index.setStorageSync("nickName", this.tempUserInfo.nickName);
      this.showUserInfoDialog = false;
      this.wxLogin(this.tempUserInfo);
    },
    // 微信登录
    wxLogin(userInfo) {
      common_vendor.index.login({
        provider: "weixin",
        success: (loginRes) => {
          const code = loginRes.code;
          console.log("微信登录code:", code);
          common_vendor.index.request({
            url: `${this.apiBaseUrl}/wxcode2session?code=${code}`,
            method: "GET",
            success: (res) => {
              console.log("登录接口返回数据：", res.data);
              if (res.data.success) {
                const openid = res.data.openid;
                const unionid = res.data.unionid;
                common_vendor.index.setStorageSync("openid", openid);
                common_vendor.index.setStorageSync("unionid", unionid);
                this.loginToServer(userInfo, openid, unionid);
              } else {
                common_vendor.index.showToast({
                  title: "登录失败",
                  icon: "none"
                });
              }
            },
            fail: (err) => {
              console.error("接口调用失败：", err);
              common_vendor.index.showToast({
                title: "登录失败，请重试",
                icon: "none"
              });
            }
          });
        },
        fail: (err) => {
          console.error("获取code失败：", err);
          common_vendor.index.showToast({
            title: "登录失败，请重试",
            icon: "none"
          });
        }
      });
    },
    // 调用服务器登录接口
    loginToServer(userInfo, openid, unionid) {
      const loginData = {
        avatar_url: userInfo.avatarUrl || null,
        gender: userInfo.gender || 0,
        nickname: userInfo.nickName || null,
        openid,
        unionid: unionid || null
      };
      common_vendor.index.request({
        url: `${this.apiBaseUrl}/login`,
        method: "POST",
        header: {
          "Content-Type": "application/json"
        },
        data: loginData,
        success: (res) => {
          if (res.statusCode === 200) {
            common_vendor.index.setStorageSync("userId", res.data.id);
            common_vendor.index.showToast({
              title: "登录成功",
              icon: "success"
            });
            setTimeout(() => {
              common_vendor.index.reLaunch({
                url: "/pages/square/square"
              });
            }, 1500);
          } else {
            common_vendor.index.showToast({
              title: "登录失败",
              icon: "none"
            });
          }
        },
        fail: (err) => {
          console.error("登录接口调用失败：", err);
          common_vendor.index.showToast({
            title: "登录失败，请重试",
            icon: "none"
          });
        }
      });
    },
    handleAgreeChange(e) {
      this.isAgree = e.detail.value.length > 0;
    },
    goToUserAgreement() {
    },
    goToPrivacyPolicy() {
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_assets._imports_0,
    b: common_vendor.o((...args) => $options.handleWXLogin && $options.handleWXLogin(...args)),
    c: $data.isAgree,
    d: common_vendor.o((...args) => $options.goToUserAgreement && $options.goToUserAgreement(...args)),
    e: common_vendor.o((...args) => $options.goToPrivacyPolicy && $options.goToPrivacyPolicy(...args)),
    f: common_vendor.o((...args) => $options.handleAgreeChange && $options.handleAgreeChange(...args)),
    g: $data.showUserInfoDialog
  }, $data.showUserInfoDialog ? {
    h: $data.tempUserInfo.avatarUrl,
    i: common_vendor.o((...args) => $options.onChooseAvatar && $options.onChooseAvatar(...args)),
    j: $data.tempUserInfo.nickName,
    k: common_vendor.o(($event) => $data.tempUserInfo.nickName = $event.detail.value),
    l: common_vendor.o((...args) => $options.confirmUserInfo && $options.confirmUserInfo(...args))
  } : {});
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
