<template>
	<view class="zq-sudoku" :style="{'background':settings.background,margin:settings.margin}">
		<view class="zq-sudoku-list" :style="{'width':sudokuWidth}">
			<block v-for="(item,index) in sudokuList" :key="index">
				<view class="zq-sudoku-item" 
					:style="{
						'width':settings.itemWidth + 'rpx',
						'height':settings.itemHeight + 'rpx'
					}">
					<view :class="{'zq-sudoku-item-shade':isClick && activeIndex == index}" :style="{'background':settings.activeColor}" v-if="settings.isActive"></view>
					<view class="zq-sudoku-item-box" :class="{'zq-sudoku-item-animation':settings.isMove}" 
						:style="{
							'--delay': index * settings.delay + 's',
							'width':settings.itemWidth + 'rpx',
							'height':settings.itemHeight + 'rpx'
						}" @click="handle(item,index,$event)">
						<slot name="item" v-bind:item="item">
							<image :style="{
								'width':(item.imgWidth || settings.imgWidth) + 'rpx',
								'height':(item.imgWidth || settings.imgHeight) + 'rpx'
							}" :src="item.icon" :mode="item.imgMode || settings.imgMode"></image>
							<text :style="{
								'fontSize':(item.fontSize || settings.fontSize) + 'rpx',
								'color':item.color || settings.color,
								'marginTop':(item.imgInterval || settings.imgInterval) + 'rpx'
								}">{{item.name}}</text>
						</slot>
					</view>
					<view class="zq-sudoku-item-border-right"
						:style="{
							'width':settings.borderWidth + 'rpx',
							'height':settings.itemHeight - settings.borderWidth - settings.interval * 2 + 'rpx',
							'top':settings.borderWidth * 0.5 + settings.interval + 'rpx',
							'right':settings.borderWidth * -0.5 + 'rpx',
							'background':settings.borderColor
						}" v-if="index % settings.column != settings.column - 1"></view>
					<view class="zq-sudoku-item-border-top" 
						:style="{
							'width':settings.itemWidth - settings.borderWidth - settings.interval * 2 + 'rpx',
							'height':settings.borderWidth + 'rpx',
							'top':settings.borderWidth * -0.5 + 'rpx',
							'left':settings.interval + settings.borderWidth * 0.5 + 'rpx',
							'background':settings.borderColor
						}" v-if="index > settings.column - 1"></view>
					<view class="zq-sudoku-item-border-bottom" 
						:style="{
							'width':settings.itemWidth - settings.borderWidth - settings.interval * 2 + 'rpx',
							'height':settings.borderWidth + 'rpx',
							'bottom':settings.borderWidth * -0.5 + 'rpx',
							'left':settings.interval + settings.borderWidth * 0.5 + 'rpx',
							'background':settings.borderColor
						}" v-if="index % settings.column > (sudokuList.length - 1) % settings.column && sudokuList.length - 1 - index < settings.column"></view>
				</view>
			</block>
		</view>
	</view>
</template>

