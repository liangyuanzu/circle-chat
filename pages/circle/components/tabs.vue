<template>
	<view class="content">
		<view class="tabs">
			<u-tabs :list="list" :is-scroll="false" :current="current" @change="change"></u-tabs>
		</view>

		<view class="search" @tap="changeModal" data-target="RadioModal">
			筛选
		</view>

		<view class="cu-modal" :class="modalName=='RadioModal'?'show':''" @tap="hideModal">
			<view class="cu-dialog cutom-modal" @tap.stop="">
				<radio-group class="block" @change="RadioChange">
					<view class="cu-list menu text-left">
						<view class="cu-item cutsom-item" v-for="(item,index) in search" :key="index">
							<label class="flex justify-between align-center flex-sub">
								<view class="flex-sub">{{item.name}}</view>
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
	export default {
		data() {
			return {
				list: [{
					name: '综合'
				}, {
					name: '娱乐圈'
				}, {
					name: '固定圈'
				}, {
					name: '紧急圈'
				}],
				current: 0,

				/* 筛选 */
				modalName: null,
				radio: 'radio1',
				search: [{
					name: '100米'
				},{
					name: '200米'
				},{
					name: '500米'
				},{
					name: '1000米'
				}]
			}
		},
		methods: {
			change(index) {
				this.current = index;
			},

			// 筛选
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
				this.radio = e.detail.value
			}
		}
	}
</script>

<style lang="scss">
.content {
	width: 100%;
	display: flex;

	.tabs {
		flex: 4;
	}

	.search {
		flex: 1;
		height: 40px;
		line-height: 40px;
		font-size: 15px;
		text-align: center;
		background-color: #fff;
	}

	.cutom-modal {
		width: 150rpx;
		position: absolute;
		top: 200rpx;
		right: 20rpx;
		color: #8799a3;
		.cutsom-item {
			padding: 0 20rpx;
		}
	}
}
</style>
