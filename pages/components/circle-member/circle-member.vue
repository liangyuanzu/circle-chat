<template>
  <view>
    <view v-if="loading">
      <view v-for="(item, index) in list" :key="index">
        <view class="bg-white">
          <skeleton
            avatarSize="80rpx"
            avatarShape="square"
            :row="1"
            :showTitle="false"
          >
          </skeleton>
        </view>
      </view>
    </view>

    <view v-else>
      <u-index-list :scrollTop="scrollTop" :index-list="letterArr">
        <view v-for="(item, index) in indexList" :key="index">
          <u-index-anchor :index="item.letter" />
          <custom-focus-list
            :list="item.list"
            :showBtn="false"
            @focusClick="getIndexList"
          ></custom-focus-list>
        </view>
      </u-index-list>
    </view>
  </view>
</template>

<script>
import { mapState } from 'vuex'

export default {
  data() {
    return {
      scrollTop: 0,
      circleId: '',
      loading: true,
      list: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
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
      this.loading = true
      this.$store
        .dispatch('circle/getIndexList', this.circleId)
        .then(async () => {
          this.loading = false
          // this.$nextTick(() => (this.loading = false))
          await this.$store.dispatch('chat/getOldChatList', 0)
          await this.$store.dispatch('chat/getNoReadNum')
        })
    }
  }
}
</script>

<style lang="scss">
</style>
