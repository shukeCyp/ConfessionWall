<template>
	<view class="post-container">
		<!-- 状态栏占位 -->
		<view class="status-bar" :style="{ height: statusBarHeight + 'px' }"></view>
		
		<!-- 顶部导航栏 -->
		<view class="nav-bar">
			<text class="title">{{postType === 'video' ? '发布视频' : '发布图片'}}</text>
		</view>
		
		<!-- 内容区域 -->
		<view class="content-box">
			<textarea 
				class="content" 
				v-model="content" 
				:placeholder="postType === 'video' ? '添加视频描述...' : '这一刻的想法...'" 
				:maxlength="maxLength"
				auto-height
			/>
		</view>
		
		<!-- 视频预览 -->
		<view class="video-container" v-if="postType === 'video' && mediaList[0]">
			<view class="video-wrapper">
				<image 
					:src="mediaList[0].cover" 
					mode="aspectFill"
					@tap="previewVideo"
					class="video-cover"
					@load="onVideoLoad"
				/>
				<view class="delete-icon" @tap="deleteVideo">
					<image src="/static/delete.png" class="delete-image" />
				</view>
				<text class="play-icon cuIcon-video"></text>
			</view>
		</view>
		
		<!-- 图片九宫格 -->
		<view class="image-container" v-if="postType === 'image'">
			<view class="image-grid">
				<view 
					class="image-item" 
					v-for="(item, index) in mediaList" 
					:key="index"
				>
					<image 
						:src="item.path" 
						mode="aspectFill"
						@tap="previewMedia(index)"
					/>
				</view>
				<view class="add-image" v-if="mediaList.length < 9" @tap="chooseImage">
					<view class="add-icon">+</view>
				</view>
			</view>
		</view>
		
		<!-- 底部按钮 -->
		<view class="bottom-btns">
			<button class="btn cancel" @tap="goBack">取消</button>
			<button class="btn publish" :class="{active: canPublish}" @tap="publish">发表</button>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			statusBarHeight: 0,
			type: 'text',
			postType: '', // 'video' 或 'image'
			content: '',
			maxLength: 1000,
			mediaList: [],
			screenWidth: 0,
			screenHeight: 0,
			isVideoHorizontal: false,
			isRefreshing: false
		}
	},
	onLoad(options) {
		const systemInfo = uni.getSystemInfoSync()
		this.statusBarHeight = systemInfo.statusBarHeight
		
		this.type = options.type || 'text'
		if (options.images) {
			const media = JSON.parse(options.images)
			this.mediaList = media
			this.postType = media[0]?.type || 'image'
		}
		this.screenWidth = systemInfo.windowWidth
		this.screenHeight = systemInfo.windowHeight
	},
	methods: {
		previewVideo() {
			if (!this.mediaList[0]) return
			
			// 使用 video 组件播放视频
			uni.navigateTo({
				url: '/pages/video-player/video-player',
				success: () => {
					// 传递视频信息给播放页面
					uni.$emit('video-data', {
						url: this.mediaList[0].path,
						cover: this.mediaList[0].cover
					})
				}
			})
		},
		
		deleteVideo() {
			uni.showModal({
				title: '提示',
				content: '确定要删除这个视频吗？',
				success: (res) => {
					if (res.confirm) {
						this.mediaList = []
						// 删除后直接返回
						this.goBack()
					}
				}
			})
		},
		
		goBack() {
			uni.navigateBack()
		},
		
		// 预览并支持删除图片
		previewMedia(index) {
			uni.previewImage({
				urls: this.mediaList.map(item => item.path),
				current: index,
				showmenu: true, // 显示操作菜单
				success: () => {
					// 监听预览窗口右上角菜单按钮点击事件
					uni.$once('uni-preview-menu-click', () => {
						uni.showModal({
							title: '提示',
							content: '确定要删除这张图片吗？',
							success: (res) => {
								if (res.confirm) {
									this.mediaList.splice(index, 1)
								}
							}
						})
					})
				}
			})
		},
		
		// 选择图片
		chooseImage() {
			const maxCount = 9 - this.mediaList.length
			if (maxCount <= 0) {
				uni.showToast({
					title: '最多选择9张图片',
					icon: 'none'
				})
				return
			}
			
			uni.chooseImage({
				count: maxCount,
				sizeType: ['compressed'],
				sourceType: ['album'],
				success: (res) => {
					const newImages = res.tempFilePaths.map(path => ({
						type: 'image',
						path: path
					}))
					this.mediaList = [...this.mediaList, ...newImages]
				}
			})
		},
		
		// 监听视频封面图加载完成
		onVideoLoad(e) {
			const { width, height } = e.detail
			this.isVideoHorizontal = width > height
		},
		
		publish() {
			if (!this.canPublish) return
			
			// 获取本地存储的用户ID
			const userId = uni.getStorageSync('userId')
			if (!userId) {
				uni.showToast({
					title: '请先登录',
					icon: 'none'
				})
				return
			}
			
			// 显示loading
			uni.showLoading({
				title: '发布中...',
				mask: true
			})
			
			// 先创建帖子
			uni.request({
				url: `https://confession.lyvideo.top/posts?user_id=${userId}`,
				method: 'POST',
				data: {
					content: this.content.trim()
				},
				header: {
					'accept': 'application/json',
					'Content-Type': 'application/json'
				},
				success: (res) => {
					console.log('帖子创建成功，返回数据：', res.data)
					
					// 如果有图片或视频，继续上传
					if (this.mediaList.length > 0) {
						this.uploadMedia(res.data.id)
							.then(() => {
								uni.hideLoading()
								this.handleUploadComplete()
							})
							.catch(err => {
								uni.hideLoading()
								this.handleUploadError(err)
							})
					} else {
						uni.hideLoading()
						this.handleUploadComplete()
					}
				},
				fail: (err) => {
					console.error('发布失败：', err)
					uni.hideLoading()
					uni.showToast({
						title: '发布失败，请重试',
						icon: 'none'
					})
				}
			})
		},
		
		// 上传媒体文件
		uploadMedia(postId) {
			// 根据媒体类型选择不同的上传方法
			if (this.postType === 'video') {
				return this.uploadVideo(postId)
			} else {
				return this.uploadImages(postId)
			}
		},
		
		// 上传图片
		uploadImages(postId) {
			const uploadTasks = this.mediaList.map(media => {
				return new Promise((resolve, reject) => {
					uni.uploadFile({
						url: `https://confession.lyvideo.top/posts/${postId}/images`,
						filePath: media.path,
						name: 'files',
						formData: {
							post_id: postId
						},
						header: {
							'accept': 'application/json'
						},
						success: (res) => {
							if (res.statusCode === 200) {
								console.log('图片上传成功：', res)
								resolve(res)
							} else {
								const error = JSON.parse(res.data)
								console.error('图片上传失败：', error)
								reject(error)
							}
						},
						fail: (err) => {
							console.error('图片上传失败：', err)
							reject(err)
						}
					})
				})
			})
			
			return Promise.all(uploadTasks)
		},
		
		// 上传视频
		uploadVideo(postId) {
			return new Promise((resolve, reject) => {
				uni.uploadFile({
					url: `https://confession.lyvideo.top/posts/${postId}/video`,
					filePath: this.mediaList[0].path,
					name: 'file',
					formData: {
						post_id: postId
					},
					header: {
						'accept': 'application/json'
					},
					success: (res) => {
						if (res.statusCode === 200) {
							console.log('视频上传成功：', res)
							resolve(res)
						} else {
							const error = JSON.parse(res.data)
							console.error('视频上传失败：', error)
							reject(error)
						}
					},
					fail: (err) => {
						console.error('视频上传失败：', err)
						reject(err)
					}
				})
			})
		},
		
		// 发布完成处理
		handleUploadComplete() {
			uni.showToast({
				title: '发布成功',
				icon: 'success',
				duration: 1500
			})
			setTimeout(() => {
				this.goBack()
			}, 1500)
		},
		
		// 发布失败处理
		handleUploadError(err) {
			console.error('媒体上传失败：', err)
			uni.showToast({
				title: '媒体上传失败，请重试',
				icon: 'none',
				duration: 2000
			})
		},
		
		onRefresh() {
			this.isRefreshing = true
			// 模拟刷新操作
			setTimeout(() => {
				this.isRefreshing = false
			}, 1000)
		}
	},
	computed: {
		canPublish() {
			// 只要有图片或有文字内容就可以发布
			return this.content.trim().length > 0 || this.mediaList.length > 0
		}
	}
}
</script>

