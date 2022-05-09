<template>
	<view>
		<u-cell-group>
			<u-cell icon="setting-fill" title="订阅通知管理"></u-cell>
			<u-cell icon="integral-fill" title="订阅规则" :label="cause"></u-cell>
			<u-cell icon="integral-fill" title="使用说明" :label="use"></u-cell>
			<u-cell title="通知数量" :value="userInfo.remarks||0" center></u-cell>
			<u-gap height="80" bgColor="#f1f1f1"></u-gap>
			<u-button text="订阅通知" @click="add"></u-button>
			<u-gap height="80" bgColor="#f1f1f1"></u-gap>
		</u-cell-group>
	</view>
</template>

<script>
	import service from '../../common/service.js';
	export default {
		data() {
			return {
				baseUrl: service.baseUrl + 'user',
				cause: '由于微信订阅规则，点击一次订阅即增加一次通知，通知的数量有限，用完需要再次点击订阅，才可推送信息。',
				use:'用于自动跑步发送通知，消息次数为0则无法发送通知！',
				userInfo:{},
				templateId: 'dDJsBzZyMfMm2XMI0aqYjo1vPzIbJQBNAJqaO0B4SFY'
			}
		},
		onLoad() {
			let userinfo = uni.getStorageSync("USER_INFO");
			let that = this;
			if (userinfo != '' && userinfo != null) {
				let time = (new Date()).valueOf();
				let sign = service.encryp(userinfo.openId, time);
				uni.request({
					url: this.baseUrl + '/getUserInfo?time=' + time + "&sign=" + sign,
					method: "POST",
					header: {
						'content-type': 'application/x-www-form-urlencoded',
					},
					data: {
						openId: userinfo.openId,
						sessionKey: userinfo.sessionKey
					},
					success(res) {
						console.log(res);
						if (res.data.code == 200) {
							that.userInfo = res.data.data;
							uni.setStorageSync("USER_INFO", res.data.data);
						} else {
							uni.redirectTo({
								url: '../login/login'
							});
						}
					}
				})
			} else {
				uni.redirectTo({
					url: '../login/login'
				});
			}
		},
		methods: {
			add(){
				let id = this.templateId;
				let that = this;
				uni.requestSubscribeMessage({
					tmplIds: [id],
					success(res) {
						if (res[id] == 'accept') {
							let time = (new Date()).valueOf();
							let sign = service.encryp(that.userInfo.openId, time);
							let remarks = parseInt(that.userInfo.remarks==""?0:that.userInfo.remarks)+1;
							console.log(remarks)
							uni.request({
								url: that.baseUrl + '/addRemarks?time=' + time + "&sign=" + sign,
								method: "POST",
								header: {
									'content-type': 'application/x-www-form-urlencoded',
								},
								data: {
									openId: that.userInfo.openId,
									sessionKey: that.userInfo.sessionKey,
									remarks: remarks
								},
								success(res) {
									if(res.data.code==200){
										that.$api.msg("订阅成功", "success", 200);
										that.update()
									}else{
										that.$api.msg(res.data.msg, "error");
									}
								}
							})
						} else {
							that.$api.msg("订阅失败", "error");
						}
					},
					fail(res) {
						that.$api.msg("订阅失败", "error");
					}
				})
			},
			update(){
				let that = this;
				let time = (new Date()).valueOf();
				let sign = service.encryp(that.userInfo.openId, time);
				uni.request({
					url: this.baseUrl + '/getUserInfo?time=' + time + "&sign=" + sign,
					method: "POST",
					header: {
						'content-type': 'application/x-www-form-urlencoded',
					},
					data: {
						openId: that.userInfo.openId,
						sessionKey: that.userInfo.sessionKey
					},
					success(res) {
						console.log(res);
						if (res.data.code == 200) {
							that.userInfo = res.data.data;
							uni.setStorageSync("USER_INFO", res.data.data);
						} else {
							uni.redirectTo({
								url: '../login/login'
							});
						}
					}
				})
			}
		}
	}
</script>

<style>

</style>
