<template>
  <view>
    <u-index-list :scrollTop="scrollTop" :index-list="letterArr">
      <view v-for="(item, index) in indexList" :key="index">
        <u-index-anchor :index="item.letter" />
        <custom-focus-list
          :list="item.list"
          isMargin
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
    ...mapState('circle', ['indexList']),
    letterArr() {
      return this.indexList.map((i) => i.letter)
    }
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
      this.$store
        .dispatch('circle/getIndexList', this.circleId)
        .then(async () => {
          await this.$store.dispatch('chat/getOldChatList', 0)
          await this.$store.dispatch('chat/getNoReadNum')
        })
    }
  }
}
</script>

<style lang="scss">
</style>
