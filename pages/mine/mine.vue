<template>
	<view class="mine-container">
		<!-- 用户信息 -->
		<view class="user-info">
			<image class="avatar" :src="avatarUrl" mode="aspectFill"></image>
			<view class="info">
				<text class="nickname">{{nickName}}</text>
				<text class="id">ID: 10086</text>
			</view>
			<button class="edit-btn">编辑资料</button>
		</view>
		
		<!-- 数据统计 -->
		<view class="stats">
			<view class="stat-item">
				<text class="num">12</text>
				<text class="label">我的表白</text>
			</view>
			<view class="stat-item">
				<text class="num">28</text>
				<text class="label">获赞</text>
			</view>
			<view class="stat-item">
				<text class="num">5</text>
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
			avatarUrl: '/static/avatar.png', // 默认头像
			nickName: '未登录',
			menuItems: [
				{ name: '我的表白', icon: 'cuIcon-favor' },
				{ name: '我的评论', icon: 'cuIcon-comment' },
				{ name: '我的点赞', icon: 'cuIcon-appreciate' },
				{ name: '设置', icon: 'cuIcon-settings' }
			]
		}
	},
	onShow() {
		// 每次显示页面时获取最新的用户信息
		this.getUserInfo()
	},
	methods: {
		getUserInfo() {
			const avatarUrl = uni.getStorageSync('avatarUrl')
			const nickName = uni.getStorageSync('nickName')
			
			if (avatarUrl) {
				this.avatarUrl = avatarUrl
			}
			if (nickName) {
				this.nickName = nickName
			}
		},
		handleMenu(item) {
			uni.showToast({
				title: `点击了${item.name}`,
				icon: 'none'
			})
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
	
	.edit-btn {
		font-size: 26rpx;
		color: #07c160;
		background: none;
		border: 1rpx solid #07c160;
		border-radius: 30rpx;
		padding: 10rpx 30rpx;
		
		&::after {
			border: none;
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