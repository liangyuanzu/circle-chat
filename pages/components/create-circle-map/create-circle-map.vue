<template>
  <view>
    <!-- <web-view src="/hybrid/html/create-circle-map.html"></web-view> -->
    <web-view :src="createUrl"></web-view>
  </view>
</template>

<script>
import {
  createCircleMapUrl,
  createCircleMapUrl_baidu
} from '@/config/config.js'
import { mapState } from 'vuex'

export default {
  data() {
    return {
      createCircleMapUrl,
      createCircleMapUrl_baidu,
      localCreateCircleMapUrl: '/hybrid/html/create-circle-map.html'
    }
  },

  computed: {
    ...mapState('user', ['longitude', 'latitude']),
    createUrl() {
      // #ifndef MP
      return this.localCreateCircleMapUrl
      // #endif
      // #ifdef MP-BAIDU
      return (
        createCircleMapUrl_baidu + `?lng=${this.longitude}&lat=${this.latitude}`
      )
      // #endif
    }
  }
}
</script>

<style lang="scss">
</style>
