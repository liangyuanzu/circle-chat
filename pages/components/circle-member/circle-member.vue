<template>
  <view>
    <u-index-list :scrollTop="scrollTop">
      <view v-for="(item, index) in indexList" :key="index">
        <u-index-anchor :index="item.letter" />
        <custom-focus-list
          :list="item.list"
          @focusClick="getIndexList"
        ></custom-focus-list>
      </view>
    </u-index-list>
  </view>
</template>

<script>
import { mapState } from 'vuex'

export default {
  data() {
    return {
      scrollTop: 0,
      circleId: ''
    }
  },

  computed: {
    ...mapState('circle', ['indexList'])
  },

  onPageScroll(e) {
    this.scrollTop = e.scrollTop
  },

  onLoad({ circleId }) {
    this.circleId = circleId
    this.getIndexList()
  },

  methods: {
    getIndexList() {
      this.$store.dispatch('circle/getIndexList', this.circleId)
    }
  }
}
</script>

<style lang="scss">
</style>
