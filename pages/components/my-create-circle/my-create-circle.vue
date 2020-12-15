<template>
  <view>
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
      list: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
    }
  },

  computed: {
    ...mapState('circle', ['myCreateCircle'])
  },

  onShow() {
    this.$store
      .dispatch('circle/getMyCreateCircle')
      .then(() => (this.loading = false))
  }
}
</script>

<style lang="scss">
</style>
