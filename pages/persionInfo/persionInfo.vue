<template>
	<view>
		<view class="header">
			<view class="bg">
				<view class="box">
					<view class="box-hd">
						<view class="avator">
							<img :src="userInfo.avatarUrl">
						</view>
						<view class="phone-number">{{userInfo.nickName}}</view>
					</view>
					<view class="box-bd">
						<view class="item" hover-class="hovers" @click="acceptMessage()">
							<view class="icon">
								<uni-icons type="notification" size="30"></uni-icons>
								<view style="position: absolute;top: 0;left: 25px;">
									<u-badge type="success" max="99" :value="userInfo.remarks||0"></u-badge>
								</view>
							</view>
							<view class="text">订阅通知</view>
						</view>
						<view class="item" hover-class="hovers" @click="a()">
							<view style="text-align: center;line-height: 60rpx;font-weight: 600;font-size: 40rpx;">
								<!-- <uni-icons type="wallet-filled" size="30">22</uni-icons> -->
								{{userInfo.value}}
							</view>
							<view class="text">我的积分</view>
						</view>
						<view class="item" style="position: relative;" hover-class="hovers">
							<view class="icon">
								<uni-icons type="chat" size="30"></uni-icons>
							</view>
							<view class="text">我的客服</view>
							<button open-type="contact"
								style="position: absolute;top: 0;left: 0;width: 100%;height: 100%;opacity: 0;"></button>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="list-content">
			<view class="list">
				<view class="li noborder" hover-class="hovers" @click="getHistoy">
					<view class="icon">
						<uni-icons type="contact" size="25"></uni-icons>
					</view>
					<view class="text">解析记录</view>
					<uni-icons class="to" type="forward" size="25"></uni-icons>
				</view>
			</view>
			<view class="list">
				<view class="li " @click="gotoValue" hover-class="hovers">
					<view class="icon">
						<uni-icons type="star" size="25"></uni-icons>
					</view>
					<view class="text">每日抽奖</view>
					<uni-icons class="to" type="forward" size="25"></uni-icons>
				</view>
				<view class="li "  hover-class="hovers" @click="gotoNotify">
					<view class="icon">
						<uni-icons type="phone" size="25"></uni-icons>
					</view>
					<view class="text">通知管理</view>
					<uni-icons class="to" type="forward" size="25"></uni-icons>
					
				</view>
				<view class="li " hover-class="hovers" @click="goAbout">
					<view class="icon">
						<uni-icons type="shop" size="25"></uni-icons>
					</view>
					<view class="text">关于我们</view>
					<uni-icons class="to" type="forward" size="25"></uni-icons>
				</view>
				<view class="li " style="position: relative;" hover-class="hovers">
					<view class="icon">
						<uni-icons type="help" size="25"></uni-icons>
					</view>
					<view class="text">意见反馈</view>
					<uni-icons class="to" type="forward" size="25"></uni-icons>
					<button open-type="contact"
						style="position: absolute;top: 0;left: 0;width: 100%;height: 100%;opacity: 0;"></button>
				</view>
			</view>
			<view class="list">
				<view class="li noborder" hover-class="hovers" @click="logout">
					<view class="icon">
						<uni-icons type="tune" size="25"></uni-icons>
					</view>
					<view class="text">退出登录</view>
					<uni-icons class="to" type="forward" size="25"></uni-icons>
				</view>
			</view>

		</view>
	</view>