<style lang="scss">
.post-container {
	min-height: 100vh;
	background: #fff;
	padding-bottom: 140rpx; // 为底部按钮留出空间
}

.status-bar {
	background: #f8f8f8;
}

.nav-bar {
	display: flex;
	justify-content: center;
	align-items: center;
	padding: 20rpx 30rpx;
	background: #f8f8f8;
	border-bottom: 1rpx solid #eee;
	
	.title {
		font-size: 32rpx;
		color: #333;
		font-weight: normal;
	}
}

.content-box {
	padding: 30rpx;
	
	.content {
		width: 100%;
		min-height: 200rpx;
		font-size: 32rpx;
		line-height: 1.5;
		color: #333;
		&::placeholder {
			color: #999;
		}
	}
}

.video-container {
	padding: 20rpx 30rpx;
	display: flex;
	justify-content: center;
	
	.video-wrapper {
		position: relative;
		width: 50vw; // 宽度最多是屏幕宽度的一半
		height: 50vh; // 高度最高是屏幕高度的一半
		background: #000;
		border-radius: 8rpx;
		overflow: hidden;
		
		.video-cover {
			width: 100%;
			height: 100%;
			object-fit: cover;
		}
		
		.delete-icon {
			position: absolute;
			right: 10rpx;
			top: 10rpx;
			width: 50rpx;
			height: 50rpx;
			background: rgba(0, 0, 0, 0.5);
			border-radius: 50%;
			display: flex;
			align-items: center;
			justify-content: center;
			z-index: 1;
			
			.delete-image {
				width: 30rpx;
				height: 30rpx;
			}
		}
		
		.play-icon {
			position: absolute;
			left: 50%;
			top: 50%;
			transform: translate(-50%, -50%);
			font-size: 80rpx;
			color: rgba(255,255,255,0.8);
		}
	}
}

