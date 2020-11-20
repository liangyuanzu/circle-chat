<template>
  <view>
    <custom-circle-list showArrow :list="myJoinCircle" />
    <view class="empty" v-if="myJoinCircle.length === 0">
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
    ...mapState('circle', ['myJoinCircle'])
  },

  onShow() {
    this.$store.dispatch('circle/getMyJoinCircle')
  }
}
</script>

<style lang="scss">
</style>
