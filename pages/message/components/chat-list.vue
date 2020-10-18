<template>
  <view>
    <uni-list :border="isBorder">
      <uni-list-chat
        v-for="item in list"
        :key="item.userId"
        :title="item.username"
        :avatar="item.avatar"
        :avatarList="item.avatarList"
        :note="item.data"
        :time="formatTime(item.time)"
        :badgeText="formatBadge(item.noReadNum)"
        clickable
        @click="toChatDetail(item)"
      >
      </uni-list-chat>
    </uni-list>
  </view>
</template>

<script>
import Time from '@/helpers/time.js'
import { read } from '@/helpers/chat.js'

export default {
  data() {
    return {
      isBorder: false
    }
  },

  props: ['list'],

  computed: {},

  methods: {
    formatTime(time) {
      if (time) return Time.getTime(Number(time))
    },

    formatBadge(noReadNum) {
      if (noReadNum > 0 && noReadNum <= 99) {
        return noReadNum
      } else if (noReadNum > 99) {
        return '99+'
      }
      return ''
    },

    toChatDetail(item) {
      const userinfo = {
        userId: item.userId,
        username: item.username
      }
      uni.navigateTo({
        url: '/pages/components/chat/chat?userinfo=' + JSON.stringify(userinfo)
      })
      // 读取当前会话
      read(item)
    }
  }
}
</script>

<style lang="scss">
</style>
