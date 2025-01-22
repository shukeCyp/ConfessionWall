<template>
	<view class="mine-container">
		<!-- 用户信息 -->
		<view class="user-info">
			<image class="avatar" :src="avatarUrl" mode="aspectFill"></image>
			<view class="info">
				<text class="nickname">{{nickName || '未登录'}}</text>
				<text class="id" v-if="userId">ID: {{userId}}</text>
			</view>
			<!-- 未登录显示登录按钮，已登录不显示编辑按钮 -->
			<button v-if="!userId" class="login-btn" @tap="goToLogin">点击登录</button>
		</view>
		
		<!-- 数据统计 -->
		<view class="stats">
			<view class="stat-item">
				<text class="num">{{userId ? userStats.totalPosts : '--'}}</text>
				<text class="label">我的表白</text>
			</view>
			<view class="stat-item">
				<text class="num">{{userId ? userStats.likes : '--'}}</text>
				<text class="label">获赞</text>
			</view>
			<view class="stat-item">
				<text class="num">{{userId ? userStats.comments : '--'}}</text>
				<text class="label">评论</text>
			</view>
		</view>
		
		<!-- 功能列表 -->
		<view class="menu-list">
			<view class="menu-item" v-for="(item, index) in menuItems" :key="index" @tap="handleMenu(item)">
				<view class="left">
					<text class="cuIcon" :class="item.icon"></text>
					<text class="label">{{item.name}}</text>
				</view>
				<text class="cuIcon-right"></text>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			avatarUrl: '',
			nickName: '',
			userId: '',
			userStats: {
				postCount: 0,
				pendingCount: 0,
				rejectedCount: 0,
				totalPosts: 0, // 总帖子数
				likes: 0,      // 获赞数
				comments: 0    // 评论数
			},
			menuItems: [
				{ name: '我的表白', icon: 'cuIcon-favor' }
				// { name: '我的评论', icon: 'cuIcon-comment' },
				// { name: '我的点赞', icon: 'cuIcon-appreciate' },
				// { name: '设置', icon: 'cuIcon-settings' }
			]
		}
	},
	onShow() {
		// 从本地存储获取用户信息
		this.userId = uni.getStorageSync('userId')
		if (this.userId) {
			this.loadUserInfo()
		} else {
			this.avatarUrl = ''
			this.nickName = ''
			this.resetUserStats()
		}
	},
	methods: {
		// 重置用户统计数据
		resetUserStats() {
			this.userStats = {
				postCount: 0,
				pendingCount: 0,
				rejectedCount: 0,
				totalPosts: 0,
				likes: 0,
				comments: 0
			}
		},
		
		// 加载用户信息
		loadUserInfo() {
			uni.request({
				url: `https://confession.lyvideo.top/get_userinfo/${this.userId}`,
				method: 'GET',
				success: (res) => {
					if (res.data) {
						this.avatarUrl = res.data.avatar_url
						this.nickName = res.data.nickname
						
						// 更新统计数据
						this.userStats.postCount = res.data.post_count || 0
						this.userStats.pendingCount = res.data.pending_count || 0
						this.userStats.rejectedCount = res.data.rejected_count || 0
						this.userStats.totalPosts = this.userStats.postCount + 
							this.userStats.pendingCount + 
							this.userStats.rejectedCount
						
						// 获赞和评论数暂时写死为0
						this.userStats.likes = 0
						this.userStats.comments = 0
						
						// 保存到本地存储
						uni.setStorageSync('avatarUrl', this.avatarUrl)
						uni.setStorageSync('nickName', this.nickName)
					}
				},
				fail: (err) => {
					console.error('获取用户信息失败：', err)
				}
			})
		},
		
		goToLogin() {
			uni.navigateTo({
				url: '/pages/login/login'
			})
		},
		handleMenu(item) {
			if (!this.userId) {
				uni.showModal({
					title: '提示',
					content: '请先登录',
					success: (res) => {
						if (res.confirm) {
							this.goToLogin()
						}
					}
				})
				return
			}
			
			// 根据菜单项处理跳转
			switch(item.name) {
				case '我的表白':
					uni.navigateTo({
						url: '/pages/my-posts/my-posts'
					})
					break;
				case '我的评论':
					uni.showToast({
						title: '评论功能开发中',
						icon: 'none'
					})
					break;
				case '我的点赞':
					uni.showToast({
						title: '点赞功能开发中',
						icon: 'none'
					})
					break;
				case '设置':
					uni.showToast({
						title: '设置功能开发中',
						icon: 'none'
					})
					break;
			}
		}
	}
}
</script>

<style lang="scss">
.mine-container {
	min-height: 100vh;
	background-color: #f5f5f5;
}

.user-info {
	background-color: #fff;
	padding: 40rpx 30rpx;
	display: flex;
	align-items: center;
	
	.avatar {
		width: 120rpx;
		height: 120rpx;
		border-radius: 50%;
		margin-right: 20rpx;
	}
	
	.info {
		flex: 1;
		display: flex;
		flex-direction: column;
		
		.nickname {
			font-size: 32rpx;
			font-weight: bold;
			color: #333;
		}
		
		.id {
			font-size: 24rpx;
			color: #999;
			margin-top: 6rpx;
		}
	}
	
	.login-btn {
		font-size: 26rpx;
		color: #07c160;
		background: none;
		border: 1rpx solid #07c160;
		border-radius: 30rpx;
		padding: 10rpx 30rpx;
		
		&::after {
			border: none;
		}
		
		&:active {
			opacity: 0.8;
		}
	}
}

.stats {
	background-color: #fff;
	display: flex;
	padding: 30rpx 0;
	margin-bottom: 20rpx;
	
	.stat-item {
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		position: relative;
		
		&:not(:last-child):after {
			content: '';
			position: absolute;
			right: 0;
			top: 50%;
			transform: translateY(-50%);
			width: 1rpx;
			height: 40rpx;
			background-color: #eee;
		}
		
		.num {
			font-size: 36rpx;
			color: #333;
			font-weight: bold;
		}
		
		.label {
			font-size: 24rpx;
			color: #999;
			margin-top: 6rpx;
		}
	}
}

.menu-list {
	background-color: #fff;
	
	.menu-item {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 30rpx;
		border-bottom: 1rpx solid #f5f5f5;
		
		.left {
			display: flex;
			align-items: center;
			
			.iconfont {
				font-size: 40rpx;
				color: #07c160;
				margin-right: 20rpx;
			}
			
			.label {
				font-size: 28rpx;
				color: #333;
			}
		}
		
		.icon-arrow-right {
			font-size: 24rpx;
			color: #999;
		}
	}
}
</style> 