<template>
	<view>
		<view class="loading_page" v-show="loadFlag"><image src="/static/loading/loading.gif"></image></view>
		<view class="" @touchmove.stop.prevent="a = false" @catchtouchmove="a = false">
			<view class="" style="">
				<swiper style="height: 100vh;width: 100vw;" :circular="true" @change="swiperChange"
					:current="activeCurrent">
					<swiper-item v-for="(item,index) in detail" :key="index">
						<image :src="item.url" style="height: 100vh;width: 100vw;display: flex;" mode="aspectFill">
						</image>
					</swiper-item>
				</swiper>
			</view>
			<view class="date-container">
				<text class="time">{{time}}</text>
				<text class="date">{{date}}</text>
			</view>
			<view class="bottom" :class="cssTran ? 'closeCss' : 'openCss'">
				<view class="num">{{indexCurrent}} / {{detail.length}}</view>
				<view class="nav-box">
					<view class="nav-tab" @click="backClick">
						<u-icon name="/static/icon/back.png" :size="26"></u-icon>
						<text>返回</text>
					</view>
					<view class="nav-tab" @click="winClick(indexCurrent-1)">
						<u-icon name="/static/icon/duihuan.png" :size="26"></u-icon>
						<text>下载</text>
					</view>
					<view class="nav-tab">
						<u-icon name="/static/icon/shares.png" :size="26"></u-icon>
						<text>分享</text>
						<button open-type="share"
							style="position: absolute;top: 0;left: 0;width: 100%;height: 100%;opacity: 0;"></button>
					</view>
				</view>
			</view>
		</view>
		<wyb-loading ref="loading" />
		
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
				baseUrl: service.baseUrl + 'video',
				detail: [],
				time: '',
				date: '',
				activeCurrent: 0,
				indexCurrent: 1,
				loadFlag: true,
				isShare: false
			}
		},
		onReady() {
			setTimeout(()=>{
				this.loadFlag = false;
			},600)
		},
		onLoad(e) {
			console.log(e)
			if (e.list != null) {
				this.detail = JSON.parse(decodeURIComponent(e.list));
			} else if (e.share != null) {
				this.detail.push({
					url: decodeURIComponent(e.share)
				});
				this.isShare = true;
			}
			
			this.getDate();
			
		},
		methods: {
			getDate() {
				var t = new Date(),
					e = (t.getFullYear(), t.getMonth() + 1),
					o = t.getDate(),
					a = t.getHours(),
					n = t.getMinutes(),
					i = (t.getSeconds(), e + "月" + o + "日"),
					s = [a, n].map(this.formatNumber).join(":");
				this.time = s;
				this.date = i;
			},
			formatNumber: function(t) {
				return (t = t.toString())[1] ? t : "0" + t;
			},
			backClick() {
				if (this.isShare) {
					uni.reLaunch({
						url: '../index/index'
					});
				} else {
					uni.navigateBack({
						delta: 1
					})
				}

			},
			winClick(index) {
				let that = this;
				this.$refs.loading.showLoading() // 显示
				let url = encodeURIComponent(this.detail[index].url);
				let title = encodeURIComponent(this.detail[index].detailInfo);
				let time = (new Date()).valueOf();
				let sign = service.encryp(this.detail[index].url,time);
				let downloadTask = uni.downloadFile({
					url: this.baseUrl + "/download?httpUrl=" + url + "&fileName=" + title +
						".jpg&httpLoca=1&time="+time+"&sign="+sign,
					header:{"content-type":"image/jpeg"},
					success: (res) => {
						console.log(res);
						that.$refs.loading.hideLoading() // 隐藏
						if (res.statusCode === 200) {
							console.log('下载成功');

							uni.saveImageToPhotosAlbum({
								filePath: res.tempFilePath,
								success: function() {
									uni.showToast({
										title: "保存图片成功！",
										icon: "none"
									})
								}
							});
						}
					}
				});
				downloadTask.onProgressUpdate((res) => {
					console.log('下载进度' + res.progress);
					console.log('已经下载的数据长度' + res.totalBytesWritten);
					console.log('预期需要下载的数据总长度' + res.totalBytesExpectedToWrite);
				});
			},
			swiperChange(e) {
				this.indexCurrent = e.detail.current + 1;
				console.log(this.indexCurrent);
			}
		},

		onShareAppMessage(res) {
			let that = this;
			return {
				title: '送你一张超级好看的壁纸~',
				imageUrl: that.detail[that.indexCurrent - 1].url,
				path: '/pages/picture/detail?share=' + encodeURIComponent(that.detail[that.indexCurrent - 1].url)
			}
		},
		onShareTimeline(res) {
			return {
				title: '表，我的聊天背景都是在这找的~',
				path: '/pages/picture/picture',
				imageUrl: "https://vkceyugu.cdn.bspapp.com/VKCEYUGU-7ed8ec0e-de90-4ed2-8830-c36512ae8fc0/793331ab-9a2a-4236-a7d4-1d19bdff6ae8.png",
			}
		}
	}
</script>
<style lang="scss">
	// 全局loading动画
	.loading_page {
		width: 100vw;
		height: 100vh;
		display: flex;
		align-items: center;
		justify-content: center;
		background-color: #FFFFFF;

		image {
			width: 58rpx;
			height: 58rpx;
			position: relative;
			margin-top: -100rpx;
			/* #ifdef h5 */
			margin-top: 0;
			/* #endif */
		}
	}

	.bottom {
		position: fixed;
		left: 4%;
		right: 0;
		width: 92%;
		height: 52px;
		box-shadow: 0 0px 8px rgba(0, 0, 0, 0.06);
		background: rgba(0, 0, 0, 0.94);
		border-radius: 49px;
		z-index: 10;
		opacity: 0.8;

		.num {
			position: absolute;
			top: -20rpx;
			top: -70rpx;
			left: 44%;
			background: rgba(0, 0, 0, 0.6);
			color: #FFF;
			padding: 4rpx 20rpx;
			font-size: 12px;
			border-radius: 36px;
		}
	}

	.nav-tab {
		position: relative;
		width: 100%;
		height: 52px;
		font-size: 12px;
		color: #D8D8D8;
		font-weight: 400;

		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}

	.nav-box {
		/* position: absolute; */
		display: flex;
		flex-direction: row;
		justify-content: space-around;
		width: 100%;
		box-sizing: border-box;
	}

	.openCss {
		animation-name: openLinear;
		animation-duration: 0.8s;
		animation-iteration-count: 1;
		bottom: 3%;
	}

	@keyframes openLinear {
		0% {
			transform: translateY(92px);
		}

		100% {
			transform: translateY(0px);
		}
	}

	.closeCss {
		animation-name: closeLinear;
		animation-duration: 0.8s;
		animation-iteration-count: 1;
		bottom: -52px;
	}

	@keyframes closeLinear {
		0% {
			transform: translateY(-92px);
		}

		100% {
			transform: translateY(0px);
		}
	}

	.u-indicator-item-number {
		padding: 6rpx 16rpx;
		line-height: 1;
		background-color: rgba(0, 0, 0, 0.3);
		border-radius: 100rpx;
		font-size: 26rpx;
		color: rgba(255, 255, 255, 0.8);
	}

	.date-container {
		width: 100%;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		position: absolute;
		top: 150rpx;
		opacity: .9;
	}

	.time {
		font-size: 120rpx;
		color: #fff;
	}

	.date {
		font-size: 40rpx;
		color: #fff;
	}
</style>
