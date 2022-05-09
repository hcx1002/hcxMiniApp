<template>
	<view>
		<page-meta>
			<navigation-bar :title="nbTitle" :loading="nbLoading" :front-color="nbFrontColor"
				:background-color="nbBackgroundColor" :color-animation-duration="2000"
				color-animation-timing-func="easeIn"  />
		</page-meta>
			
			<view class="imageList">
				<view v-for="(item, index) in imageList" :key="index" class="imageRow" @click="detail(index)">
					<image :src="item.thumbUrl" lazy-load style="width: 215rpx;height: 350rpx;" mode="aspectFill"
						@error="imageError" :id="index">
					</image>
				</view>
			</view>

	</view>
</template>

<script>
	import service from '../../common/service.js';

	// var h = uni.getSystemInfoSync().screenHeight;
	export default {
		data() {
			return {
				webUrl: service.webUrl,
				baseUrl: service.baseUrl + 'picture',
				imageList: [],
				nbTitle: '好看的壁纸呀~',
				// h: h,
				// titleIcon: '/static/index/picture.png',
				// titleIconRadius: '20px',
				// subtitleText: 'subtitleText',
				nbLoading: false,
				nbFrontColor: '#000000',
				nbBackgroundColor: '#ffffff',

			}
		},
		components: {
			
		},
		onReady() {
			
		},
		onLoad() {
			this.getPicture();

		},
		methods: {
			getPicture() {
				let that = this;
				let time = (new Date()).valueOf();
				let sign = service.encryp("", time);
				uni.request({
					url: this.baseUrl + '/get?time='+time+"&sign="+sign,
					method: "GET",
					header: {
						'content-type': 'application/x-www-form-urlencoded',
					},
					success(res) {
						console.log(res);
						that.imageList = res.data.data

					}
				})
			},
			detail(index) {
				let arr = new Array();
				for (let i = index; i < index + 5; i++) {
					if (i >= 30) {
						break
					}
					let info = this.imageList[i];
					arr.push({
						"url": info.thumbUrl,
						"detailInfo": info.detailInfo
					});
				}
				//有url存在时要进行转义
				uni.navigateTo({
					url: "./detail?list=" + encodeURIComponent(JSON.stringify(arr)),
					animationType: 'pop-in',
					animationDuration: 500
				})
			},
			imageError(e) {
				console.log(e);
				let index = e.target.id;
				
				this.imageList[index].thumbUrl = "/static/loading/error.jpg"
			}
			
		},
		onPullDownRefresh() {
			this.getPicture();
			setTimeout(() => {
				uni.stopPullDownRefresh();
			}, 1000)
		}
	}
</script>

<style>
	page {
		background-color: #eee;
	}

	.imageList {
		margin-top: 15rpx;
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
	}

	.imageRow {
		width: 32%;
		height: auto;
		text-align: center;
		margin-bottom: 8rpx;
	}

	.imageRow image {
		border-radius: 10px;
		box-shadow: 2px 2px 2px #cecece;
	}
</style>