</template>
<script>
	import service from '../../common/service.js';
	export default {
		data() {
			return {
				//baseUrl: 'https://2846579.club/hcx/f/api/user',
				baseUrl: service.baseUrl + 'user',
				userInfo: {

				},
				templateId: 'dDJsBzZyMfMm2XMI0aqYjo1vPzIbJQBNAJqaO0B4SFY'
			};
		},
		onInit() {
			this.load();
		},
		onLoad() {
			uni.getSetting({
				withSubscriptions: true,
				success(res) {
					console.log(res)
				}
			})
		},
		onShow() {
			uni.setTabBarStyle({
				backgroundColor: "#ffffff",
			});
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
		onPullDownRefresh() {
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
						that.userInfo = res.data.data;
						uni.setStorageSync("USER_INFO", res.data.data);
					}
				})
			} else {
				uni.redirectTo({
					url: '../login/login'
				});
			}
			setTimeout(() => {
				uni.stopPullDownRefresh();
			}, 1000)
		},
		methods: {
			a() {
				uni.showToast({
					title: "暂未开放！",
					icon: "error"
				})
			},
			acceptMessage() {
				// let id = this.templateId;
				// let that = this;
				// uni.requestSubscribeMessage({
				// 	tmplIds: [id],
				// 	success(res) {
				// 		console.log(res)
				// 		if (res[id] == 'accept') {
				// 			that.$api.msg("订阅成功", "success", 300);
				// 		} else {
				// 			that.$api.msg("订阅失败", "error");
				// 		}
				// 	},
				// 	fail(res) {
				// 		that.$api.msg("订阅失败", "error");
				// 	}
				// })
			},
			gotoValue() {
				uni.navigateTo({
					url: "./persionValue?userId=" + this.userInfo.openId
				})
			},
			gotoNotify(){
				uni.navigateTo({
					url:"./personNotify"
				})
			},
			getHistoy() {
				uni.navigateTo({
					url: "./persionHistory?userId=" + this.userInfo.openId
				})
			},
			goAbout() {
				uni.navigateTo({
					url: "about"
				})
			},
			logout() {
				uni.setStorageSync("USER_INFO", null);
				this.userInfo = "";
				uni.redirectTo({
					url: '../login/login'
				});
			},
			load() {
				let userinfo = uni.getStorageSync("USER_INFO");
				console.log(userinfo)
				let that = this;
				if (userinfo != '' && userinfo != null) {
					let time = (new Date()).valueOf();
					let sign = service.encryp(userinfo.openId, time);
					uni.request({
						url: that.baseUrl + '/checkSessionKey?time=' + time + "&sign=" + sign,
						method: "POST",
						header: {
							'content-type': 'application/x-www-form-urlencoded',
						},
						data: {
							openId: userinfo.openId,
							sessionKey: userinfo.sessionKey
						},
						success(res) {

							console.log(res)
							if (res.data.code != 200) {
								uni.redirectTo({
									url: '../login/login'
								});
								return;
							}
							that.userInfo = userinfo
						},
						fail(res) {
							uni.showToast({
								title: res,
								icon: "none"
							})
						}
					})
				} else {
					uni.redirectTo({
						url: '../login/login'
					});
				}
			}
		}
	}
</script>

<style lang="scss">
	page {
		background-color: #f1f1f1;
		font-size: 30upx;
	}

	.header {
		background: #fff;
		height: 290upx;
		padding-bottom: 110upx;

		.bg {
			width: 100%;
			height: 200upx;
			padding-top: 100upx;
			background-color: #4191ea;
		}
	}

	.box {
		width: 650upx;
		height: 280upx;
		border-radius: 20upx;
		margin: 0 auto;
		background: #fff;
		box-shadow: 0 5upx 20upx 0upx rgba(0, 0, 150, .2);

		.box-hd {
			display: flex;
			flex-wrap: wrap;
			flex-direction: row;
			justify-content: center;

			.avator {
				width: 160upx;
				height: 160upx;
				background: #fff;
				border: 5upx solid #fff;
				border-radius: 50%;
				margin-top: -80upx;
				overflow: hidden;

				img {
					width: 100%;
					height: 100%;
				}
			}

			.phone-number {
				width: 100%;
				text-align: center;
			}
		}

		.box-bd {
			display: flex;
			flex-wrap: nowrap;
			flex-direction: row;
			justify-content: center;

			.item {
				flex: 1 1 auto;
				display: flex;
				flex-wrap: wrap;
				flex-direction: row;
				justify-content: center;
				border-right: 1px solid #f1f1f1;
				margin: 15upx 0;

				&:last-child {
					border: none;
				}

				.icon {
					width: 60upx;
					height: 60upx;
					position: relative;

					img {
						width: 100%;
						height: 100%;
					}
				}

				.text {
					width: 100%;
					text-align: center;
					margin-top: 10upx;
				}
			}
		}
	}

	.list-content {
		background: #fff;
	}

	.list {
		width: 100%;
		border-bottom: 15upx solid #f1f1f1;
		background: #fff;

		&:last-child {
			border: none;
		}

		.li {
			width: 92%;
			height: 100upx;
			padding: 0 4%;
			border-bottom: 1px solid rgb(243, 243, 243);
			display: flex;
			align-items: center;

			&.noborder {
				border-bottom: 0
			}

			.icon {
				flex-shrink: 0;
				width: 50upx;
				height: 50upx;

				image {
					width: 50upx;
					height: 50upx;
				}
			}

			.text {
				padding-left: 20upx;
				width: 100%;
				color: #666;
			}

			.to {
				flex-shrink: 0;
				width: 40upx;
				height: 40upx;
			}
		}
	}

	.hovers {
		background-color: #e5e5e5;
	}
</style>
