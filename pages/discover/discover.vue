<template>
	<view class="discover-container">
		<!-- 搜索框 -->
		<view class="search-box">
			<text class="cuIcon-search"></text>
			<input type="text" placeholder="搜索" placeholder-class="search-placeholder"/>
		</view>
		
		<!-- 热门话题 -->
		<view class="section">
			<view class="section-header">
				<text class="title">热门话题</text>
				<text class="more">更多</text>
			</view>
			<scroll-view scroll-x class="topic-list">
				<view class="topic-item" v-for="(item, index) in topics" :key="index">
					<text class="topic-name">#{{item.name}}#</text>
					<text class="topic-count">{{item.count}}条</text>
				</view>
			</scroll-view>
		</view>
		
		<!-- 推荐内容 -->
		<view class="section">
			<view class="section-header">
				<text class="title">推荐内容</text>
			</view>
			<view class="recommend-list">
				<view class="recommend-item" v-for="(item, index) in recommends" :key="index">
					<text class="content">{{item.content}}</text>
					<view class="stats">
						<text>{{item.likes}}赞</text>
						<text>{{item.comments}}评论</text>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			topics: [
				{ name: '表白大作战', count: 128 },
				{ name: '今日心动', count: 56 },
				{ name: '校园偶遇', count: 89 }
			],
			recommends: [
				{
					content: '遇见你是我最美好的意外...',
					likes: 23,
					comments: 5
				},
				{
					content: '想和你一起看落日余晖...',
					likes: 18,
					comments: 3
				}
			]
		}
	}
}
</script>

<style lang="scss">
.discover-container {
	min-height: 100vh;
	background-color: #f5f5f5;
	padding: 20rpx;
}

.search-box {
	background-color: #fff;
	height: 80rpx;
	border-radius: 40rpx;
	display: flex;
	align-items: center;
	padding: 0 30rpx;
	margin-bottom: 30rpx;
	
	.icon-search {
		font-size: 32rpx;
		color: #999;
		margin-right: 10rpx;
	}
	
	input {
		flex: 1;
		font-size: 28rpx;
	}
	
	.search-placeholder {
		color: #999;
	}
}

.section {
	background-color: #fff;
	border-radius: 12rpx;
	padding: 20rpx;
	margin-bottom: 20rpx;
	
	.section-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 20rpx;
		
		.title {
			font-size: 32rpx;
			font-weight: bold;
			color: #333;
		}
		
		.more {
			font-size: 24rpx;
			color: #999;
		}
	}
}

.topic-list {
	white-space: nowrap;
	
	.topic-item {
		display: inline-block;
		background-color: #f8f8f8;
		padding: 16rpx 30rpx;
		border-radius: 30rpx;
		margin-right: 20rpx;
		
		.topic-name {
			font-size: 26rpx;
			color: #07c160;
			margin-right: 10rpx;
		}
		
		.topic-count {
			font-size: 24rpx;
			color: #999;
		}
	}
}

.recommend-list {
	.recommend-item {
		padding: 20rpx 0;
		border-bottom: 1rpx solid #f5f5f5;
		
		&:last-child {
			border-bottom: none;
		}
		
		.content {
			font-size: 28rpx;
			color: #333;
			line-height: 1.6;
		}
		
		.stats {
			margin-top: 10rpx;
			font-size: 24rpx;
			color: #999;
			
			text {
				margin-right: 20rpx;
			}
		}
	}
}
</style> 