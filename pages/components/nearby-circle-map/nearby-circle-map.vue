<template>
  <view>
    <!-- <web-view src="/hybrid/html/nearby-circle-map.html"></web-view> -->
    <web-view :src="nearbyUrl"></web-view>
  </view>
</template>

<script>
import {
  nearbyCircleMapUrl,
  nearbyCircleMapUrl_baidu
} from '@/config/config.js'
import { mapState } from 'vuex'

export default {
  data() {
    return {
      nearbyCircleMapUrl,
      nearbyCircleMapUrl_baidu
    }
  },

  computed: {
    ...mapState('user', ['longitude', 'latitude']),
    nearbyUrl() {
      // #ifndef MP-BAIDU
      return nearbyCircleMapUrl
      // #endif
      // #ifdef MP-BAIDU
      const sessionId = uni.getStorageSync('sessionId')
      return (
        nearbyCircleMapUrl_baidu +
        `?lng=${this.longitude}&lat=${this.latitude}&sessionId=${sessionId}`
      )
      // #endif
    }
  }
}
</script>

<style lang="scss">
</style>
