<template>
  <view>
    <custom-circle-list showArrow :list="myJoinCircle" @click="toCircleChat" />
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
  },

  methods: {
    toCircleChat(info) {
      const circleinfo = {
        circleId: info.circleId,
        circleName: info.name,
        circleAvatar: info.img,
        circleType: info.type
      }
      this.$u.route('/pages/components/chat/chat', {
        circleinfo: JSON.stringify(circleinfo)
      })
    }
  }
}
</script>

<style lang="scss">
</style>
