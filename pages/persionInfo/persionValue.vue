<template>
	<view>
		<view style="text-align: center;margin-top: 50rpx;">
			我的积分：<text>{{value}}</text>
			<view>每次抽奖扣5积分</view>
			<view>每天一次免费</view>
		</view>
		<view class="container">
			<view class="tui-dot" :class="'tui-dot-'+(index+1)" v-for="(item,index) in circleList" :key="index"></view>
			<view class="tui-container-in">
				<view class="tui-content-out" :class="['tui-award-'+(index+1),index==indexSelect?'tui-awardSelect':'']"
					v-for="(item,index) in awardList" :key="index">
					<view class="tui-award-image">{{item.value}}</view>
				</view>
				<view class="tui-btn-start" :class="isRunning?'tui-ative':''" @click="start">开始</view>
			</view>
		</view>
	</view>

</template>

<script>
	import service from '../../common/service.js';
	export default {
		data() {
			return {
				baseUrl: service.baseUrl + 'user',
				circleList: 24, //圆点个数
				awardList: [{
					value: "1",
					name: "1积分"
				}, {
					value: "2",
					name: "2积分"
				}, {
					value: "3",
					name: "3积分"
				}, {
					value: "谢谢惠顾",
					name: "0积分"
				}, {
					value: "12",
					name: "12积分"
				}, {
					value: "20",
					name: "20积分"
				}, {
					value: "100",
					name: "100积分"
				}, {
					value: "300",
					name: "300积分"
				}], //奖品
				indexSelect: 0, //抽中的奖品下标
				isRunning: false ,//抽奖状态,
				value:0,
				isOne:false,
			}
		},
		onLoad() {
			let userinfo = uni.getStorageSync("USER_INFO");
			console.log(userinfo)
			if (userinfo == '') {
				uni.redirectTo({
					url: '../login/login'
				});
			}
			this.value = userinfo.value;
			let timevalue = uni.getStorageSync("TIMEVALUE");
			let time = new Date();
			if(timevalue==""||timevalue==null){
				uni.setStorageSync("TIMEVALUE",{date:time.getDate()});
				this.isOne = true;
			}else{
				if(time.getDate()!=timevalue.date){
					this.isOne = true;
				}else{
					this.isOne = false;
				}
			}
			console.log(this.isOne);
		},
		methods: {

			//随机数
			random(u) {
				let rnd = Math.random() > 0.5 ? "2" : "1";
				u = u || 3;
				for (var i = 0; i < u; i++) {
					rnd += Math.floor(Math.random() * 10);
				}
				return Number(rnd);
			},

			//开始
			start() {
				if(!this.isOne&&this.value<0){
					uni.showToast({
						title: "没积分了~~",
						icon: 'erro'
					})
				}
				if (this.isRunning) return;
				let userinfo = uni.getStorageSync("USER_INFO");
				if (userinfo == '') {
					uni.redirectTo({
						url: '../login/login'
					});
				}
				let that = this;
				this.isRunning = true;
				let n = this.isOne?0:5;
				this.isOne = false;
				let indexSelect = 0;
				let i = 0;
				let randomNum = this.random(3);
				
				let timer = setInterval(() => {
					++indexSelect;
					//这里用y=30*x+150函数做的处理.可根据自己的需求改变转盘速度
					indexSelect = indexSelect % 8;
					this.indexSelect = indexSelect;
					i += 40;
					if (i > randomNum) {
						//去除循环
						clearInterval(timer)
						timer = null;
						let value = that.awardList[indexSelect].value == '谢谢惠顾' ? (parseInt(userinfo
							.value) -n) : (parseInt(userinfo.value) + parseInt(that.awardList[
							indexSelect].value)-n);
							// value = value +this.isOne==true?5:0;
						console.log(value)
						let time = (new Date()).valueOf();
						let sign = service.encryp(userinfo.openId, time);
						uni.request({
							url: this.baseUrl + '/addValue?time='+time+"&sign="+sign,
							method: "POST",
							header: {
								'content-type': 'application/x-www-form-urlencoded',
							},
							data: {
								openId: userinfo.openId,
								sessionKey: userinfo.sessionKey,
								value:value
							},
							success(res) {
								console.log(res)
								if (res.data.code == 200) {
									uni.showToast({
										title: "恭喜您，抽中了" + that.awardList[indexSelect].name,
										icon: 'none'
									})
									let info = uni.getStorageSync("USER_INFO");
									info.value = value;
									that.value = value;
									uni.setStorageSync("USER_INFO", info);
								} else {
									uni.showToast({
										title: res.data.msg,
										icon: 'erro'
									})
								}
							}
						})
						this.isRunning = false
					}
				}, (70 + i))
			}
		}
	}
</script>

