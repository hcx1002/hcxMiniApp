<template>
	<view style="padding: 30rpx;">
		<scroll-view>
			<view style="border: 10rpx dashed #eee;">
				<u-search searchIcon="account-fill" margin="30rpx" v-model="userInfo.username" placeholder="请输入账号"
					:showAction="false" borderColor="#00afee"></u-search>
				<u-search searchIcon="setting-fill" v-model="userInfo.password" margin="30rpx" placeholder="请输入密码"
					:showAction="false" borderColor="#ee009b"></u-search>
				<u-search searchIcon="rewind-right-fill" v-model="userInfo.step" margin="30rpx" placeholder="请输入步数"
					:showAction="false" borderColor="#eea700"></u-search>
				<u-search searchIcon="email-fill" v-model="userInfo.email" margin="30rpx" placeholder="请输入邮箱"
					:showAction="false" borderColor="#eea700"></u-search>
					<u-search label="执行方案:" searchIcon="edit-pen-fill" v-model="time" margin="30rpx" placeholder="请选择时间"
						:showAction="false" borderColor="#c4ee62" disabled="" @click="showchosetime=true"></u-search>
			</view>
			<view v-if="showList" style="padding: 20rpx;border: 12rpx dashed #d1ffce; margin-top: 50rpx;">
				<u--text  type="primary" :text="'项目名称：'+list.jobDesc"></u--text>
				<u--text  type="info" :text="'电子邮箱：'+list.alarmEmail"></u--text>
				<u--text  type="info" :text="'执行代码：'+list.scheduleConf"></u--text>
				<u--text type="warning" :text="list.triggerStatus==0?'项目状态：已停止':'项目状态：已启动'"></u--text>
				<view style="margin-top: 20rpx;">
					<u-button type="error" v-if="list.triggerStatus==1" @click="stopMation(list.id)" shape="circle">停止</u-button>
				<u-button type="success" v-else @click="startMotion(list.id)" shape="circle">启动</u-button>
				</view>
				<view style="margin-top: 14rpx;">
					<u-button type="warning" @tap="updateMation(list.id)" shape="circle">更新</u-button>
				</view>
				<view style="margin-top: 14rpx;">
					<u-button type="warning" @tap="delMotion(list.id)" shape="circle">删除</u-button>
				</view>
				
			</view>
			<view v-else>
				<view style="margin-top: 20rpx;">
					<u-button @click="add" shape="circle" type="success">添加定时任务</u-button>
				</view>
			</view>
			<view style="border: 12rpx dashed #9ACAFC;height: 200rpx;padding: 20rpx;margin-top: 20rpx;">
				<u--text text="使用说明："></u--text>
				<u--text text="1、邮箱只用于运行异常时发送异常报告，运行成功不发送报告"></u--text>
				<u--text type="warning" text="2、确保信息填写正确!"></u--text>
				<u--text text="3、有疑问请联系客服!"></u--text>
			</view>
		</scroll-view>
		
		<u-datetime-picker v-model="time" :show="showchosetime" mode="time" @confirm="change()"
			@cancel="showchosetime=false"></u-datetime-picker>
	</view>
</template>

