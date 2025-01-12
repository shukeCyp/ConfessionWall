<template>
	<view class="player-container">
		<video 
			:src="videoUrl" 
			:poster="videoCover"
			autoplay
			show-center-play-btn={false}
			controls
			object-fit="contain"
			class="video-player"
			@ended="goBack"
		></video>
	</view>
</template>

<script>
export default {
	data() {
		return {
			videoUrl: '',
			videoCover: ''
		}
	},
	onLoad() {
		// 接收视频数据
		uni.$on('video-data', (data) => {
			this.videoUrl = data.url
			this.videoCover = data.cover
		})
	},
	onUnload() {
		// 清理事件监听
		uni.$off('video-data')
	},
	methods: {
		goBack() {
			uni.navigateBack()
		}
	}
}
</script>

<style lang="scss">
.player-container {
	position: fixed;
	left: 0;
	right: 0;
	top: 0;
	bottom: 0;
	background: #000;
	display: flex;
	align-items: center;
	justify-content: center;
	
	.video-player {
		width: 100%;
		height: 100vh;
	}
}
</style> 