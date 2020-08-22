<template>
	<view class="content">
		<view class="info">
			<view>
				<text>昵称：</text>
				<text>Jason_liang</text>
				<text class="lg text-gray cuIcon-right"></text>
			</view>
			<view>
				<text>性别：</text>
				<text>男</text>
				<text class="cuIcon-male text-blue"></text>
				<text class="lg text-gray cuIcon-right"></text>
			</view>
			<view>
				<text>年龄：</text>
				<text>20</text>
				<text class="lg text-gray cuIcon-right"></text>
			</view>
			<view>
				<text>生日：</text>
				<text>2020/7/20</text>
				<text class="lg text-gray cuIcon-right"></text>
			</view>
			<view>
				<text>手机号码：</text>
				<text>12345678901</text>
				<text class="lg text-gray cuIcon-right"></text>
			</view>
		</view>

		<view class="chage-psd">
			<view>
				<text>修改密码</text>
				<text class="lg text-gray cuIcon-right"></text>
			</view>
		</view>

		<view class="sign">
			<view>
				<text>签名：</text>
				<text>好好学习，天天向上</text>
				<text class="lg text-gray cuIcon-right"></text>
			</view>
		</view>
	</view>
</template>

<script>

</script>

<style lang="scss">
.content {

	.info, .chage-psd, .sign {
		width: 100%;

		&>view {
			width: 100%;
			height: 100rpx;
			line-height: 100rpx;
			padding: 0 30rpx;
			margin-top: 10rpx;
			background-color: #fff;
			border-bottom: 1px solid #f1f1f1;

			&:first-child {
				margin-top: 0;
			}

			text {
				&:first-child {
					font-weight: bold;
					margin-right: 10rpx;
				}

				&:last-child {
					float: right;
				}
			}

			.cuIcon-male {
				margin-left: 10rpx;
			}
		}
	}

	.chage-psd, .sign {
		margin-top: 30rpx;
	}
}
</style>
