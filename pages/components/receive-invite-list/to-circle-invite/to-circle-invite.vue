<template>
  <view>
    <custom-circle-detail :circleInfo="circleInfo"></custom-circle-detail>

    <view class="padding margin-top-lg" v-if="handle">
      <u-button style="width: 100%">{{ agree ? '已同意' : '已拒绝' }}</u-button>
    </view>

    <view class="flex justify-between padding margin-top-lg" v-else>
      <u-button style="width: 330rpx" @click="inviteHandle(false)"
        >拒绝</u-button
      >
      <u-button style="width: 330rpx" type="primary" @click="inviteHandle(true)"
        >同意</u-button
      >
    </view>

    <u-toast ref="uToast" position="top" />
  </view>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  data() {
    return {
      handle: false,
      agree: false
    }
  },

  computed: {
    ...mapGetters('circle', ['circleInfo'])
  },

  onLoad({ circleId, handle, agree }) {
    this.handle = handle
    this.agree = agree
    this.$store.dispatch('circle/getCircleInfo', circleId)
  },

  methods: {
    inviteHandle(flag) {
      uni.showLoading({
        title: '加载中...'
      })
      this.$store
        .dispatch('invite/agreeInvite', {
          circleId: this.circleInfo.circleId,
          flag
        })
        .then(() => {
          uni.hideLoading()
          if (flag) {
            this.$refs.uToast.show({
              title: '已同意',
              type: 'success',
              url: '/pages/components/chat/chat',
              params: {
                circleInfo: encodeURIComponent(JSON.stringify(this.circleInfo))
              }
            })
          } else {
            this.$refs.uToast.show({
              title: '已拒绝',
              type: 'error',
              url: '/pages/components/receive-invite-list/receive-invite-list'
            })
          }
        })
    }
  }
}
</script>

<style lang="scss">
</style>
