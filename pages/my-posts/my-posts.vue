<template>
	<view class="page-container">
		<!-- 顶部状态切换 -->
		<view class="status-tabs">
			<view 
				class="tab-item" 
				:class="{ active: currentStatus === 1 }"
				@tap="switchStatus(1)"
			>已发布</view>
			<view 
				class="tab-item" 
				:class="{ active: currentStatus === 0 }"
				@tap="switchStatus(0)"
			>待审核</view>
		</view>
		
		<scroll-view 
			class="posts-container" 
			scroll-y 
			refresher-enabled 
			:refresher-triggered="isRefreshing"
			@refresherrefresh="onRefresh"
			@scrolltolower="onLoadMore"
		>
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
						<view class="status-tag" :class="{ pending: currentStatus === 0 }">
							{{ currentStatus === 0 ? '审核中' : '' }}
						</view>
					</view>
				</view>
			</view>
			
			<!-- 无数据提示 -->
			<view class="empty-tip" v-if="posts.length === 0">
				<text>{{ currentStatus === 0 ? '暂无待审核的表白' : '暂无已发布的表白' }}</text>
			</view>
		</scroll-view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			currentStatus: 1, // 默认显示已发布的
			isRefreshing: false,
			posts: [],
			page: 1,
			pageSize: 10,
			hasMore: true,
			isLoading: false,
			userId: ''
		}
	},
	onLoad() {
		this.userId = uni.getStorageSync('userId')
		this.loadPosts()
	},
	methods: {
		switchStatus(status) {
			if (this.currentStatus === status) return
			this.currentStatus = status
			this.page = 1
			this.posts = []
			this.hasMore = true
			this.loadPosts()
		},
		
		loadPosts(refresh = false) {
			if (this.isLoading) return
			
			if (refresh) {
				this.page = 1
				this.hasMore = true
			}
			
			this.isLoading = true
			uni.request({
				url: `https://confession.lyvideo.top/user_posts?user_id=${this.userId}&state=${this.currentStatus}&page=${this.page}&page_size=${this.pageSize}`,
				method: 'GET',
				success: (res) => {
					const { data, total_pages } = res.data
					
					const formattedPosts = data.map(post => ({
						id: post.id,
						avatar: post.avatar_url ? `${post.avatar_url}` : '/static/logo.png',
						nickname: post.nickname || '匿名用户',
						content: post.content,
						time: this.formatTime(post.created_at),
						media_list: post.media_list || []
					}))
					
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
		
		formatTime(timeStr) {
			const date = new Date(timeStr)
			const now = new Date()
			const diff = now - date
			
			if (diff < 60000) return '刚刚'
			if (diff < 3600000) return Math.floor(diff / 60000) + '分钟前'
			if (diff < 86400000) return Math.floor(diff / 3600000) + '小时前'
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
		
		previewImage(urls, current) {
			uni.previewImage({
				urls: urls,
				current: urls[current]
			})
		},
		
		playVideo(url) {
			uni.navigateTo({
				url: '/pages/video-player/video-player'
			})
			uni.$emit('video-data', {
				url: url,
				cover: url
			})
		},
		
		handleImageError(e, postIndex, mediaIndex) {
			this.posts[postIndex].media_list[mediaIndex].url = 'static/default-image.png'
		}
	}
}
</script>

<style lang="scss">
.page-container {
	min-height: 100vh;
	background: #fff;
}

.status-tabs {
	display: flex;
	background: #fff;
	padding: 20rpx 0;
	border-bottom: 1rpx solid #eee;
	position: sticky;
	top: 0;
	z-index: 1;
	
	.tab-item {
		flex: 1;
		text-align: center;
		font-size: 28rpx;
		color: #666;
		position: relative;
		padding: 16rpx 0;
		
		&.active {
			color: #07c160;
			font-weight: 500;
			
			&:after {
				content: '';
				position: absolute;
				bottom: 0;
				left: 50%;
				transform: translateX(-50%);
				width: 40rpx;
				height: 4rpx;
				background: #07c160;
				border-radius: 2rpx;
			}
		}
	}
}

.posts-container {
	height: calc(100vh - 100rpx);
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
			
			.status-tag {
				position: absolute;
				right: 0;
				top: 0;
				font-size: 24rpx;
				padding: 4rpx 12rpx;
				border-radius: 4rpx;
				
				&.pending {
					color: #ff9900;
					background: rgba(255, 153, 0, 0.1);
				}
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

.empty-tip {
	text-align: center;
	padding: 60rpx 0;
	color: #999;
	font-size: 28rpx;
}
</style> 