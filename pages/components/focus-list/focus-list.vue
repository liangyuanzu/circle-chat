<template>
  <view>
    <u-tabs
      :list="optionList"
      :is-scroll="false"
      :show-bar="showBar"
      :current="current"
      @change="change"
    ></u-tabs>

    <view v-for="(item, index) in focusList" :key="index">
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

      <view v-else-if="focusList[type - 1].length > 0">
        <custom-focus-list
          v-if="type === index + 1"
          :list="item"
          @focusClick="onFocus"
        ></custom-focus-list>
      </view>

      <view class="empty" v-else>
        <u-empty mode="list"></u-empty>
      </view>
    </view>
  </view>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  data() {
    return {
      optionList: [
        {
          name: '我的关注'
        },
        {
          name: '关注我的'
        }
      ],
      current: 0,
      loading: true,
      list: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
    }
  },

  computed: {
    ...mapGetters('focus', ['myFocus', 'focusMy', 'focusList']),
    type() {
      return this.current + 1
    },

    showBar() {
      // #ifdef MP-BAIDU
      return false
      // #endif
      return true
    }
  },

  onShow() {
    this.getList(this.type)
  },

  methods: {
    getList(type) {
      this.$store
        .dispatch('focus/getFocusList', type)
        .then(() => (this.loading = false))
    },

    change(index) {
      this.current = index
      if (this.type === 1 && this.myFocus.length === 0) {
        this.getList(this.type)
      } else if (this.type === 2 && this.focusMy.length === 0) {
        this.getList(this.type)
      }
    },

    async onFocus() {
      await this.getList(this.type)
      await this.$store.dispatch('chat/getOldChatList', 0)
      await this.$store.dispatch('chat/getNoReadNum')
    }
  }
}
</script>

<style lang="scss">
</style>
