<template>
	<view>
		<!-- 自定义导航栏 -->
		<custom-nav bgColor="bg-gradual-blue" isBack="true">
			<block slot="right">
				<text class="lg cuIcon-roundadd addIcon"  @tap="changeModal" data-target="RadioModal"></text>
			</block>
			<block slot="content">附近的圈</block>
		</custom-nav>

		<view class="cu-modal" :class="modalName=='RadioModal'?'show':''" @tap="hideModal">
			<view class="cu-dialog cutom-modal" @tap.stop="">
				<radio-group class="block" @change="RadioChange" @click="RadioChange">
					<view class="cu-list menu text-left">
						<view class="cu-item" v-for="(item,index) in 1" :key="index">
							<label class="flex justify-between align-center flex-sub">
								<text class="cuIcon-circlefill text-grey custom-icon"></text>
								<view class="flex-sub">创建圈</view>
								<!-- <radio class="round" :class="radio=='radio' + index?'checked':''" :checked="radio=='radio' + index?true:false"
								 :value="'radio' + index"></radio> -->
							</label>
						</view>
					</view>
				</radio-group>
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
				modalName: null,
				radio: 'radio1'
			}
		},

		methods: {
			showModal(e) {
				this.modalName = e.currentTarget.dataset.target
			},
			hideModal(e) {
				this.modalName = null
			},
			changeModal(e) {
				this.modalName ? this.hideModal(e) : this.showModal(e)
			},
			RadioChange(e) {
				// this.radio = e.detail.value
				uni.navigateTo({
					url: '/pages/components/create-map/create-map'
				})
				this.hideModal()
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

.cutom-modal {
	width: 300rpx;
	position: absolute;
	top: 180rpx;
	right: 30rpx;
	color: #8799a3;

	.custom-icon{
		margin-right: 30rpx;
	}
}
</style>
