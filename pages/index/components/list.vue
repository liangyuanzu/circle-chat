<template>
	<view>
		<uni-list>
		    <uni-list :border="true">
		        <uni-list-chat v-for="(item, index) in list" :key="index" :title="item.title" :avatar="item.img_url" :note="item.note">
		            <view class="chat-custom-right">
		                <text class="chat-custom-text">
											<text>人数 {{item.people_num}}</text>
											<text>范围：{{item.range}}</text>
										</text>
		            </view>
		        </uni-list-chat>
		    </uni-list>
		</uni-list>
	</view>
</template>

<script>
	export default {
		components: {},
		data() {
			return {
				list: [{
					title: '圈名称',
					img_url: 'https://img-cdn-qiniu.dcloud.net.cn/new-page/uni.png',
					note: '您收到一条新的消息',
					people_num: '999',
					range: '500m'
				},{
					title: '圈名称',
					img_url: 'https://img-cdn-qiniu.dcloud.net.cn/new-page/uni.png',
					note: '您收到一条新的消息',
					people_num: '999',
					range: '500m'
				},{
					title: '圈名称',
					img_url: 'https://img-cdn-qiniu.dcloud.net.cn/new-page/uni.png',
					note: '您收到一条新的消息',
					people_num: '999',
					range: '500m'
				}]
			}
		},

		methods: {
			
		}
	}
</script>

<style lang="scss">
.chat-custom-right {
	.chat-custom-text {
		font-size: 12px;
		color: #999;

		text:nth-of-type(1) {
			margin-right: 50rpx;
		}
	}
}
</style>
