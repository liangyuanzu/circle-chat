<template>
  <view>
    <view class="options">
      <u-subsection :list="optionList" :current="type" mode="subsection" active-color="#ff9900"></u-subsection>
    </view>

    <uni-list>
      <uni-list-item
        title="列表左侧带略缩图"
        thumb="https://img-cdn-qiniu.dcloud.net.cn/new-page/uni.png"
        thumb-size="lg"
        rightText="右侧文字"
      >
				<template>
					<text>关注</text>
				</template>

				<template #right>
					<text>取消关注</text>
				</template>
      </uni-list-item>
    </uni-list>
  </view>
</template>

<script>
export default {
  data() {
    return {
      optionList: [
        {
          name: "我的关注",
        },
        {
          name: "关注我的",
        },
      ],
      type: 0,
    };
  },
};
</script>

<style lang="scss">
.options {
  padding: 0 20rpx;
  box-sizing: border-box;
}
</style>
