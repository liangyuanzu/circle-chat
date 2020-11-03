<template>
  <view>
    <custom-update-avatar
      title="头像"
      :src="circleInfo.img"
      isCircle
      :circleId="circleInfo.circleId"
    ></custom-update-avatar>
  </view>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  data() {
    return {}
  },

  computed: {
    ...mapGetters('circle', ['circleInfo'])
  },

  onLoad({ circleId }) {
    this.$store.dispatch('circle/getCircleInfo', circleId)
  }
}
</script>

<style lang="scss">
</style>
