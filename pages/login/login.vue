<template>
	<view class="t-login">
		<view class="t-b">{{title}}</view>
		<form class="cl">
			<view class="t-a">
				<image src="../../static/login/usernumber.png"></image>
				<input name="phone" placeholder="请输入邮箱" />
			</view>
			<view class="t-a">
				<image src="../../static/login/password.png"></image>
				<input name="code" placeholder="验证码" />
				<button style="z-index: 100;" class="t-c" v-on:click.stop="sendMsg()">获取验证码</button>
			</view>
			<button form-type="submit" @click="login">立即登录</button>
		</form>
		<view class="t-f">登录即同意<text>用户协议</text></view>
		<view v-if="!isApp">
			<view class="t-e cl">
				<view class="t-g">
					<uni-icons type="weixin" size="40" color="#46eb00" @click="$refs.popup.open('bottom')"></uni-icons>
					<view style="font-size: 24rpx;font-weight: 100;">微信快速登录</view>
				</view>
			</view>
			<uni-popup ref="popup">
				<view style="background-color: #FFF;padding: 40rpx;text-align: center;">
					<view style="margin-bottom: 30rpx;">
						微信一键登录
					</view>
					<button open-type="getUserInfo" @click="getUserInfo()"
						style="font-size: 30rpx;background-color: #0ab507;color: #FFF;">授权</button>
				</view>
			</uni-popup>
		</view>
		<view v-else>
			<view class="t-e cl">
				<view class="t-g">
					<!-- <uni-icons type="qq" size="40" color="#eb6e70" @click="$refs.popup.open('bottom')"></uni-icons> -->
					<image src="/static/login/qq.png" @click="$refs.popup.open('bottom')"
						style="width: 90px;height: 32px;"></image>
					<view style="font-size: 24rpx;font-weight: 100;">QQ快速登录</view>
				</view>
			</view>
			<uni-popup ref="popup">
				<view style="background-color: #FFF;padding: 40rpx;text-align: center;">
					<view style="margin-bottom: 30rpx;">
						QQ 一键登录
					</view>
					<button @click="QQlogin()" id="qqLoginBtn"
						style="font-size: 30rpx;background-color: #0ab507;color: #FFF;">授权</button>
				</view>
			</uni-popup>
		</view>
	</view>
</template>