<script>
	export default{
		props:{
			props:{
				default:()=>[],
				type:Array
			},
			list:{//{icon:"",name:"",imgWidth:0,imgHeight:0,imgInterval:0,imgMode:"aspectFill",color:"",fontSize:"",disabled}
				default:[],
				type:Array
			}
		},
		data(){
			return{
				settings:{
					width:750,//盒子的宽度
					margin:"",//盒子外边距
					background:'#ffffff00',//盒子的背景颜色
					column:3,//格子的数量 
					borderWidth:5,//边框的宽度
					borderColor:"#eeeeee88",//边框颜色
					interval:20,//格子的间距
					itemWidth:0,//格子的宽度
					itemHeight:200,//格子高度
					fontSize:24,//字号大小
					color:"#333333",//字号颜色
					imgMode:'aspectFit',//图片展示方式
					imgWidth:100,//图片大小
					imgHeight:100,//图片高度
					imgInterval:20,//图片和文字的间距
					delay:0.2,//动画延时
					isMove:true,//是否有动画
					isActive:true,//是否有点击效果
					activeColor:"#d1ebf066"//点击颜色
				},
				sudokuWidth:"100%",//盒子宽度
				sudokuList:[],//数组
				isClick:false,//是否被点击
				activeIndex:-1,//是否被点击的index
				shadeStartLeft:50,//遮罩的左边距
				shadeStartTop:50//遮罩的右边距
			}
		},
		watch:{
			props(nVal){
				this.settings = Object.assign(this.settings,this.$store && this.$store.state.zqSudokuSettings ? this.$store.state.zqSudokuSettings : {},nVal);
			},
			list(nVal){
				this.sudokuList = nVal;
			}
		},
		mounted(){
			this.settings = Object.assign(this.settings,this.$store && this.$store.state.zqSudokuSettings ? this.$store.state.zqSudokuSettings : {},this.props);

			if(this.props.width == undefined){
				const query = uni.createSelectorQuery().in(this);
				query.select(".zq-sudoku").boundingClientRect(event =>{
					if(event.width > 0){
						uni.getSystemInfo({
							success: (systemInfo) => {
								//#ifndef H5
								this.settings.width = event.width * 750 / systemInfo.screenWidth;
								this.sudokuWidth = event.width * 750 / systemInfo.screenWidth + 'rpx';		
								//#endif
								//#ifdef H5
								this.settings.width = event.width;
								this.sudokuWidth = event.width+ 'px';
								//#endif
								this.mathItemWidth();
							}
						})
					}else{
						this.mathItemWidth();
					}
				}).exec();
			}else{
				this.mathItemWidth();
			}
			
			this.sudokuList = this.list;
		},
		methods:{
			mathItemWidth(){
				if(this.settings.itemWidth == 0){
					//#ifndef H5
					this.settings.itemWidth = this.settings.width / this.settings.column;
					//#endif
					//#ifdef H5
					this.settings.itemWidth = this.settings.width*2 / this.settings.column
					//#endif
				}
			},
			handle(item,index,event){
				if(item.disabled)return
				if(!this.isClick){
					this.activeIndex = index;
					this.isClick = true;
					setTimeout(()=>{
						this.$emit("click",item,index);
						this.activeIndex = -1;
						setTimeout(()=>{
							this.isClick = false;
						},20)
					},200)
				}
			}
		}
	}
</script>

<style scoped lang="scss">
	.zq-sudoku{
		width: 100%;
		.zq-sudoku-list{
			display: flex;
			flex-direction: row;
			flex-wrap: wrap;
			.zq-sudoku-item{
				position: relative;
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: center;
				box-sizing: border-box;
				overflow: hidden;
				.zq-sudoku-item-box{
					display: flex;
					flex-direction: column;
					align-items: center;
					justify-content: center;
					box-sizing: border-box;
				}
				.zq-sudoku-item-shade{
					position: absolute;
					animation: zqSudokuShade 0.3s;
					
				}
				.zq-sudoku-item-border-right{
					position: absolute;
				}
				.zq-sudoku-item-border-top{
					position: absolute;
				}
				.zq-sudoku-item-border-bottom{
					position: absolute;
				}
			}
		}
	}
	
	.zq-sudoku-item-animation{animation: show 0.6s ease 0.1s 1 both;animation-delay: var(--delay);}
	@keyframes show{
	  0%,60%,75%,90%,100%{-webkit-transition-timing-function:cubic-bezier(0.215,.610,.355,1.000);transition-timing-function:cubic-bezier(0.215,.610,.355,1.000)}
	  0%{opacity:0;-webkit-transform:translate3d(0,100rpx,0);transform:translate3d(0,100rpx,0)}
	  60%{opacity:1;-webkit-transform:translate3d(0,-25rpx,0);transform:translate3d(0,-25rpx,0)}
	  75%{-webkit-transform:translate3d(0,10rpx,0);transform:translate3d(0,10rpx,0)}
	  90%{-webkit-transform:translate3d(0,-5rpx,0);transform:translate3d(0,-5rpx,0)}
	  100%{-webkit-transform:none;transform:none}
	}
	
	
	@keyframes zqSudokuShade{
		0%{width: 0rpx;height: 0rpx;border-radius: 50%;}
		100%{width: 500rpx;height: 500rpx;border-radius:0;}
	}
</style>
