<template>
	<view class="app">
		<view class="search">

			<view style="margin: 20rpx 0;">
				<!-- 展示输入框尾部图标 -->
				<!-- <uni-easyinput suffixIcon="search" v-model="content" placeholder="请输入链接" @iconClick="search(null)"
					clearable>
				</uni-easyinput> -->
				<u-search inputAlign="center" height="40" shape="round" v-model="content" placeholder="请输入链接" showAction
					actionText="解析" animation @custom="search(null)"></u-search>
			</view>

			<u-transition :show="showVideo" mode="fade" duration="500">
				<view v-if="videoInfo.type!=2">
					<video :title="videoInfo.title" :src="videoInfo.videoUrl" :poster-for-crawler="videoInfo.videoPic"
						style="width: 100%;margin-top: 20rpx;margin-bottom: 30rpx;"></video>
				</view>
				<view v-else style="text-align: center;">
					<image v-for="(img,index) in videoInfo.imageList" :key="index" :src="baseImage+img"></image>
				</view>
				<view>
					<uni-forms>
						<uni-forms-item>
							<uni-easyinput prefixIcon="contact" type="text" :value="videoInfo.author"
								:inputBorder="false" :styles="styles" disabled />
						</uni-forms-item>
						<uni-forms-item>
							<uni-easyinput type="textarea" :value="videoInfo.title" :inputBorder="false"
								:styles="styles" disabled />
						</uni-forms-item>
						<view v-if="!isApp">
							<view style="text-align: center;position: relative;">
								<progress :percent="percent" stroke-width="40" @click="saveVideo"
									backgroundColor="#007AFF">
									<view
										style="position: absolute;top: 20rpx;left: 50%;margin-left: -75rpx;width: 150rpx;">
										{{videoInfo.type!=2?'保存视频':'保存图片'}}
									</view>
								</progress>
							</view>
							<view style="display: flex;text-align: center;position: relative;margin-top: 20rpx;">
								<progress :percent="percent1" stroke-width="40" @click="saveMusic"
									backgroundColor="#00ecec">
									<view
										style="position: absolute;top: 20rpx;left: 50%;margin-left: -75rpx;width: 150rpx;">
										保存音乐</view>
								</progress>
							</view>
						</view>
						<view v-else>
							<u-button type="primary" :loading="percent!=0&&percent!=100" loadingText="下载中"  @click="saveVideo">
								{{videoInfo.type!=2?'保存视频':'保存图片'}}</u-button>

							<view style="margin-top: 30rpx;">
								<u-button type="info" :loading="percent1!=0&&percent1!=100" loadingText="下载中" @click="saveMusic">保存音乐</u-button>
							</view>
						</view>
						<!-- <view style="margin-top: 20rpx;">
							<progress v-if="percent!=-1" :percent="percent" />
						</view> -->
					</uni-forms>
				</view>
			</u-transition>


			<view v-if="!showVideo" style="margin-top: 50rpx;">
				<u-empty mode="car" icon="/static/index/list.png" text="啥都没有 ! 快去复制链接"></u-empty>
			</view>
		</view>
		<!-- 弹出层 -->
		<uni-popup ref="popup">
			<view style="background-color: #FFF;padding: 70rpx;text-align: center;border-radius: 30rpx;">
				<view style="margin-bottom: 30rpx;">
					已检测到链接，是否解析？
				</view>
				<button @click="popupClick" style="font-size: 30rpx;background-color: #FF6400;color: #FFF;">确认</button>
			</view>
		</uni-popup>
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
				webUrl: service.webUrl,
				baseUrl: service.baseUrl + 'video',
				baseImage: service.webUrl + 'images/save/',
				inUrl: '',
				content: '',
				videoInfo: {
					title: '',
					videoUrl: '',
					videoPic: '',
					author: '',
					musicUrl: '',
					type: '',
					imageList: []
				},
				styles: {
					disableColor: '#767676',
				},
				percent: 0,
				percent1: 0,
				isLoad: false,
				showVideo: false,
				downVideo: false,
				downMusic: false,
				isApp: false,
			}
		},
		onLoad(e) {
			let that = this;
			//#ifdef APP
			this.isApp = true;
			//#endif
			uni.getClipboardData({
				success(res) {
					if (res.data.indexOf("http") != -1) {
						// that.inUrl = res.data.substring(res.data.indexOf("http"), res.data.lastIndexOf("/") + 1);
						that.content = res.data;
						that.$refs.popup.open('center')
					}
				}
			});

			if (e.info != null) {
				// let info = JSON.parse(e.info);
				console.log(e)
				this.search(e.info)

			}
		},
		onShow() {
			let that = this;
			uni.getClipboardData({
				success(res) {
					if (res.data.indexOf("http") != -1) {
						that.inUrl = res.data.substring(res.data.indexOf("http"), res.data.lastIndexOf("/") + 1);
						that.$refs.popup.open('center')
					}
				}
			})
		},
		onShareAppMessage() {
			return {
				title: '视频水印去除工具',
				path: "/pages/index/index",
				desc: "支持抖音和微视"
			}
		},
		onShareTimeline() {
			return {
				title: '视频水印去除工具'
			}
		},
		methods: {
			search(url) {
				console.log(url);

				let that = this;
				this.isLoad = true;
				this.percent = 0;
				this.downVideo = false;
				let userInfo = uni.getStorageSync("USER_INFO");
				console.log(userInfo)
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
					})
				}
				if (url == null) {
					if (this.content == '') {
						uni.showToast({
							title: "干嘛试探我？",
							icon: "none"
						})
						return;
					}
					if (this.content.indexOf("douyin") != -1) {
						url = this.content.substring(this.content.indexOf("http"), this.content.lastIndexOf("/") + 1);

					} else if (this.content.indexOf("weishi") != -1) {
						url = this.getQueryVariable("id", this.content.substring(this.content.indexOf("http"), this
							.content.lastIndexOf("&")))
					}
				}
				this.$refs.loading.showLoading() // 显示
				let time = (new Date()).valueOf();
				let sign = service.encryp(url, time);
				uni.request({
					url: this.baseUrl + '/getVideo?time=' + time + "&sign=" + sign,
					method: "POST",
					header: {
						'content-type': 'application/x-www-form-urlencoded',
					},
					data: {
						videoBaseUrl: url,
						userId: userInfo.openId,
					},
					success(res) {
						that.$refs.loading.hideLoading() // 隐藏
						console.log(res)
						if (res.data.code == 200) {
							that.showVideo = true;

							let info = res.data.data;
							console.log(info)
							that.videoInfo.title = info.videoTitle;
							that.videoInfo.author = info.videoAuthor;
							that.videoInfo.videoPic = info.videoImage;
							that.videoInfo.videoUrl = info.videoUrl;
							that.videoInfo.musicUrl = info.videoMusic;
							that.videoInfo.type = info.videoType;
							that.videoInfo.imageList = info.videoImageList;
							setTimeout(() => {
								that.showImage = true;
							}, 300)
						} else {
							uni.showToast({
								title: res.data.msg,
								icon: 'error'
							})
						}

					},
					fail(e) {
						console.log(e);
						that.$refs.loading.hideLoading() // 隐藏
					}
				})

			},
			popupClick() {
				this.search();
				this.$refs.popup.close()
			},
			saveVideo() {

				if (!this.isLoad) {
					uni.showToast({
						title: "已经下载好啦！",
						icon: 'success'
					})
					return;
				} else if (this.downVideo) {
					uni.showToast({
						title: "正在下载中，请稍等！",
						icon: 'none'
					})
					return;
				}

				let that = this;
				this.percent = 0;
				this.downVideo = true;
				if (this.videoInfo.type == 2) {
					for (let i = 0; i < this.videoInfo.imageList.length; i++) {
						let downloadTask = uni.downloadFile({
							url: this.webUrl + "images/save/" + this.videoInfo.imageList[i],
							header: {
								"Content-Type": "image/jpeg"
							},
							success: (res) => {
								console.log(res);
								if (res.statusCode === 200) {
									console.log('下载成功');
									this.isLoad = false;
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
							that.percent = res.progress;
							console.log('下载进度' + res.progress);
							console.log('已经下载的数据长度' + res.totalBytesWritten);
							console.log('预期需要下载的数据总长度' + res.totalBytesExpectedToWrite);
						});
					}
				} else {
					let httpUrl = encodeURIComponent(this.videoInfo.videoUrl);
					let fileName = encodeURIComponent(this.videoInfo.title);
					let filePath = ""
					//#ifdef MP-WEIXIN
					filePath = wx.env.USER_DATA_PATH + '/' + Math.floor(Math.random() * 100000) + '.mp4';
					//#endif
					let loca = this.videoInfo.type == 5 ? "1" : "location";
					let time = (new Date()).valueOf();
					let sign = service.encryp(this.videoInfo.videoUrl, time);
					let downloadTask = uni.downloadFile({
						url: this.baseUrl + "/download?httpUrl=" + httpUrl + "&fileName=" + Math.floor(Math
								.random() * 100000) +
							".mp4&httpLoca=" + loca + "&time=" + time + "&sign=" + sign,
						header: {
							"Content-Type": "video/mpeg4"
						},
						//保存视频失败
						filePath: filePath,
						success: (res) => {
							console.log(res);
							if (res.statusCode === 200) {
								console.log('下载成功');
								that.isLoad = false;
								uni.saveVideoToPhotosAlbum({
									//#ifdef MP-WEIXIN
									filePath: res.filePath,
									//#endif
									//#ifdef APP
									filePath: res.tempFilePath,
									//#endif
									success: function() {
										uni.showToast({
											title: "保存视频成功！",
											icon: "none"
										})
										//#ifdef MP-WEIXIN
										/* 删除缓存 */
										let fileMgr = wx.getFileSystemManager();
										fileMgr.unlink({
											filePath: filePath,
											success: function(r) {
												console.log(r)
											},
										})
										//#endif
									},
									fail(e) {
										console.log(e);
									}
								});
							}
						}
					});
					downloadTask.onProgressUpdate((res) => {
						that.percent = res.progress;
						console.log('下载进度' + res.progress);
						console.log('已经下载的数据长度' + res.totalBytesWritten);
						console.log('预期需要下载的数据总长度' + res.totalBytesExpectedToWrite);
					});

				}

			},
			saveMusic() {
				let that = this;
				if (this.downMusic) {
					uni.showToast({
						title: "文件已下载好了！",
						icon: "none"
					})
					return;
				}
				this.percent1 = 0;
				let musicUrl = encodeURIComponent(this.videoInfo.musicUrl);
				let title = encodeURIComponent(this.videoInfo.title)
				let time = (new Date()).valueOf();
				let sign = service.encryp(this.videoInfo.musicUrl, time);
				let downloadTask = uni.downloadFile({
					url: this.baseUrl + "/download?httpUrl=" + musicUrl + "&fileName=" + title +
						".mp3&httpLoca=1&time=" + time + "&sign=" + sign,
					header: {
						"Content-Type": "audio/mp3"
					},
					success: (res) => {
						console.log(res);
						if (res.statusCode === 200) {
							console.log('下载成功');
							uni.saveFile({
								tempFilePath: res.tempFilePath,
								success: function(res) {
									console.log(res);
									that.downMusic = true;
									uni.showToast({
										title: "文件已保存到本地！",
										icon: "none"
									})
								}
							});
							// uni.saveVideoToPhotosAlbum({
							// 	filePath: res.tempFilePath,
							// 	success: function() {
							// 		uni.showToast({
							// 			title: "保存音频成功！",
							// 			icon: "none"
							// 		})
							// 	}
							// });
						}
					}
				});
				downloadTask.onProgressUpdate((res) => {
					that.percent1 = res.progress;
					console.log('下载进度' + res.progress);
					console.log('已经下载的数据长度' + res.totalBytesWritten);
					console.log('预期需要下载的数据总长度' + res.totalBytesExpectedToWrite);
				});
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
			}
		}
	}
</script>

<style>
	.app {
		padding: 25rpx;
	}

	.search {
		margin-bottom: 20rpx;
	}
</style>
