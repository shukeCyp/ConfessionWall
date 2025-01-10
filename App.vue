<script>
	export default {
		onLaunch: function() {
			console.log('App Launch')
			// 检查登录状态
			this.checkLoginStatus()
		},
		methods: {
			checkLoginStatus() {
				try {
					const openid = uni.getStorageSync('openid')
					if (!openid) {
						console.log('未登录，跳转到登录页')
						uni.reLaunch({
							url: '/pages/login/login'
						})
					} else {
						console.log('已登录，openid:', openid)
					}
				} catch (e) {
					console.error('检查登录状态失败：', e)
					uni.reLaunch({
						url: '/pages/login/login'
					})
				}
			}
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style>
	/* 每个页面公共css */
	@import "./colorui/main.css";
	@import "./colorui/icon.css";

	page {
		background-color: #f5f5f5;
	}
</style>
