<template>
  <view>
    <custom-circle-list showArrow :list="myCreateCircle" :showNote="false" />
    <view class="empty" v-if="myCreateCircle.length === 0">
      <u-empty mode="list"></u-empty>
    </view>
  </view>
</template>

<script>
import { mapState } from 'vuex'
export default {
  data() {
    return {}
  },

  computed: {
    ...mapState('circle', ['myCreateCircle'])
  },

  onShow() {
    this.$store.dispatch('circle/getMyCreateCircle')
  }
}
</script>

<style lang="scss">
</style>
