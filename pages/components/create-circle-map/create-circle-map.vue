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
      createCircleMapUrl_baidu
    }
  },

  computed: {
    ...mapState('user', ['longitude', 'latitude']),
    createUrl() {
      // #ifndef MP-BAIDU
      return createCircleMapUrl
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
