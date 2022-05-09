<template>
	<view>
		<!-- <view class="top-right-corner"></view> -->
		<view class="lower-left-corner"></view>
		
		<view class="form-box">
			<view class="logo">
				登录小米运动账号！
			</view>
			<view class="input-box">
				<view class="row-box">
					<text>账号</text>
					<input v-model="username" />
				</view>
				<view class="row-box">
					<text>密码</text>
					<input :password="true" v-model="password" />
				</view>
				<view class="row-box">
					<text>步数</text>
					<input v-model="step" type="number" />
				</view>
			</view>
			<u-button class="login-btn" type="primary" @click="setMotion">
				修改
			</u-button>
			<view class="other-link">
				
				<view>使用方法?<text class="sign" @tap="goHelp">教程</text></view>
				<view style="margin-top: 30rpx;color: #ff601c;font-size: 40rpx;" @click="goAuto">自动跑步</view>
			</view>
		</view>
		<wyb-loading ref="loading"/>
	</view>
</template>

<script>
	import service from '../../common/service.js';

import wybLoading from '@/components/wyb-loading/wyb-loading.vue'
	export default {
		components: {
		
		wybLoading
		},
		data() {
			return {
				webUrl: service.webUrl,
				baseUrl: service.baseUrl+'motion',
				username: '',
				password: '',
				step: '',
			}
		},
		onLoad() {
			let info = uni.getStorageSync("Motion");
			this.username = info.username;
			this.password = info.password;
		},
		methods: {
			setMotion() {
				let userInfo = uni.getStorageSync("USER_INFO");
				let that = this;
				if (userInfo == null || userInfo == "") {
					uni.showToast({
						title: "请先登录！",
						icon: "none",
						duration: 500,
						success() {
							uni.redirectTo({
								url: '../login/login'
							});
						}
					});
					return;
				}
				this.$refs.loading.showLoading() // 显示
				let time = (new Date()).valueOf();
				let sign = service.encryp(userInfo.openId, time);
				uni.request({
					url: this.baseUrl + '/go?time='+time+"&sign="+sign,
					method: "POST",
					header: {
						'content-type': 'application/x-www-form-urlencoded',
					},
					data: {
						openId: userInfo.openId,
						userPhone: this.username,
						userPassword:this.password,
						userStep:this.step
					},
					success(res) {
						console.log(res)
						that.$refs.loading.hideLoading() // 隐藏
						uni.showToast({
							icon:res.data.code==200?'success':'error',
							title:res.data.msg
						})
						uni.setStorageSync("Motion",{username:that.username,password:that.password})
					},fail(e) {
						console.log(e);
						that.$refs.loading.hideLoading() // 隐藏
					}
				})
			},
			goHelp() {
				uni.navigateTo({
					url: "./help"
				})
			},
			goAuto() {
				uni.navigateTo({
					url: "./autoMotion"
				})
			},
		}
	}
</script>

<style lang="scss">
	page {
		background-color: #ffffff;
	}

	.top-right-corner {
		position: fixed;
		top: -280rpx;
		right: -280rpx;
		width: 400rpx;
		height: 400rpx;
		background-color: #FFFFFF;
		border: 100rpx solid #ffdddf;
		border-radius: 100%;
		z-index: 1;
	}

	.lower-left-corner {
		position: fixed;
		bottom: -450rpx;
		left: -200rpx;
		width: 400rpx;
		height: 400rpx;
		background-color: #FFFFFF;
		border: 100rpx solid #c7e1fa;
		transform: rotate(-45deg);
		z-index: 1;
	}

	.form-box {
		margin: 100rpx 80rpx;
		z-index: 100;

		.logo {
			display: flex;
			justify-content: center;
			align-items: flex-end;
			height: 100rpx;
			font-size: 50rpx;
			letter-spacing: 5rpx;
			font-weight: bold;

		}

		.input-box {
			margin-top: 100rpx;

			.row-box {
				margin: 20rpx 0;
				padding: 10rpx 30rpx;
				display: flex;
				flex-direction: column;
				justify-content: space-around;
				height: 110rpx;
				background-color: #f8f7fc;
				border-radius: 8rpx;

				text {
					line-height: 60rpx;
					font-size: 30rpx;
					color: #999ca1;
					font-weight: 600;
				}
			}
		}

		.login-btn {
			margin: 70rpx 0rpx 50rpx 0rpx;
			display: flex;
			justify-content: center;
			align-items: center;
			color: #FFFFFF;
			font-size: 35rpx;
			height: 110rpx;
			font-weight: bold;
			background-color: #f64068;
		}

		.other-link {
			height: 80rpx;
			display: flex;
			justify-content: space-between;
			align-items: flex-end;
			font-size: 28rpx;
			font-weight: bold;
			letter-spacing: 3rpx;

			.sign {
				color: #f987a1;
			}
		}
	}

	.hovers {
		background-color: #999;
	}
</style>
