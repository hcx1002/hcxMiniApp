<template>
	<view>
		<u-button @click="subscribeMessage">订阅信息</u-button>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				templateId:'dDJsBzZyMfMm2XMI0aqYjo1vPzIbJQBNAJqaO0B4SFY'
			}
		},
		methods: {
			subscribeMessage(){
				let id = this.templateId;
				let that = this;
				uni.requestSubscribeMessage({
					tmplIds:[id],
					success(res){
						console.log(res)	
						if(res[id]=='accept'){
							that.$api.msg("订阅成功");
						}else{
							that.$api.msg("订阅失败");
						}
					},
					fail(res){
						console.log(res);
					}
				})
			}
		}
	}
</script>

<style>

</style>
