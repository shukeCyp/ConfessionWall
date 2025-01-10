"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const _sfc_main = {
  data() {
    return {
      isAgree: false,
      apiBaseUrl: "https://confession.lyvideo.top"
      // 修改为正确的域名
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
      common_vendor.index.getUserInfo({
        success: (userRes) => {
          console.log("用户信息：", userRes.userInfo);
          const userInfo = userRes.userInfo;
          common_vendor.index.setStorageSync("avatarUrl", userInfo.avatarUrl);
          common_vendor.index.setStorageSync("gender", userInfo.gender);
          common_vendor.index.setStorageSync("nickName", userInfo.nickName);
          this.wxLogin(userInfo);
        },
        fail: (err) => {
          console.error("获取用户信息失败：", err);
          common_vendor.index.showToast({
            title: "获取用户信息失败",
            icon: "none"
          });
        }
      });
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
  return {
    a: common_assets._imports_0,
    b: common_vendor.o((...args) => $options.handleWXLogin && $options.handleWXLogin(...args)),
    c: $data.isAgree,
    d: common_vendor.o((...args) => $options.goToUserAgreement && $options.goToUserAgreement(...args)),
    e: common_vendor.o((...args) => $options.goToPrivacyPolicy && $options.goToPrivacyPolicy(...args)),
    f: common_vendor.o((...args) => $options.handleAgreeChange && $options.handleAgreeChange(...args))
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
