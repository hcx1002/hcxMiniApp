<template>
	<view>
		<view class="app">
			<view>
				<u-swiper :list="list3" previousMargin="30" nextMargin="30" circular :autoplay="true" radius="5"
					bgColor="#ffffff" :height="220" :radius="20"></u-swiper>
			</view>

			<view style="margin-top: 40rpx;">
				<zq-sudoku :list="list" @click="click"></zq-sudoku>
			</view>
		</view>
	</view>

</template>

<script>
	import service from '../../common/service.js';
	import zqSudoku from '../../components/zq-sudoku/zq-sudoku.vue';
	export default {
		components: {
			zqSudoku
		},
		data() {
			return {
				webUrl: service.webUrl,
				baseUrl: service.baseUrl + 'video',
			
				show: true,
				list: [],
				list1: [],
				list3: [],
			}
		},
		onHide() {
			console.log("Hide")
		},
		onReady() {
			console.log("Ready");
		},
		onLoad() {

			this.getBannerList();
			this.getTable();
		},
		onShow() {
			console.log("Show")
			uni.setTabBarStyle({
				backgroundColor: "#89ecff",
				borderStyle: "white"
			})
		},
		onShareAppMessage() {
			return {
				title: '幻彩希的Utils',
				path: "/pages/index/index",
				desc: "这不是挺好的吗？"
			}
		},
		onShareTimeline() {
			return {
				title: '幻彩希的Utils'
			}
		},
		methods: {
			click(e) {
				console.log(e)
				if (e.url != "" || e.url != null) {
					uni.navigateTo({
						url: e.url,
						animationType: 'pop-in',
						animationDuration: 500
					})
				}


			},

			getQueryVariable(variable, url) {
				var vars = url.split("&");
				for (var i = 0; i < vars.length; i++) {
					var pair = vars[i].split("=");
					if (pair[0] == variable) {
						return pair[1];
					}
				}
				return (false);
			},
			// 首页轮播图
			getBannerList() {
				let that = this;
				let time = (new Date()).valueOf();
				let sign = service.encryp("", time);
				uni.request({
					url: that.webUrl + 'f/api/appview/banner?time=' + time + "&sign=" + sign,
					method: "GET",
					header: {
						'content-type': 'application/x-www-form-urlencoded',
					},
					success(res) {
						if (res.data.code == 200) {
							let list = res.data.data.list;
							for (let i = 0; i < list.length; i++) {
								that.list3.push(list[i].bannerUrl);
							}
						} else {
							uni.showToast({
								title: res.data.msg,
								icon: "error"
							})
						}
					}
				})

			},
			getTable() {
				let that = this;
				let time = (new Date()).valueOf();
				let sign = service.encryp("", time);
				uni.request({
					url: that.webUrl + 'f/api/appview/table?time=' + time + "&sign=" + sign,
					method: "GET",
					header: {
						'content-type': 'application/x-www-form-urlencoded',
					},
					success(res) {
						console.log(res)
						if (res.data.code == 200) {
							let list = res.data.data.list;
							for (let i = 0; i < list.length; i++) {
								that.list.push(list[i])
							}
						} else {
							uni.showToast({
								title: res.data.msg,
								icon: "error"
							})
						}
					}
				})
			}

		}
	}
</script>

<style>
	Page {
		margin: 0;
		padding: 0;
		min-height: 100vh;
		position: relative;
		background-color: rgb(137, 236, 255);
		overflow: hidden;
	}

	Page::before,
	Page::after {
		content: '';
		position: absolute;
		bottom: 15vh;
		/* 发行出现问题 */
		top: auto;
		min-width: 300vw;
		min-height: 300vw;
		background-color: #FFFFFF;
		animation: rote 10s linear infinite;
	}

	Page::before {
		left: -95%;
		border-radius: 45%;
		opacity: .5;
	}

	Page::after {
		left: -95%;
		border-radius: 46%;
	}

	@keyframes rote {
		from {
			transform: rotateZ(0);
		}

		to {
			transform: rotateZ(360deg);
		}
	}

	.app {

		position: absolute;
		width: 100%;
		top: 5px;
		left: 0;
		z-index: 100;
	}

	.grid-text {
		font-size: 14px;
		color: #909399;
		padding: 10rpx 0 20rpx 0rpx;
		/* #ifndef APP-PLUS */
		box-sizing: border-box;
		/* #endif */
	}

	.loading_page {
		width: 100vw;
		height: 100vh;
		display: flex;
		align-items: center;
		justify-content: center;
		background-color: #FFFFFF;
	}

	.loading_page image {

		width: 70rpx;
		height: 70rpx;
		position: relative;
		margin-top: -100rpx;
		/* #ifdef h5 */
		margin-top: 0;
		/* #endif */

	}
</style>
