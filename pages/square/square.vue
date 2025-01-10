<template>
	<view class="square-container">
		<!-- 轮播图区域 -->
		<swiper class="banner" circular autoplay interval="3000" duration="500">
			<swiper-item v-for="(item, index) in bannerList" :key="index">
				<image :src="item.image" mode="aspectFill" @tap="handleBanner(item)"></image>
			</swiper-item>
		</swiper>
		
		<!-- 帖子列表 -->
		<scroll-view scroll-y class="post-list" refresher-enabled @refresherrefresh="onRefresh" 
			:refresher-triggered="isRefreshing">
			<!-- 列表顶部提示 -->
			<view class="list-header">
				<text>下拉刷新内容</text>
			</view>
			
			<view class="post-item" v-for="(item, index) in posts" :key="index">
				<!-- 头像和用户信息 -->
				<image class="avatar" :src="item.avatar" mode="aspectFill"></image>
				<view class="content-box">
					<view class="nickname">{{item.nickname}}</view>
					<view class="content">{{item.content}}</view>
					
					<!-- 媒体内容区域 -->
					<block v-if="item.type === 'image'">
						<view class="single-image">
							<image :src="item.images[0]" mode="widthFix" @tap="previewImage(item.images, 0)"></image>
						</view>
					</block>
					
					<block v-if="item.type === 'images'">
						<view class="grid-images">
							<image v-for="(img, imgIndex) in item.images" 
								:key="imgIndex" 
								:src="img" 
								mode="aspectFill"
								@tap="previewImage(item.images, imgIndex)">
							</image>
						</view>
					</block>
					
					<block v-if="item.type === 'video'">
						<view class="video-container">
							<video :src="item.video" 
								:poster="item.videoCover"
								object-fit="cover"
								@tap="playVideo">
							</video>
						</view>
					</block>
					
					<!-- 互动信息 -->
					<view class="interaction-info">
						<text class="time">{{item.time}}</text>
						<view class="actions">
							<view class="action-item" @tap="handleLike(index)">
								<text :class="['cuIcon-appreciate', {'active': item.isLiked}]"></text>
							</view>
							<view class="action-item" @tap="handleComment(index)">
								<text class="cuIcon-comment"></text>
							</view>
						</view>
					</view>
					
					<!-- 点赞和评论区域 -->
					<view class="interaction-box" v-if="item.likes > 0 || item.comments.length > 0">
						<!-- 点赞列表 -->
						<view class="like-list" v-if="item.likes > 0">
							<text class="cuIcon-heart" style="color: #ff5649;"></text>
							<text>{{item.likeUsers.join('、')}}等{{item.likes}}人点赞</text>
						</view>
						
						<!-- 评论列表 -->
						<view class="comment-list" v-if="item.comments.length > 0">
							<!-- 显示前5条评论 -->
							<view class="comment-item" v-for="(comment, cIndex) in item.comments.slice(0, 5)" :key="cIndex">
								<text class="comment-user">{{comment.nickname}}</text>
								<text class="comment-content">：{{comment.content}}</text>
							</view>
							<!-- 如果评论数超过5条，显示查看更多 -->
							<view class="view-more" v-if="item.comments.length > 5" @tap="viewAllComments(index)">
								查看全部{{item.comments.length}}条评论 >
							</view>
						</view>
					</view>
				</view>
			</view>
		</scroll-view>
		
		<!-- 悬浮按钮 -->
		<view class="float-btn" @tap="showActionSheet">
			<text class="plus-icon">+</text>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			isRefreshing: false,
			bannerList: [
				{ image: '/static/banner.png', url: '' },
				{ image: '/static/banner.png', url: '' },
				{ image: '/static/banner.png', url: '' }
			],
			posts: [
				// 纯文本
				{
					avatar: '/static/logo.png',
					nickname: '匿名用户',
					time: '刚刚',
					content: '今天天气真好，想和你一起散步',
					type: 'text',
					likes: 12,
					likeUsers: ['张三', '李四', '王五'],
					comments: [
						{
							nickname: '张三',
							content: '真不错呢！',
							time: '5分钟前'
						},
						{
							nickname: '李四',
							content: '校园生活真美好',
							time: '3分钟前'
						},
						{
							nickname: '王五',
							content: '期待遇见你',
							time: '2分钟前'
						},
						{
							nickname: '赵六',
							content: '加油加油！',
							time: '1分钟前'
						},
						{
							nickname: '小明',
							content: '太棒了',
							time: '刚刚'
						},
						{
							nickname: '小红',
							content: '继续努力',
							time: '刚刚'
						}
					],
					isLiked: false
				},
				// 单图文
				{
					avatar: '/static/logo.png',
					nickname: '匿名用户',
					time: '5分钟前',
					content: '期待与你相遇在校园的每个角落',
					type: 'image',
					images: ['/static/banner.png'],
					likes: 8,
					likeUsers: ['张三', '李四'],
					comments: [
						{
							nickname: '张三',
							content: '真不错呢！',
							time: '5分钟前'
						},
						{
							nickname: '李四',
							content: '校园生活真美好',
							time: '3分钟前'
						},
						{
							nickname: '王五',
							content: '期待遇见你',
							time: '2分钟前'
						},
						{
							nickname: '赵六',
							content: '加油加油！',
							time: '1分钟前'
						},
						{
							nickname: '小明',
							content: '太棒了',
							time: '刚刚'
						},
						{
							nickname: '小红',
							content: '继续努力',
							time: '刚刚'
						}
					],
					isLiked: false
				},
				// 九宫格
				{
					avatar: '/static/logo.png',
					nickname: '匿名用户',
					time: '10分钟前',
					content: '美好的校园生活',
					type: 'images',
					images: [
						'/static/banner.png',
						'/static/banner.png',
						'/static/banner.png',
						'/static/banner.png',
						'/static/banner.png',
						'/static/banner.png',
						'/static/banner.png',
						'/static/banner.png',
						'/static/banner.png'
					],
					likes: 15,
					likeUsers: ['张三', '李四', '王五'],
					comments: [
						{
							nickname: '张三',
							content: '真不错呢！',
							time: '5分钟前'
						},
						{
							nickname: '李四',
							content: '校园生活真美好',
							time: '3分钟前'
						},
						{
							nickname: '王五',
							content: '期待遇见你',
							time: '2分钟前'
						},
						{
							nickname: '赵六',
							content: '加油加油！',
							time: '1分钟前'
						},
						{
							nickname: '小明',
							content: '太棒了',
							time: '刚刚'
						},
						{
							nickname: '小红',
							content: '继续努力',
							time: '刚刚'
						}
					],
					isLiked: false
				},
				// 视频
				{
					avatar: '/static/logo.png',
					nickname: '匿名用户',
					time: '30分钟前',
					content: '校园的一天',
					type: 'video',
					video: '/static/video.mp4',
					videoCover: '/static/banner.png',
					likes: 20,
					likeUsers: ['张三', '李四', '王五'],
					comments: [
						{
							nickname: '张三',
							content: '真不错呢！',
							time: '5分钟前'
						},
						{
							nickname: '李四',
							content: '校园生活真美好',
							time: '3分钟前'
						},
						{
							nickname: '王五',
							content: '期待遇见你',
							time: '2分钟前'
						},
						{
							nickname: '赵六',
							content: '加油加油！',
							time: '1分钟前'
						},
						{
							nickname: '小明',
							content: '太棒了',
							time: '刚刚'
						},
						{
							nickname: '小红',
							content: '继续努力',
							time: '刚刚'
						}
					],
					isLiked: false
				}
			]
		}
	},
	methods: {
		handleBanner(item) {
			if(item.url) {
				uni.navigateTo({
					url: item.url
				})
			}
		},
		onRefresh() {
			this.isRefreshing = true
			// 模拟刷新
			setTimeout(() => {
				this.isRefreshing = false
				uni.showToast({
					title: '刷新成功',
					icon: 'none'
				})
			}, 1000)
		},
		previewImage(images, current) {
			uni.previewImage({
				urls: images,
				current: current
			})
		},
		handleLike(index) {
			this.posts[index].isLiked = !this.posts[index].isLiked
			this.posts[index].likes += this.posts[index].isLiked ? 1 : -1
		},
		handleComment(index) {
			uni.showToast({
				title: '评论功能开发中',
				icon: 'none'
			})
		},
		showActionSheet() {
			uni.showActionSheet({
				itemList: ['发布文字', '发布图片'],
				success: (res) => {
					if(res.tapIndex === 0) {
						uni.navigateTo({
							url: '/pages/post/post?type=text'
						})
					} else if(res.tapIndex === 1) {
						uni.navigateTo({
							url: '/pages/post/post?type=image'
						})
					}
				}
			})
		},
		viewAllComments(postIndex) {
			uni.navigateTo({
				url: `/pages/comments/comments?postId=${postIndex}`
			})
		}
	}
}
</script>

