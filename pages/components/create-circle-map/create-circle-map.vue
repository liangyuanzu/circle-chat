<template>
  <view>
    <!-- <web-view src="/hybrid/html/create-circle-map.html"></web-view> -->
    <web-view :src="createCircleMapUrl"></web-view>
  </view>
</template>

<script>
import { createCircleMapUrl } from '@/config/config.js'

export default {
  data() {
    return {
      createCircleMapUrl
    }
  }
}
</script>

<style lang="scss">
</style>
