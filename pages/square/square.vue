<template>
	<view class="page-container">
		<scroll-view 
			class="square-container" 
			scroll-y 
			refresher-enabled 
			:refresher-triggered="isRefreshing"
			@refresherrefresh="onRefresh"
			@scrolltolower="onLoadMore"
		>
			<!-- 轮播图区域 -->
			<swiper class="banner" circular autoplay interval="3000" duration="500">
				<swiper-item v-for="(item, index) in bannerList" :key="index">
					<image :src="item.image" mode="aspectFill"></image>
				</swiper-item>
			</swiper>
			
			<!-- 帖子列表 -->
			<view class="post-list">
				<view class="post-item" v-for="(item, index) in posts" :key="index">
					<!-- 头像和用户信息 -->
					<image class="avatar" :src="item.avatar" mode="aspectFill"></image>
					<view class="content-box">
						<view class="nickname">{{item.nickname}}</view>
						<view class="content" :class="{'empty-content': !item.content}">
							{{item.content}}
						</view>
						
						<!-- 图片展示区域 -->
						<view class="image-grid" v-if="item.media_list && item.media_list[0]?.type === 0">
							<image 
								v-for="(media, mediaIndex) in item.media_list" 
								:key="mediaIndex"
								:src="`https://${media.url}`"
								mode="aspectFill"
								@tap="previewImage(item.media_list.map(m => `https://${m.url}`), mediaIndex)"
								@error="handleImageError($event, index, mediaIndex)"
							/>
						</view>
						
						<!-- 视频展示区域 -->
						<view class="video-container" v-if="item.media_list && item.media_list[0]?.type === 1">
							<view class="video-wrapper">
								<video 
									:src="`https://${item.media_list[0].url}`"
									:poster="`https://${item.media_list[0].url}?x-oss-process=video/snapshot,t_1000,f_jpg`"
									object-fit="contain"
									@tap="playVideo(item.media_list[0].url)"
									:style="{
										width: '40vw',
										aspectRatio: `${item.media_list[0].width} / ${item.media_list[0].height}`
									}"
									show-play-btn="true"
									controls="{{false}}"
									show-center-play-btn="{{false}}"
								></video>
							</view>
						</view>
						
						<view class="time">{{item.time}}</view>
						<view class="action-menu">
							<text class="cuIcon-more"></text>
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
				{ image: '/static/banner.png' },
				{ image: '/static/banner.png' },
				{ image: '/static/banner.png' }
			],
			posts: [],
			page: 1,
			pageSize: 10,
			hasMore: true,
			isLoading: false,
			screenWidth: 0
		}
	},
	onLoad() {
		// 获取屏幕宽度
		const systemInfo = uni.getSystemInfoSync()
		this.screenWidth = systemInfo.windowWidth
		this.loadPosts()
	},
	methods: {
		loadPosts(refresh = false) {
			if (this.isLoading) return
			
			if (refresh) {
				this.page = 1
				this.hasMore = true
			}
			
			this.isLoading = true
			uni.request({
				url: `https://confession.lyvideo.top/get_posts?state=1&page=${this.page}&page_size=${this.pageSize}`,
				method: 'GET',
				success: (res) => {
					const { data, total_pages } = res.data
					console.log('API返回的原始数据：', data)
					
					const formattedPosts = data.map(post => {
						// 基础数据
						const formattedPost = {
							id: post.id,
							avatar: post.avatar_url ? `${post.avatar_url}` : '/static/logo.png',
							nickname: post.nickname || '匿名用户',
							content: post.content,
							time: this.formatTime(post.created_at),
							media_list: post.media_list || []
						}
						
						// 打印每个帖子的媒体列表
						console.log('帖子ID:', post.id, '的媒体列表:', post.media_list)
						
						return formattedPost
					})
					
					if (refresh) {
						this.posts = formattedPosts
					} else {
						this.posts = [...this.posts, ...formattedPosts]
					}
					
					this.hasMore = this.page < total_pages
					if (this.hasMore) {
						this.page++
					}
				},
				complete: () => {
					this.isLoading = false
					if (refresh) {
						this.isRefreshing = false
					}
				}
			})
		},
		
		// 格式化时间
		formatTime(timeStr) {
			const date = new Date(timeStr)
			const now = new Date()
			const diff = now - date
			
			// 小于1分钟
			if (diff < 60000) {
				return '刚刚'
			}
			// 小于1小时
			if (diff < 3600000) {
				return Math.floor(diff / 60000) + '分钟前'
			}
			// 小于24小时
			if (diff < 86400000) {
				return Math.floor(diff / 3600000) + '小时前'
			}
			// 大于24小时
			return Math.floor(diff / 86400000) + '天前'
		},
		
		onRefresh() {
			this.isRefreshing = true
			this.loadPosts(true)
		},
		
		onLoadMore() {
			if (this.hasMore && !this.isLoading) {
				this.loadPosts()
			}
		},
		
		// 添加图片预览方法
		previewImage(urls, current) {
			console.log('预览图片URLs:', urls)
			uni.previewImage({
				urls: urls,
				current: urls[current]
			})
		},
		// 检查登录状态
		checkLogin() {
			const userId = uni.getStorageSync('userId')
			if (!userId) {
				uni.showModal({
					title: '提示',
					content: '请先登录',
					success: (res) => {
						if (res.confirm) {
							uni.navigateTo({
								url: '/pages/login/login'
							})
						}
					}
				})
				return false
			}
			return true
		},
		handleLike(index) {
			if (!this.checkLogin()) return
			
			this.posts[index].isLiked = !this.posts[index].isLiked
			this.posts[index].likes += this.posts[index].isLiked ? 1 : -1
		},

		handleComment(index) {
			if (!this.checkLogin()) return
			
			uni.showToast({
				title: '评论功能开发中',
				icon: 'none'
			})
		},
		
		showActionSheet() {
			if (!this.checkLogin()) return
			
			// 直接跳转到相应页面
			const handlePublish = (type) => {
				if (type === 'text') {
					uni.navigateTo({
						url: '/pages/post/post?type=text'
					})
				} else if (type === 'image') {
					uni.chooseImage({
						count: 9,
						sizeType: ['compressed'],
						sourceType: ['album'],
						success: (res) => {
							const images = res.tempFilePaths.map(path => ({
								type: 'image',
								path: path
							}))
							uni.navigateTo({
								url: `/pages/post/post?type=image&images=${JSON.stringify(images)}`
							})
						}
					})
				} else {
					uni.chooseVideo({
						sourceType: ['album'],
						maxDuration: 60,
						camera: 'back',
						success: (res) => {
							const video = [{
								type: 'video',
								path: res.tempFilePath,
								cover: res.thumbTempFilePath
							}]
							uni.navigateTo({
								url: `/pages/post/post?type=image&images=${JSON.stringify(video)}`
							})
						}
					})
				}
			}
			
			// 直接显示菜单并处理选择
			uni.showActionSheet({
				itemList: ['发布文字', '发布图片'],
				success: (res) => {
					const types = ['text', 'image']
					handlePublish(types[res.tapIndex])
				}
			})
		},
		
		hidePopup() {
			this.$refs.popup && this.$refs.popup.close()
		},
		
		handleAction(type) {
			this.hidePopup()
			if(type === 'text') {
				uni.navigateTo({
					url: '/pages/post/post?type=text'
				})
			} else if(type === 'image') {
				uni.navigateTo({
					url: '/pages/post/post?type=image'
				})
			}
		},
		// 查看全部评论
		viewAllComments(postIndex) {
			if (!this.checkLogin()) return
			
			uni.navigateTo({
				url: `/pages/comments/comments?postId=${postIndex}`
			})
		},
		// 监听弹窗状态变化
		popupChange(e) {
			console.log('popup status:', e.show)
		},
		// 添加视频播放方法
		playVideo(url) {
			uni.navigateTo({
				url: '/pages/video-player/video-player'
			})
			// 传递视频数据
			uni.$emit('video-data', {
				url: url,
				cover: url
			})
		},
		// 计算视频显示宽度
		getVideoWidth(media) {
			const maxWidth = this.screenWidth * 0.4 // 屏幕宽度的40%
			const ratio = media.width / media.height
			return Math.min(maxWidth, media.width)
		},
		
		// 计算视频显示高度
		getVideoHeight(media) {
			const width = this.getVideoWidth(media)
			return width / (media.width / media.height)
		},
		handleImageError(e, postIndex, mediaIndex) {
			// 设置默认图片
			this.posts[postIndex].media_list[mediaIndex].url = 'static/default-image.png'
		}
	}
}
</script>