.image-container {
	padding: 20rpx 30rpx;
	
	.image-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 16rpx;
		
		.image-item {
			position: relative;
			width: 100%;
			padding-bottom: 100%;
			
			image {
				position: absolute;
				width: 100%;
				height: 100%;
				object-fit: cover;
				border-radius: 8rpx;
			}
		}
		
		.add-image {
			position: relative;
			width: 100%;
			padding-bottom: 100%;
			background: #f7f7f7;
			border-radius: 8rpx;
			
			.add-icon {
				position: absolute;
				left: 50%;
				top: 50%;
				transform: translate(-50%, -50%);
				width: 60rpx;
				height: 60rpx;
				line-height: 54rpx; // 微调行高使加号垂直居中
				text-align: center;
				font-size: 60rpx;
				color: #999;
				font-weight: 100;
			}
		}
	}
}

.bottom-btns {
	position: fixed;
	left: 0;
	right: 0;
	bottom: 0;
	display: flex;
	padding: 20rpx 30rpx calc(20rpx + env(safe-area-inset-bottom));
	background: #fff;
	border-top: 1rpx solid #eee;
	
	.btn {
		flex: 1;
		height: 88rpx;
		line-height: 88rpx;
		text-align: center;
		font-size: 32rpx;
		margin: 0 12rpx;
		border-radius: 8rpx;
		
		&.cancel {
			background: #f8f8f8;
			color: #333;
		}
		
		&.publish {
			background: #f8f8f8;
			color: #999;
			
			&.active {
				background: #07c160;
				color: #fff;
			}
		}
		
		&::after {
			border: none;
		}
	}
}
</style> 