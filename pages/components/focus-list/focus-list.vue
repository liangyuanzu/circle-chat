<template>
  <view>
    <u-mask :show="showMask" :mask-click-able="false">
      <view class="mask-style">
        <view class="text-xxl text-bold text-white margin-tb">关注列表</view>
        <view class="text-xl text-white padding-xs"
          >关注和被关注会在这里显示，<br />互相关注才可聊天哦！</view
        >
        <button
          class="text-xl cu-btn round lines-white margin-top"
          @tap="konwClick"
        >
          我知道了
        </button>
      </view>
    </u-mask>

    <u-tabs
      :list="optionList"
      :is-scroll="false"
      :show-bar="showBar"
      :current="current"
      @change="change"
    ></u-tabs>

    <view v-for="(item, index) in focusList" :key="index">
      <view v-if="loading">
        <view v-for="(item, index1) in list" :key="index1">
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
        <u-empty
          :text="type === 1 ? '你还没有关注任何人' : '你还没有粉丝'"
        ></u-empty>
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
      list: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
      showMask: false
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

  onReady() {
    if (!uni.getStorageSync('focusMaskShowed')) this.showMask = true
  },

  onShow() {
    this.getList(this.type)
  },

  onLoad({ index }) {
    if (index) this.change(+index)
  },

  methods: {
    konwClick() {
      this.showMask = false
      uni.setStorageSync('focusMaskShowed', true)
    },

    getList(type) {
      this.$store
        .dispatch('focus/getFocusList', type)
        .then(() => (this.loading = false))
    },

    change(index) {
      this.current = index
      if (this.type === 1 && this.myFocus.length === 0) {
        this.loading = true
        this.getList(this.type)
      } else if (this.type === 2 && this.focusMy.length === 0) {
        this.loading = true
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
