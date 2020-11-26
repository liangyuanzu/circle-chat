<template>
  <view>
    <uni-list>
      <uni-list-item
        :title="personinfo.username"
        :thumb="personinfo.img"
        thumbSize="lg"
      ></uni-list-item>
    </uni-list>

    <u-card
      :show-head="showHead"
      box-shadow="6rpx 6rpx 8rpx rgba(26, 26, 26, 0.2)"
    >
      <template #body>
        <view>
          {{ personinfo.autograph }}
        </view>
      </template>
    </u-card>
  </view>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  data() {
    return {
      showHead: false
    }
  },

  computed: {
    ...mapGetters('user', ['personinfo'])
  },

  onLoad({ personId }) {
    this.$store.dispatch('user/getPersonInfo', personId)
  }
}
</script>

<style lang="scss">
</style>