<style lang="scss">
	page {
		background-image: linear-gradient(to right, #fa709a 0%, #fee140 100%);
	}

	.container {
		height: 600rpx;
		width: 650rpx;
		background-color: #fc4034;
		margin: 80rpx auto;
		border-radius: 40rpx;
		box-shadow: 0 10px 0 #d80014;
		position: relative;
	}

	.tui-container-in {
		width: 580rpx;
		height: 530rpx;
		background-color: #d80014;
		border-radius: 40rpx;
		position: absolute;
		left: 0;
		right: 0;
		top: 0;
		bottom: 0;
		margin: auto;
	}

	/**小圆点 start*/

	.tui-dot {
		position: absolute;
		display: block;
		border-radius: 50%;
		height: 20rpx;
		width: 20rpx;
	}

	.tui-dot:nth-child(odd) {
		background: #fff;
		animation: 0.5s odd linear infinite;
	}

	.tui-dot:nth-child(even) {
		background: #fcf400;
		animation: 0.5s even linear infinite;
	}

	.tui-dot-1 {
		left: 15rpx;
		top: 15rpx;
	}

	.tui-dot-2 {
		left: 117.5rpx;
		top: 7.5rpx;
	}

	.tui-dot-3 {
		left: 220rpx;
		top: 7.5rpx;
	}

	.tui-dot-4 {
		left: 322.5rpx;
		top: 7.5rpx;
	}

	.tui-dot-5 {
		left: 425rpx;
		top: 7.5rpx;
	}

	.tui-dot-6 {
		left: 527.5rpx;
		top: 7.5rpx;
	}

	.tui-dot-7 {
		left: 620rpx;
		top: 15rpx;
	}

	.tui-dot-8 {
		left: 622rpx;
		top: 109rpx;
	}

	.tui-dot-9 {
		left: 622rpx;
		top: 203rpx;
	}

	.tui-dot-10 {
		left: 622rpx;
		top: 297rpx;
	}

	.tui-dot-11 {
		left: 622rpx;
		top: 391rpx;
	}

	.tui-dot-12 {
		left: 622rpx;
		top: 485rpx;
	}

	.tui-dot-13 {
		left: 620rpx;
		top: 565rpx;
	}

	.tui-dot-14 {
		left: 517.5rpx;
		top: 572rpx;
	}

	.tui-dot-15 {
		left: 415rpx;
		top: 572rpx;
	}

	.tui-dot-16 {
		left: 312.5rpx;
		top: 572rpx;
	}

	.tui-dot-17 {
		left: 210rpx;
		top: 572rpx;
	}

	.tui-dot-18 {
		left: 107.5rpx;
		top: 572rpx;
	}

	.tui-dot-19 {
		left: 15rpx;
		top: 565rpx;
	}

	.tui-dot-20 {
		left: 7.5rpx;
		top: 471rpx;
	}

	.tui-dot-21 {
		left: 7.5rpx;
		top: 377rpx;
	}

	.tui-dot-22 {
		left: 7.5rpx;
		top: 283rpx;
	}

	.tui-dot-23 {
		left: 7.5rpx;
		top: 189rpx;
	}

	.tui-dot-24 {
		left: 7.5rpx;
		top: 95rpx;
	}

	@-webkit-keyframes odd {
		0% {
			background: #fff;
		}

		100% {
			background: #fcf400;
		}
	}

	@keyframes odd {
		0% {
			background: #fff;
		}

		100% {
			background: #fcf400;
		}
	}

	@-webkit-keyframes even {
		0% {
			background: #fcf400;
		}

		100% {
			background: #fff;
		}
	}

	@keyframes even {
		0% {
			background: #fcf400;
		}

		100% {
			background: #fff;
		}
	}

	/**小圆点 end*/

	.tui-content-out {
		position: absolute;
		height: 150rpx;
		width: 168rpx;
		background-color: #fcecec;
		border-radius: 15rpx;
		box-shadow: 0 4px 0 #fcc8d0;
	}

	/* 580 530  */

	.tui-award-1 {
		left: 24rpx;
		top: 24rpx;
	}

	.tui-award-2 {
		left: 206rpx;
		top: 24rpx;
	}

	.tui-award-3 {
		left: 388rpx;
		top: 24rpx;
	}

	.tui-award-4 {
		left: 388rpx;
		top: 188rpx;
	}

	.tui-award-5 {
		left: 388rpx;
		top: 352rpx;
	}

	.tui-award-6 {
		left: 206rpx;
		top: 352rpx;
	}

	.tui-award-7 {
		left: 24rpx;
		top: 352rpx;
	}

	.tui-award-8 {
		left: 24rpx;
		top: 188rpx;
	}

	/**居中 加粗*/

	.tui-btn-start {
		position: absolute;
		top: 188rpx;
		left: 206rpx;
		border-radius: 15rpx;
		height: 150rpx;
		width: 168rpx;
		background-color: #fc4034;
		box-shadow: 0 4px 0 #fcc8d0;
		color: #fcf400;
		text-align: center;
		font-size: 32rpx;
		font-weight: bold;
		line-height: 150rpx;
	}

	.tui-ative {
		opacity: 0.6 !important;
	}

	.tui-award-image {
		position: absolute;
		margin: auto;
		top: 0;
		left: 0;
		bottom: 0;
		right: 0;
		height: 50rpx;

		text-align: center;
		line-height: 50rpx;
		color: #000000;
	}

	.tui-awardSelect {
		background-color: #fcf400 !important;
		box-shadow: 0 4px 0 rgb(240, 208, 12) !important;
	}
</style>
