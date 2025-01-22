<template>
	<view class="login-container">
		<!-- Logo区域 -->
		<view class="logo-box">
			<image class="logo" src="/static/logo.png" mode="widthFix"></image>
			<text class="slogan">表白墙，让爱有迹可循</text>
		</view>
		
		<!-- 空白占位 -->
		<view class="flex-grow"></view>
		
		<!-- 登录按钮区域 -->
		<view class="login-box">
			<button class="wx-login-btn" open-type="getUserInfo" @tap="handleWXLogin">
				<text class="cuIcon-weixin"></text>
				<text>微信一键登录</text>
			</button>
			<view class="tips">登录后即可发布内容</view>
		</view>
		
		<!-- 协议区域 -->
		<view class="agreement">
			<checkbox-group @change="handleAgreeChange">
				<label class="agreement-content">
					<checkbox value="1" :checked="isAgree" style="transform:scale(0.7)" color="#07c160"/>
					<text class="agreement-text">登录即代表同意</text>
					<text class="link" @tap="goToUserAgreement">《用户协议》</text>
					<text class="agreement-text">和</text>
					<text class="link" @tap="goToPrivacyPolicy">《隐私政策》</text>
				</label>
			</checkbox-group>
		</view>
		
		<!-- 使用Dialog替代uni-popup -->
		<view class="dialog" v-if="showUserInfoDialog">
			<view class="dialog-mask"></view>
			<view class="dialog-content">
				<view class="dialog-title">完善个人信息</view>
				<button class="avatar-wrapper" open-type="chooseAvatar" @chooseavatar="onChooseAvatar">
					<image class="avatar" :src="tempUserInfo.avatarUrl" mode="aspectFill"></image>
					<view class="avatar-tip">点击选择头像</view>
				</button>
				<input type="nickname" class="nickname-input" placeholder="请输入昵称" v-model="tempUserInfo.nickName"/>
				<button class="confirm-btn" @tap="confirmUserInfo">确认</button>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			isAgree: false,
			apiBaseUrl: 'https://confession.lyvideo.top',
			showUserInfoDialog: false,
			tempUserInfo: {
				avatarUrl: '/static/logo.png', // 设置默认头像
				nickName: ''
			}
		}
	},
	methods: {
		handleWXLogin() {
			if (!this.isAgree) {
				uni.showToast({
					title: '请先同意用户协议和隐私政策',
					icon: 'none'
				})
				return
			}
			
			// 显示Dialog
			this.showUserInfoDialog = true
		},
		
		// 选择头像回调
		onChooseAvatar(e) {
			console.log("选择头像回调：" + e.detail.avatarUrl)
			wx.getFileSystemManager().saveFile({
				tempFilePath: e.detail.avatarUrl,
				success: async (res) => {
					const savedFilePath = res.savedFilePath;
					console.log("保存的头像文件路径：" + savedFilePath);
					
					try {
						const uploadRes = await uni.uploadFile({
							url: `${this.apiBaseUrl}/users/1/avatar`,
							filePath: savedFilePath,
							name: 'file',
							success: (uploadRes) => {
								const data = JSON.parse(uploadRes.data);
								this.tempUserInfo.avatarUrl = data.avatar_url;
							},
							fail: (err) => {
								console.error('上传头像失败:', err);
								uni.showToast({
									title: '上传头像失败',
									icon: 'none'
								});
							}
						});
					} catch (err) {
						console.error('上传头像失败:', err);
						uni.showToast({
							title: '上传头像失败',
							icon: 'none'
						});
					}
				},
				fail: (err) => {
					console.error('保存头像失败:', err);
					uni.showToast({
						title: '保存头像失败',
						icon: 'none' 
					});
				}
			});
		},
		
		// 确认用户信息
		confirmUserInfo() {
			if (!this.tempUserInfo.avatarUrl || !this.tempUserInfo.nickName) {
				uni.showToast({
					title: '请完善头像和昵称',
					icon: 'none'
				})
				return
			}
			
			// 存储用户基本信息
			uni.setStorageSync('avatarUrl', this.tempUserInfo.avatarUrl)
			uni.setStorageSync('nickName', this.tempUserInfo.nickName)
			
			// 关闭Dialog
			this.showUserInfoDialog = false
			
			// 继续登录流程
			this.wxLogin(this.tempUserInfo)
		},
		
		// 微信登录
		wxLogin(userInfo) {
			uni.login({
				provider: 'weixin',
				success: (loginRes) => {
					const code = loginRes.code
					console.log('微信登录code:', code)
					
					// 调用后端接口获取openid和unionid
					uni.request({
						url: `${this.apiBaseUrl}/wxcode2session?code=${code}`,
						method: 'GET',
						success: (res) => {
							console.log('登录接口返回数据：', res.data)
							
							if (res.data.success) {
								const openid = res.data.openid
								const unionid = res.data.unionid
								
								// 存储openid和unionid
								uni.setStorageSync('openid', openid)
								uni.setStorageSync('unionid', unionid)
								
								// 调用登录接口
								this.loginToServer(userInfo, openid, unionid)
							} else {
								uni.showToast({
									title: '登录失败',
									icon: 'none'
								})
							}
						},
						fail: (err) => {
							console.error('接口调用失败：', err)
							uni.showToast({
								title: '登录失败，请重试',
								icon: 'none'
							})
						}
					})
				},
				fail: (err) => {
					console.error('获取code失败：', err)
					uni.showToast({
						title: '登录失败，请重试',
						icon: 'none'
					})
				}
			})
		},
		
		// 调用服务器登录接口
		loginToServer(userInfo, openid, unionid) {
			const loginData = {
				avatar_url: userInfo.avatarUrl || null,
				gender: userInfo.gender || 0,
				nickname: userInfo.nickName || null,
				openid: openid,
				unionid: unionid || null
			}
			
			uni.request({
				url: `${this.apiBaseUrl}/login`,
				method: 'POST',
				header: {
					'Content-Type': 'application/json'
				},
				data: loginData,
				success: (res) => {
					if (res.statusCode === 200) {
						// 存储返回的用户ID
						uni.setStorageSync('userId', res.data.id)
						
						uni.showToast({
							title: '登录成功',
							icon: 'success'
						})
						
						setTimeout(() => {
							uni.reLaunch({
								url: '/pages/square/square'
							})
						}, 1500)
					} else {
						uni.showToast({
							title: '登录失败',
							icon: 'none'
						})
					}
				},
				fail: (err) => {
					console.error('登录接口调用失败：', err)
					uni.showToast({
						title: '登录失败，请重试',
						icon: 'none'
					})
				}
			})
		},
		handleAgreeChange(e) {
			this.isAgree = e.detail.value.length > 0
		},
		goToUserAgreement() {
			
		},
		goToPrivacyPolicy() {
			
		}
	}
}
</script>

