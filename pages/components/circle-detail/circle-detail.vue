<template>
  <view>
    <custom-circle-detail :circleInfo="circleInfo"></custom-circle-detail>

    <view style="margin-top: 100rpx; padding: 0 20rpx">
      <u-button
        v-if="circleInfo.inCircle"
        type="primary"
        plain
        @click="toCircleChat"
        >发消息</u-button
      >
      <u-button
        v-else
        type="primary"
        plain
        :loading="loading"
        @click="jionCircle"
        >加入圈</u-button
      >
    </view>
  </view>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  data() {
    return {
      loading: false
    }
  },

  computed: {
    ...mapGetters('circle', ['circleInfo'])
  },

  onLoad({ circleId }) {
    this.$store.dispatch('circle/getCircleInfo', circleId)
  },

  methods: {
    toCircleChat() {
      this.$u.route({
        type: 'redirect',
        url: '/pages/components/chat/chat',
        params: {
          circleId: this.circleInfo.circleId
        }
      })
    },

    jionCircle() {
      this.loading = true
      this.$store
        .dispatch('circle/joinCircle', {
          circleId: this.circleInfo.circleId
        })
        .then(() => {
          this.loading = false
          setTimeout(() => {
            uni.showToast({
              title: '加入成功',
              icon: 'none'
            })
            setTimeout(() => {
              this.toCircleChat()
            }, 500)
          }, 500)
        })
        .catch(() => {
          this.loading = false
        })
    }
  }
}
</script>

<style lang="scss">
</style>