<style lang="scss">
.square-container {
	min-height: 100vh;
	background-color: #f7f7f7;
}

.banner {
	height: 300rpx;
	
	image {
		width: 100%;
		height: 100%;
	}
}

.list-header {
	text-align: center;
	padding: 20rpx 0;
	font-size: 24rpx;
	color: #999;
}

.post-list {
	padding: 0 0 120rpx;
	
	.post-item {
		background-color: #fff;
		padding: 30rpx;
		display: flex;
		border-bottom: 1rpx solid #eee;
		
		.avatar {
			width: 80rpx;
			height: 80rpx;
			border-radius: 8rpx;
			margin-right: 20rpx;
			flex-shrink: 0;
		}
		
		.content-box {
			flex: 1;
			
			.nickname {
				font-size: 30rpx;
				color: #576b95;
				font-weight: 500;
				margin-bottom: 10rpx;
			}
			
			.content {
				font-size: 28rpx;
				color: #333;
				line-height: 1.6;
				margin-bottom: 16rpx;
			}
			
			.single-image {
				margin: 16rpx 0;
				image {
					max-width: 400rpx;
					border-radius: 8rpx;
				}
			}
			
			.grid-images {
				display: grid;
				grid-template-columns: repeat(3, 1fr);
				gap: 6rpx;
				margin: 16rpx 0;
				
				image {
					width: 100%;
					height: 220rpx;
					border-radius: 8rpx;
				}
			}
			
			.video-container {
				margin: 16rpx 0;
				video {
					width: 100%;
					height: 400rpx;
					border-radius: 8rpx;
				}
			}
			
			.interaction-info {
				display: flex;
				justify-content: space-between;
				align-items: center;
				margin-top: 16rpx;
				
				.time {
					font-size: 24rpx;
					color: #999;
				}
			}
			
			.interaction-box {
				margin-top: 16rpx;
				background-color: #f7f7f7;
				border-radius: 6rpx;
				padding: 16rpx;
				
				.like-list {
					display: flex;
					align-items: center;
					font-size: 26rpx;
					color: #576b95;
					
					.cuIcon-heart {
						margin-right: 10rpx;
					}
				}
				
				.comment-list {
					margin-top: 10rpx;
					padding-top: 10rpx;
					border-top: 1rpx solid #eee;
					
					.comment-item {
						font-size: 26rpx;
						line-height: 1.6;
						padding: 6rpx 0;
						
						.comment-user {
							color: #576b95;
							font-weight: 500;
						}
						
						.comment-content {
							color: #333;
						}
					}
					
					.view-more {
						font-size: 26rpx;
						color: #576b95;
						padding: 10rpx 0;
						
						&:active {
							opacity: 0.7;
						}
					}
				}
			}
		}
	}
}

.float-btn {
	position: fixed;
	right: 40rpx;
	bottom: 140rpx;
	width: 100rpx;
	height: 100rpx;
	background: #fff;
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.1);
	z-index: 99;
	
	.plus-icon {
		font-size: 60rpx;
		color: #333;
		height: 60rpx;
		line-height: 54rpx;
		width: 60rpx;
		text-align: center;
		margin: 0;
		padding: 0;
	}
	
	&:active {
		transform: scale(0.95);
	}
}
</style> 