<script>
	import service from '../../common/service.js';
	export default {
		data() {
			return {
				baseUrl: service.baseUrl + 'user',
				title: '欢迎回来',
				code: '',
				userInfo: {
					openId: '',
					sessionKey: '',
					nickName: '',
					avatarUrl: '',
					gender: '',
					city: '',
					country: ''
				},
				isApp: false
			}
		},
		onLoad() {
			let that = this;
			//#ifndef MP-WEIXIN
			this.isApp = true
			//#endif
			//#ifdef MP-WEIXIN
			uni.login({
				success(res) {
					that.code = res.code;
					uni.request({
						url: that.baseUrl + '/wxLogin',
						method: "POST",
						header: {
							'content-type': 'application/x-www-form-urlencoded',
						},
						data: {
							code: that.code,
						},
						success(res) {
							console.log(res)
							that.userInfo.openId = res.data.data.openid;
							that.userInfo.sessionKey = res.data.data.session_key;
						}
					})
				}
			});
			//#endif
			setTimeout(() => {
				that.$refs.popup.open('bottom')
			}, 300)

		},
		methods: {
			getUserInfo() {
				let that = this;
				//#ifndef H5
				uni.getUserProfile({
					desc: "获取头像和昵称",
					success(res) {
						console.log(res)
						that.userInfo.avatarUrl = res.userInfo.avatarUrl;
						that.userInfo.nickName = res.userInfo.nickName;
						that.userInfo.gender = res.userInfo.gender;
						that.userInfo.city = res.userInfo.city;
						that.userInfo.country = res.userInfo.country;
						that.saveUserInfo();
					}
				})
				//#endif
			},
			QQlogin() {
				let that = this;
				//#ifdef APP
				uni.login({
					provider: 'qq',
					success: function(loginRes) {
						console.log(loginRes);
						if (loginRes.errMsg == "login:ok") {
							that.userInfo.openId = loginRes.authResult.openid;
							that.userInfo.sessionKey = loginRes.authResult.access_token;
							uni.getUserInfo({
								provider: 'qq',
								success(res) {
									console.log(res);
									if (res.errMsg == "getUserInfo:ok") {
										that.userInfo.avatarUrl = res.userInfo.avatarUrl;
										that.userInfo.nickName = res.userInfo.nickName;
										that.userInfo.gender = res.userInfo.gender == "男" ? "0" : "1";
										that.userInfo.city = res.userInfo.city;
										that.userInfo.country = res.userInfo.province;
										that.saveUserInfo();
									} else {
										uni.showToast({
											title: res.errMsg,
											icon: "none"
										})
									}

								}
							})
						} else {
							uni.showToast({
								title: loginRes.errMsg,
								icon: "none"
							})
						}

					}
				});
				//#endif
				//#ifdef H5

				//#endif
			},
			saveUserInfo() {
				let that = this;
				let time = (new Date()).valueOf();
				let sign = service.encryp(that.userInfo.openId, time);
				uni.request({
					url: that.baseUrl + '/saveUserInfo?time=' + time + "&sign=" + sign,
					method: "POST",
					header: {
						'content-type': 'application/x-www-form-urlencoded',
					},
					data: {
						openId: that.userInfo.openId,
						sessionKey: that.userInfo.sessionKey,
						nickName: that.userInfo.nickName,
						avatarUrl: that.userInfo.avatarUrl,
						gender: that.userInfo.gender,
						city: that.userInfo.city,
						country: that.userInfo.country,
						phone: "",
						password: ""
					},
					success(res) {
						console.log(res)
						if (res.data.code == 200) {
							uni.setStorageSync("USER_INFO", res.data.data);
							uni.showToast({
								title: "登录成功！",
								icon: "success",
								success() {
									setTimeout(() => {
										uni.switchTab({
											url: '/pages/persionInfo/persionInfo'
										});
									}, 1000)

								}
							})

						} else {
							uni.showToast({
								title: res.data.msg,
								icon: "error"
							})
						}
					}
				})
			},
			sendMsg() {
				uni.showToast({
					title: "暂不开通!",
					icon: "error"
				})
			},
			login() {

			}
		}
	}
</script>
<style>
	.t-login {
		width: 600rpx;
		margin: 0 auto;
		font-size: 28rpx;
		color: #000
	}

	.t-login button {
		font-size: 28rpx;
		background: #000;
		color: #fff;
		height: 90rpx;
		line-height: 90rpx;
		border-radius: 50rpx
	}

	.t-login input {
		padding: 0 20rpx 0 120rpx;
		height: 90rpx;
		line-height: 90rpx;
		margin-bottom: 50rpx;
		background: #f4f4f4;
		font-size: 28rpx;
		border-radius: 50rpx
	}

	.t-login .t-a {
		position: relative
	}

	.t-login .t-a image {
		width: 40rpx;
		height: 40rpx;
		position: absolute;
		left: 40rpx;
		top: 28rpx;
		border-right: 2rpx solid #dedede;
		padding-right: 20rpx
	}

	.t-login .t-b {
		text-align: center;
		font-size: 46rpx;
		color: #000;
		padding: 150rpx 0
	}

	.t-login .t-c {
		position: absolute;
		right: 22rpx;
		top: 22rpx;
		background: #000;
		color: #fff;
		font-size: 24rpx;
		border-radius: 50rpx;
		height: 50rpx;
		line-height: 50rpx;
		padding: 0 25rpx
	}

	.t-login .t-d {
		text-align: center;
		color: #999;
		margin: 80rpx 0
	}

	.t-login .t-e {
		text-align: center;
		width: 250rpx;
		margin: 80rpx auto 0
	}

	.t-login .t-g {
		float: left;
		width: 100%
	}

	.t-login .t-e image {
		width: 50rpx;
		height: 50rpx
	}

	.t-login .t-f {
		text-align: center;
		margin: 80rpx 0 0 0;
		color: #666
	}

	.t-login .t-f text {
		margin-left: 8rpx;
		color: #999
	}

	.t-login .uni-input-placeholder {
		color: #000
	}

	.cl {
		zoom: 1
	}

	.cl:after {
		clear: both;
		display: block;
		visibility: hidden;
		height: 0;
		content: '\20'
	}
</style>
