<template>
	<view class="page index ">


		<view class="header box" >
		   <image src="../../static/main/User.png" mode="" ></image>
		   <text class="right " space="emsp">头像修改 &gt;</text>
		</view>

		<view class="info box">
			 <text>
			 <span>昵称</span>
			 </text>
			<navigator url="/pages/components/info/info">
				<text  class="right " space="emsp">个人信息 &gt; </text>
			</navigator>
		</view>

		<view class="list box">
			<span>关注列表</span>
	 	   <text class="right"> &gt;</text>
		</view>

		<view class="default box">
			<span>默认加圈</span>
		   <text class="right"> &gt; </text>
		</view>

		<view class="msg box">
			<span>消息通知</span>
		   <text class="right"> &gt;</text>
		</view>


		<view class="exit box">
			<span>退出登入</span>
		    <text class="right"> > </text>
		</view>


	</view>
</template>

<script>

</script>

<style lang="scss">


	.right{
		float: right;
		margin-right: 40rpx;
		font-weight: 500;
	}



	.header{
		height: 125rpx;
		text-align: right;
		line-height: 125rpx;

		image{
			margin: 10rpx;
			float: left;
			width: 100rpx;
			height: 100rpx;
		}
	}


	.info{
		   margin-top: 50rpx;
			height: 105rpx;
			font-size: 14rpx;
			text-align: right;
			line-height: 105rpx;
	}

	.list{
		margin-top: 50rpx;
		height: 105rpx;
		line-height: 105rpx;
		font-size: 14rpx;

	}
	.default{
		margin-top: 50rpx;
		height: 105rpx;
		line-height: 105rpx;
		font-size: 14rpx;

	}

	.msg{
		margin-top: 50rpx;
		height: 105rpx;
		line-height: 105rpx;
		font-size: 14rpx;

	}

	.exit{
		 margin-top: 50rpx;
		height: 90rpx;
		line-height: 90rpx;
		font-size: 14rpx;

	}

	.page{
		position: relative;
		background-color: #f2f2f2;
}
.index{

		span{
			float: left;
			margin-left: 10rpx;
			font-weight: 600;
		}

}
  .box{
	   background:#ffffff;
		 font-size: 28rpx;

}
</style>