<style lang="scss">
.square-container {
	height: 100vh;
	background: #fff;
}

.banner {
	height: 300rpx;
	
	image {
		width: 100%;
		height: 100%;
	}
}

.post-list {
	padding: 0;
	
	.post-item {
		background: #fff;
		padding: 24rpx 32rpx;
		border-bottom: 1rpx solid #e0e0e0;
		display: flex;
		
		.avatar {
			width: 80rpx;
			height: 80rpx;
			border-radius: 8rpx;
			margin-right: 24rpx;
			flex-shrink: 0;
		}
		
		.content-box {
			flex: 1;
			position: relative;
			
			.nickname {
				font-size: 32rpx;
				color: #576b95;
				margin-bottom: 16rpx;
			}
			
			.content {
				font-size: 32rpx;
				color: #333;
				line-height: 1.5;
				margin-bottom: 20rpx;
				min-height: 45rpx;
				
				&.empty-content {
					margin-bottom: 24rpx;
				}
			}
			
			.time {
				font-size: 24rpx;
				color: #999;
			}
			
			.action-menu {
				position: absolute;
				right: 0;
				top: 0;
				color: #999;
				padding: 10rpx;
			}
			
			.image-grid {
				display: grid;
				grid-template-columns: repeat(3, 1fr);
				gap: 6rpx;
				margin: 16rpx 0;
				
				image {
					width: 100%;
					aspect-ratio: 1;
					height: auto;
					border-radius: 8rpx;
				}
			}
			
			.video-container {
				margin: 16rpx 0;
				
				.video-wrapper {
					position: relative;
					display: inline-block;
					border-radius: 8rpx;
					overflow: hidden;
					background: #000;
					
					video {
						display: block;
						border-radius: 8rpx;
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
	background: #f8f8f8;
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
	}
}

.action-sheet {
	background: #fff;
	border-radius: 20rpx 20rpx 0 0;
	padding-bottom: env(safe-area-inset-bottom);
	
	.action-item {
		height: 110rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 32rpx;
		color: #333;
		border-bottom: 1rpx solid #eee;
		
		&:active {
			background-color: #f5f5f5;
		}
		
		&.cancel {
			color: #999;
			margin-top: 16rpx;
			border-bottom: none;
		}
	}
}
</style> 