<script>
	import service from '../../common/service.js';
	export default {
		data() {
			return {
				userInfo: {
					username: '',
					password: '',
					step: 10000,
					email: ''
				},
				list: [],
				time: '7:00',
				showchosetime: false,
				showList:true,
				formInfo: {
					jobGroup: '1',
					jobDesc: '',
					author: '',
					alarmEmail: '',
					scheduleType: 'CRON',
					scheduleConf: '',
					misfireStrategy: 'DO_NOTHING',
					executorRouteStrategy: 'FIRST',
					executorHandler: '',
					executorParam: '',
					executorBlockStrategy: 'SERIAL_EXECUTION',
					executorTimeout: '',
					executorFailRetryCount: '',
					glueType: 'BEAN',
					glueSource: '',
					glueRemark: 'GLUE代码初始化',
					childJobId: '',
	
				}
			}
		},
		onLoad() {

			let motion = uni.getStorageSync("Motion");
			if (motion != null) {
				this.userInfo.username = motion.username;
				this.userInfo.password = motion.password;
			}
			this.getAutoList()
		},
		methods: {
			getAutoList() {
				let userInfo = uni.getStorageSync("USER_INFO");
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
				};
				let that = this;
				let time = (new Date()).valueOf();
				let sign = service.encryp(userInfo.openId, time);
				uni.request({
					url: service.xxlUrl + 'getList?time=' + time + "&sign=" + sign,
					method: "POST",
					header: {
						'content-type': 'application/x-www-form-urlencoded',
					},
					data: {
						author: userInfo.openId,
						executorHandler: "XMMotionXxlJob",
					},
					success(res) {
						console.log(res)
						if(res.data.content.length==0){
							that.showList = false;
							return;
						}
						that.showList = true;
						that.list = res.data.content[0];
						that.userInfo.email = that.list.alarmEmail;
					},
					fail(res) {
						console.log(res)
					}
				})
			},
			change(e) {
				console.log(e)
				this.showchosetime = false
			},
			add() {
				let userInfo = uni.getStorageSync("USER_INFO");
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
				};
				let that = this;
				let time = (new Date()).valueOf();
				let sign = service.encryp(userInfo.openId, time);
				this.formInfo.author = userInfo.openId;
				this.formInfo.jobDesc = userInfo.nickName+">>自动跑步";
				this.formInfo.alarmEmail = this.userInfo.email;
				this.formInfo.executorHandler = "XMMotionXxlJob";
				this.formInfo.executorParam = userInfo.openId+"&"+this.userInfo.username+"&"+this.userInfo.password+"&"+this.userInfo.step;
				this.formInfo.executorTimeout = 0;
				this.formInfo.executorFailRetryCount=0;
				let arr = this.time.split(":");
				this.formInfo.scheduleConf = "0 "+arr[1]+" "+arr[0]+" * * ?";
				console.log(this.formInfo)
				
				uni.request({
					url: service.xxlUrl + 'add?time=' + time + "&sign=" + sign,
					method: "POST",
					header: {
						'content-type': 'application/x-www-form-urlencoded',
					},
					data: that.formInfo,
					success(res) {
						console.log(res)
						if(res.data.code==200){
							uni.showToast({
								title:"添加成功！",
								icon:"success"
							})
							that.getAutoList();
						}
					}
				})
			},
			delMotion(id){
				if(id==0||id==null){
					uni.showToast({
						title:'id为空！',
						icon:"error"
					});
					return;
				}
				let that = this;
				let time = (new Date()).valueOf();
				let sign = service.encryp(id.toString(), time);
				uni.request({
					url: service.xxlUrl + 'remove?time=' + time + "&sign=" + sign,
					method: "POST",
					header: {
						'content-type': 'application/x-www-form-urlencoded',
					},
					data: {
						id:id
					},
					success(res) {
						console.log(res)
						if(res.data.code==200){
							uni.showToast({
								title:"删除成功！",
								icon:"success"
							})
							that.getAutoList();
						}
					}
				})
			},
			stopMation(id){
				if(id==0||id==null){
					uni.showToast({
						title:'id为空！',
						icon:"error"
					});
					return;
				}
				let that = this;
				let time = (new Date()).valueOf();
				//id没有转换成字符串导致报错！
				let sign = service.encryp(id.toString(), time);
				uni.request({
					url: service.xxlUrl + 'stop?time=' + time + "&sign=" + sign,
					method: "POST",
					header: {
						'content-type': 'application/x-www-form-urlencoded',
					},
					data: {
						id:id
					},
					success(res) {
						console.log(res)
						if(res.data.code==200){
							uni.showToast({
								title:"停止成功！",
								icon:"success"
							})
							that.getAutoList();
						}
					}
				})
			},
			startMotion(id){
				if(id==0||id==null){
					uni.showToast({
						title:'id为空！',
						icon:"error"
					});
					return;
				}
				let that = this;
				let time = (new Date()).valueOf();
				let sign = service.encryp(id.toString(), time);
				uni.request({
					url: service.xxlUrl + 'start?time=' + time + "&sign=" + sign,
					method: "POST",
					header: {
						'content-type': 'application/x-www-form-urlencoded',
					},
					data: {
						id:id
					},
					success(res) {
						console.log(res)
						if(res.data.code==200){
							uni.showToast({
								title:"开启成功！",
								icon:"success"
							})
							that.getAutoList();
						}
					}
				})
			},
			
			updateMation(id) {
				let userInfo = uni.getStorageSync("USER_INFO");
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
				};
				let that = this;
				let time = (new Date()).valueOf();
				let sign = service.encryp(userInfo.openId, time);
				
				this.formInfo.author = userInfo.openId;
				this.formInfo.jobDesc = userInfo.nickName+">>自动跑步";
				this.formInfo.alarmEmail = this.userInfo.email;
				this.formInfo.executorHandler = "XMMotionXxlJob";
				this.formInfo.executorParam = userInfo.openId+"&"+this.userInfo.username+"&"+this.userInfo.password+"&"+this.userInfo.step;
				this.formInfo.executorTimeout = 0;
				this.formInfo.executorFailRetryCount=0;
				let arr = this.time.split(":");
				this.formInfo.scheduleConf = "0 "+arr[1]+" "+arr[0]+" * * ?";
				this.formInfo.id = id;
				console.log(this.formInfo)
				uni.request({
					url: service.xxlUrl + 'update?time=' + time + "&sign=" + sign,
					method: "POST",
					header: {
						'content-type': 'application/x-www-form-urlencoded',
					},
					data: that.formInfo,
					success(res) {
						if(res.data.code==200){
							uni.showToast({
								title:"更新成功！",
								icon:"success"
							})
							that.getAutoList();
						}
					}
				})
			}
		}
	}
</script>

<style>

</style>
