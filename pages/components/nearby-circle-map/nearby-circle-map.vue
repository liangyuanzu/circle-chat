<template>
  <view>
    <!-- <web-view src="/hybrid/html/nearby-circle-map.html"></web-view> -->
    <web-view :src="nearbyCircleMapUrl"></web-view>
  </view>
</template>

<script>
import { nearbyCircleMapUrl } from '@/config/config.js'

export default {
  data() {
    return {
      nearbyCircleMapUrl
    }
  }
}
</script>

<style lang="scss">
</style>
