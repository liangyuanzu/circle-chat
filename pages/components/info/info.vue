<template>
	<view class="body page">


		<view class="name box">
			<text class="bold">昵称:</text>
			<text class="div">LiRyan</text>
			<text class="span">&gt;</text>
		</view>

		<view class="sex box">
		  <text class="bold">性别:</text>
		  <text  class="div">男</text>
		  <image src="../../static/personal/u438.png" mode=""></image>
		  <text class="span">&gt;</text>
		</view>

		<view class="age box">
			<text class="bold">年龄:</text>
			<text  class="div">1</text>
			<text class="span">&gt;</text>
		</view>

		<view class="birthday box">
			<text class="bold">生日:</text>
			<text  class="div">2020/7/20</text>
			<text class="span">&gt;</text>
		</view>

		<view class="tel">
			<text class="bold">手机号码:</text>
			<text  class="div">132*****1351</text>
			<text class="span">&gt;</text>
		</view>

		<view class="password box">
			<text class="bold">修改密码</text>
			<text class="span">&gt;</text>
		</view>

		<view class="signature box">
			<text class="bold">签名:</text>
			<text  class="div">好好学习，天天向上</text>
			<text class="span">&gt;</text>
		</view>
	</view>
</template>

<script>

</script>

<style lang="scss">
	.name{
		height: 100rpx;
		line-height: 100rpx;

	}

	.sex{
		margin-top: 40rpx;
		height: 110rpx;
		line-height: 110rpx;

		 // scss
	  	image {
			  margin-top: 10rpx;
			  margin-left: 10rpx;
			  width: 20rpx;
			  height: 20rpx;
		}
	}

	.age{
		margin-top: 40rpx;
		height: 100rpx;
		line-height: 100rpx;

	}
	.birthday{
		margin-top: 40rpx;
		height: 100rpx;
		line-height: 100rpx;

	}
	.tel{
		margin-top: 40rpx;
		height: 100rpx;
		line-height: 100rpx;
		background: #ffffff;

		.div{
			font-size: 14rpx;
		}

	}
	.password{
		margin-top: 50rpx;
		height: 100rpx;
		line-height: 100rpx;

	}
	.signature{
	margin-top: 50rpx;
	height: 150rpx;
	line-height: 110rpx;

	}

	.span{
		font-weight:bold;
		float: right;
		margin-right: 30rpx;
	}
	.div{
		display: inline;
		margin-left: 30rpx;
	}
  .box{
	   background:#ffffff;
		 font-size: 28rpx;

}
.bold{
	font-weight: bold;
	padding-left: 20rpx;
}
	view{
		font-size: 28rpx;
  }

	.index{

		span{
			float: left;
			margin-left: 10rpx;
			font-weight: 600;
		}

}


</style>
