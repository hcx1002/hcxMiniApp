<template>
	<view>
		<scroll-view>
			<view v-for="(item, index) in historyList" :key="index">
				<u-transition :show="showList" mode="fade" duration="500">
					<view hover-class="hovers" @click="click(item)">
						<u-cell :title="item.videoTitle">
							<u-avatar slot="icon" shape="square" size="60" :src="getImageList(item.videoImage,item.videoType)"
								customStyle="margin: -3px 15px -3px 0"></u-avatar>
						</u-cell>
						<view
							style="display: flex; align-items: center;font-size: 28rpx;color: #797979;border-bottom: 1rpx solid #9f9f9f;">
							<view
								style="width: 50%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;padding-left: 20rpx;">
								作者：{{item.videoAuthor}}
							</view>
							<view style="width: 50%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">
								{{item.videoTime}}
							</view>
						</view>
					</view>
				</u-transition>
			</view>
			<u-loadmore :status="status" />
		</scroll-view>
	</view>
</template>

<script>
	import service from '../../common/service.js';
	export default {
		data() {
			return {
				baseUrl: service.baseUrl+'video',
				baseImage: service.webUrl + 'images/save/',
				historyList: '',
				page: {
					pageSize: 20,
					pageCount: 0,
					pageNo: 1,
					pages: 0
				},
				showList: false,
				openId: '',
				status: 'loadmore',
			}
		},
		onLoad(e) {
			let that = this;
			this.openId = e.userId;
			let time = (new Date()).valueOf();
			let sign = service.encryp(this.openId, time);
			uni.request({
				url: that.baseUrl + '/getHistory?time='+time+"&sign="+sign,
				method: "POST",
				header: {
					'content-type': 'application/x-www-form-urlencoded',
				},
				data: {
					openId: this.openId,
					pageSize: this.page.pageSize,
					pageNo: this.page.pageNo
				},
				success(res) {
					console.log(res)
					that.showList = true;
					that.page.pageCount = res.data.data.count;
					that.historyList = res.data.data.list;
					that.page.pages = Math.ceil(that.page.pageCount / that.page.pageSize);
					if(that.page.pages==1){
						that.status = 'nomore'
					}
					console.log(that.page)
				}
			})
		},
		onReachBottom() {
			this.scrolltolower()
		},
		methods: {
			click(item){
				uni.navigateTo({
					url:'../video/video?info='+item.videoBaseUrl
				})
			},
			scrolltolower() {
				let that = this;
				if (this.page.pageNo == this.page.pages) {
					this.status = "nomore";
					return;
				}
				this.status = "loading";
				this.page.pageNo++;
				let time = (new Date()).valueOf();
				let sign = service.encryp(this.openId, time);
				uni.request({
					url: that.baseUrl + '/getHistory?time='+time+"&sign="+sign,
					method: "POST",
					header: {
						'content-type': 'application/x-www-form-urlencoded',
					},
					data: {
						openId: this.openId,
						pageSize: this.page.pageSize,
						pageNo: this.page.pageNo
					},
					success(res) {
						that.status = "loadmore";
						that.historyList = that.historyList.concat(res.data.data.list);
						if(that.historyList==null){
							that.status = "nomore";
						}
						console.log(that.historyList);
					}
				})
			},
			getImageList(images,type){
				let list=[];
				if(type==2){
					list= images.split(",");
					return this.baseImage+list[0];
				}
				return images;
			}
		}
	}
</script>

<style>
	.hovers {
		background-color: #e5e5e5;
	}
</style>
