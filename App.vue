<script>
	export default {
		onLaunch: function() {
			console.log('App Launch')
			const updateManager = uni.getUpdateManager();
			updateManager.onCheckForUpdate(function(res) {
				// 请求完新版本信息的回调
				console.log("是否有更新" + res.hasUpdate);
			});
			updateManager.onUpdateReady(function(res) {
				uni.showModal({
					title: '更新提示',
					content: '新版本已经准备好，请确认更新',
					showCancel: false,
					success(res) {
						// 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
						updateManager.applyUpdate();
			
					}
				});
			});
			updateManager.onUpdateFailed(function(res) {
				// 新的版本下载失败
				uni.showModal({
					title: '更新提示',
					content: '新版本下载失败，请退出在试！',
					showCancel: false,
				});
			});
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style lang="scss">
	/*每个页面公共css */ 
	@import '@/uni_modules/uni-scss/index.scss';
	/* uni.css - 通用组件、模板样式库，可以当作一套ui库应用 */
	@import './common/uni.css';

</style>
