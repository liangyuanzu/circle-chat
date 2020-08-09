<template>
	<view>
		<!-- 自定义导航栏 -->
		<custom-nav bgColor="bg-gradual-blue" isBack="true">
			<block slot="right">
				<text class="lg cuIcon-roundadd addIcon" @click="isShowMenu=!isShowMenu"></text>
			</block>
			<block slot="content">附近的圈</block>
		</custom-nav>

		<view class="custom-select" v-if="isShowMenu">
			<text class="lg cuIcon-usefullfill custom-icon"></text>
			<view class="cu-list menu sm-border card-menu custom-menu">
				<view class="cu-item">
					<view class="content">
						<text class="cuIcon-circlefill text-grey"></text>
						<text class="text-grey">创建圈</text>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import customNav from './cu-custom.vue'
	
	export default {
		components: {
			'custom-nav': customNav
		},
		data() {
			return {
				isShowMenu: false
			}
		}
	}
</script>

<style lang="scss" scoped>
	/* 添加按钮 */
	.addIcon{
		font-size: 20px;
		margin-right: 40rpx !important;
	}
	.custom-select{
		position: relative;
		.custom-icon{
			color: #fff;
			float: right;
			margin-right: 40rpx;
			font-size: 18px;
		}
		.custom-menu{
			width: 300rpx;
			margin-right: 15rpx;
			position: absolute;
			top: 25rpx;
			right: 0;
			.cu-item{
				padding-top: 0 !important;
			}
		}
	}
</style>
