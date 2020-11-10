<template>
  <view>
    <uni-list :border="isBorder">
      <uni-list-chat
        v-for="item in list"
        :key="formatKey(item)"
        :title="item.circleId ? item.circleName : item.username"
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
    formatKey(item) {
      return item.userId ?? item.circleId
    },

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
      if (item.userId) {
        const userinfo = {
          userId: item.userId,
          username: item.username,
          avatar: item.avatar
        }
        uni.navigateTo({
          url:
            '/pages/components/chat/chat?userinfo=' + encodeURIComponent(JSON.stringify(userinfo))
        })
      } else if (item.circleId) {
        const circleinfo = {
          circleId: item.circleId,
          circleName: item.circleName,
          circleAvatar: item.avatar,
          circleType: item.circleType,
          member: item.member
        }
        uni.navigateTo({
          url:
            '/pages/components/chat/chat?circleinfo=' +
            encodeURIComponent(JSON.stringify(circleinfo))
        })
      }

      // 读取当前会话
      read(item)
    }
  }
}
</script>

<style lang="scss">
</style>