<style lang="scss">
.login-container {
	min-height: 100vh;
	background: #ffffff;
	display: flex;
	flex-direction: column;
	align-items: center;
	padding: 0 40rpx;
	position: relative;
}

.logo-box {
	margin-top: 300rpx;
	display: flex;
	flex-direction: column;
	align-items: center;
	
	.logo {
		width: 200rpx;
		height: auto;
		margin-bottom: 40rpx;
		border-radius: 30rpx;
		box-shadow: 0 10rpx 30rpx rgba(0,0,0,0.05);
	}
	
	.slogan {
		margin-top: 30rpx;
		font-size: 32rpx;
		color: #07c160;
		font-weight: 500;
	}
}

.flex-grow {
	flex: 1;
}

.login-box {
	width: 100%;
	padding: 0 30rpx;
	display: flex;
	flex-direction: column;
	align-items: center;
	margin-bottom: 120rpx;  /* 调整与协议区域的间距 */
	
	.wx-login-btn {
		width: 600rpx;
		height: 90rpx;
		background: #07c160;
		color: #ffffff;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 45rpx;
		box-shadow: 0 10rpx 20rpx rgba(7,193,96,0.2);
		border: none;
		
		&::after {
			border: none;
		}
		
		&:active {
			background: #06ae56;
		}
		
		.wx-icon {
			width: 40rpx;
			height: 40rpx;
			margin-right: 12rpx;
		}
		
		text {
			font-size: 32rpx;
			font-weight: 500;
		}
	}
	
	.tips {
		margin-top: 20rpx;
		font-size: 24rpx;
		color: #999;
	}
}

.agreement {
	padding-bottom: 50rpx;
	width: 100%;
	display: flex;
	justify-content: center;
	
	.agreement-content {
		display: flex;
		align-items: center;
		font-size: 24rpx;
		color: #999;
		padding: 20rpx;
		
		.agreement-text {
			margin: 0 4rpx;
		}
		
		.link {
			color: #07c160;
		}
	}
}

.dialog {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	z-index: 9999;
	
	.dialog-mask {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: rgba(0, 0, 0, 0.6);
	}
	
	.dialog-content {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		background: #fff;
		border-radius: 20rpx;
		padding: 40rpx;
		width: 600rpx;
		
		.dialog-title {
			text-align: center;
			font-size: 32rpx;
			margin-bottom: 40rpx;
		}
		
		.avatar-wrapper {
			width: 160rpx;
			height: 160rpx;
			margin: 0 auto 40rpx;
			padding: 0;
			border-radius: 50%;
			overflow: hidden;
			background: none;
			position: relative;
			
			&::after {
				border: none;
			}
			
			.avatar {
				width: 100%;
				height: 100%;
			}
			
			.avatar-tip {
				position: absolute;
				bottom: 0;
				left: 0;
				right: 0;
				background: rgba(0,0,0,0.5);
				color: #fff;
				font-size: 20rpx;
				text-align: center;
				padding: 4rpx 0;
			}
		}
		
		.nickname-input {
			border: 1rpx solid #eee;
			height: 80rpx;
			border-radius: 40rpx;
			padding: 0 30rpx;
			margin-bottom: 40rpx;
		}
		
		.confirm-btn {
			background: #07c160;
			color: #fff;
			border-radius: 40rpx;
			height: 80rpx;
			line-height: 80rpx;
			
			&::after {
				border: none;
			}
		}
	}
}
</style> 