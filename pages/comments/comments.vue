<template>
	<view class="comments-container">
		<!-- 评论列表 -->
		<scroll-view scroll-y class="comments-list">
			<view class="comment-item" v-for="(comment, index) in comments" :key="index">
				<image class="avatar" :src="comment.avatar || '/static/logo.png'" mode="aspectFill"></image>
				<view class="comment-content">
					<view class="comment-header">
						<text class="nickname">{{comment.nickname}}</text>
						<text class="time">{{comment.time}}</text>
					</view>
					<view class="text">{{comment.content}}</view>
				</view>
			</view>
		</scroll-view>
		
		<!-- 评论输入框 -->
		<view class="comment-input">
			<input type="text" 
				v-model="newComment" 
				placeholder="说点什么..." 
				confirm-type="send"
				@confirm="submitComment"/>
			<button class="send-btn" @tap="submitComment">发送</button>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			postId: null,
			comments: [],
			newComment: ''
		}
	},
	onLoad(options) {
		this.postId = options.postId
		// 获取帖子的评论列表
		this.getComments()
	},
	methods: {
		getComments() {
			// 这里应该调用接口获取评论列表
			// 暂时使用本地数据
			this.comments = this.posts[this.postId].comments
		},
		submitComment() {
			if (!this.newComment.trim()) {
				return
			}
			// 这里应该调用接口提交评论
			// 暂时只是本地添加
			this.comments.unshift({
				nickname: '我',
				content: this.newComment,
				time: '刚刚',
				avatar: uni.getStorageSync('avatarUrl')
			})
			this.newComment = ''
		}
	}
}
</script>

<style lang="scss">
.comments-container {
	min-height: 100vh;
	background-color: #f7f7f7;
	padding-bottom: 100rpx;
}

.comments-list {
	padding: 20rpx;
	
	.comment-item {
		display: flex;
		padding: 20rpx;
		background-color: #fff;
		margin-bottom: 20rpx;
		border-radius: 12rpx;
		
		.avatar {
			width: 80rpx;
			height: 80rpx;
			border-radius: 8rpx;
			margin-right: 20rpx;
		}
		
		.comment-content {
			flex: 1;
			
			.comment-header {
				display: flex;
				justify-content: space-between;
				align-items: center;
				margin-bottom: 10rpx;
				
				.nickname {
					font-size: 28rpx;
					color: #576b95;
					font-weight: 500;
				}
				
				.time {
					font-size: 24rpx;
					color: #999;
				}
			}
			
			.text {
				font-size: 28rpx;
				color: #333;
				line-height: 1.6;
			}
		}
	}
}

.comment-input {
	position: fixed;
	bottom: 0;
	left: 0;
	right: 0;
	display: flex;
	align-items: center;
	padding: 20rpx;
	background-color: #fff;
	border-top: 1rpx solid #eee;
	
	input {
		flex: 1;
		height: 72rpx;
		background-color: #f7f7f7;
		border-radius: 36rpx;
		padding: 0 30rpx;
		font-size: 28rpx;
		margin-right: 20rpx;
	}
	
	.send-btn {
		width: 120rpx;
		height: 72rpx;
		background-color: #07c160;
		color: #fff;
		border-radius: 36rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 28rpx;
		
		&:active {
			opacity: 0.8;
		}
	}
}
</style> 