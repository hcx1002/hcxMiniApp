<template>
	<view class="snow-container">
	    <view class="snow foreground"></view>
	    <view class="snow foreground layered"></view>
	    <view class="snow middleground"></view>
	    <view class="snow middleground layered"></view>
	    <view class="snow background"></view>
	    <view class="snow background layered"></view>
		<view style="color: #FFF;padding: 20rpx;margin-top: 200px;">
			<view style="font-size: 60rpx;">《幻彩希》</view>
			<view>
				<view style="text-indent: 2em;">幻彩希记录和了解网络上的所见所闻，所有的资源皆来源互联网，本着分享的原则为大家提供服务，如有侵权请及时与客服联系。</view>
				<view>免责声明</view>
				<view style="text-indent: 2em;">
					本站提供的一切软件、教程和内容信息仅限用于学习和研究目的；不得将上述内容用于商业或者非法用途，否则，一切后果请用户自负。本站信息来自网络收集整理，版权争议与本站无关。
				</view>
				<view style="text-indent: 2em;color: #555;font-size: 28rpx;">图标来源：https://www.iconfont.cn/collections/detail?spm=a313x.7781069.1998910419.d9df05512&cid=39034</view>
			</view>
		</view>
	</view>
</template>

<script>
</script>

<style lang="scss">
	.snow-container {
	    position: absolute;
	    height: 100%;
	    width: 100%;
	    max-width: 100%;
	    top: 0;
	    overflow: hidden;
	    z-index: 2;
	    pointer-events: none;
	    background-color: black;
	}
	.snow {
	    display: block;
	    position: absolute;
	    z-index: 2;
	    top: 0;
	    right: 0;
	    bottom: 0;
	    left: 0;
	    pointer-events: none;
	    -webkit-transform: translate3d(0, -100%, 0);
	    transform: translate3d(0, -100%, 0);
	    -webkit-animation: snow linear infinite;
	    animation: snow linear infinite;
	}
	.snow.foreground {
	    background-image: url("https://dl6rt3mwcjzxg.cloudfront.net/assets/snow/snow-large-075d267ecbc42e3564c8ed43516dd557.png");
	    -webkit-animation-duration: 15s;
	    animation-duration: 15s;
	}
	.snow.foreground.layered {
	    -webkit-animation-delay: 7.5s;
	    animation-delay: 7.5s;
	}
	.snow.middleground {
	    background-image: url("https://dl6rt3mwcjzxg.cloudfront.net/assets/snow/snow-medium-0b8a5e0732315b68e1f54185be7a1ad9.png");
	    -webkit-animation-duration: 20s;
	    animation-duration: 20s;
	}
	.snow.middleground.layered {
	    -webkit-animation-delay: 10s;
	    animation-delay: 10s;
	}
	.snow.background {
	    background-image: url("https://dl6rt3mwcjzxg.cloudfront.net/assets/snow/snow-small-1ecd03b1fce08c24e064ff8c0a72c519.png");
	    -webkit-animation-duration: 25s;
	    animation-duration: 25s;
	}
	.snow.background.layered {
	    -webkit-animation-delay: 12.5s;
	    animation-delay: 12.5s;
	}
	@-webkit-keyframes snow {
	    0% {
	        -webkit-transform: translate3d(0, -100%, 0);
	        transform: translate3d(0, -100%, 0);
	    }
	    100% {
	        -webkit-transform: translate3d(5%, 100%, 0);
	        transform: translate3d(5%, 100%, 0);
	    }
	}
	@keyframes snow {
	    0% {
	        -webkit-transform: translate3d(0, -100%, 0);
	        transform: translate3d(0, -100%, 0);
	    }
	    100% {
	        -webkit-transform: translate3d(5%, 100%, 0);
	        transform: translate3d(5%, 100%, 0);
	    }
	}
</style>
