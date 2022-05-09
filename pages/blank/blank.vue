<template>
	<view>
		<view style="width: 90%;margin: auto;margin-top: 200rpx">
			<view style="border: 14rpx dashed #e6e6e6;padding: 50rpx 26rpx;">
				<view>使用说明：</view>
			<view>可发送wx空白字符，设置wx空白昵称等</view>
			</view>
			<view style="margin-top: 200rpx;">
				<u-button type="primary" @tap="click()">复制</u-button>
			</view>
			
		</view>
		
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			}
		},
		methods: {
			click(){
				uni.setClipboardData({
				    data: 'ㅤ ㅤ ㅤ ㅤ',
				    success: function () {
				        uni.showToast({
				        	title:"复制成功！",
							icon:"none"
				        })
				    }
				});
			}
		}
	}
</script>

<style>

</style>
