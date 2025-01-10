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
	</view>
</template>

<script>
export default {
	data() {
		return {
			isAgree: false,
			apiBaseUrl: 'https://confession.lyvideo.top'  // 修改为正确的域名
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
			
			// 先获取用户信息
			uni.getUserInfo({
				success: (userRes) => {
					console.log('用户信息：', userRes.userInfo)
					// 存储用户基本信息
					const userInfo = userRes.userInfo
					uni.setStorageSync('avatarUrl', userInfo.avatarUrl)
					uni.setStorageSync('gender', userInfo.gender)
					uni.setStorageSync('nickName', userInfo.nickName)
					
					// 然后进行登录
					this.wxLogin(userInfo)
				},
				fail: (err) => {
					console.error('获取用户信息失败：', err)
					uni.showToast({
						title: '获取用户信息失败',
						icon: 'none'
					})
				}
			})
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
</style> 