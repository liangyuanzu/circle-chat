<template>
  <view>
    <u-mask :show="showMask" :mask-click-able="false">
      <view class="mask-style">
        <view class="text-xxl text-bold text-white margin-tb">我创建的圈</view>
        <view class="text-xl text-white padding-xs"
          >创建的圈会在这里显示，<br />可以在这里快速找到你创建的圈哦！</view
        >
        <button
          class="text-xl cu-btn round lines-white margin-top"
          @tap="konwClick"
        >
          我知道了
        </button>
      </view>
    </u-mask>

    <view v-if="loading">
      <view v-for="(item, index) in list" :key="index">
        <view class="bg-white">
          <skeleton avatarSize="80rpx" avatarShape="square" :row="1">
          </skeleton>
        </view>
      </view>
    </view>

    <view v-else-if="myCreateCircle.length > 0">
      <custom-circle-list showArrow :list="myCreateCircle" :showNote="false" />
    </view>

    <view class="empty" v-else>
      <u-empty mode="list"></u-empty>
    </view>
  </view>
</template>

<script>
import { mapState } from 'vuex'
export default {
  data() {
    return {
      loading: true,
      list: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
      showMask: false
    }
  },

  computed: {
    ...mapState('circle', ['myCreateCircle'])
  },

  onReady() {
    if (!uni.getStorageSync('createMaskShowed')) this.showMask = true
  },

  onShow() {
    this.$store
      .dispatch('circle/getMyCreateCircle')
      .then(() => (this.loading = false))
  },

  methods: {
    konwClick() {
      this.showMask = false
      uni.setStorageSync('createMaskShowed', true)
    }
  }
}
</script>

<style lang="scss">
</style>
