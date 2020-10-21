<template>
  <view>
    <nav-bar />
    <chat-list :list="list" />
  </view>
</template>

<script>
import navBar from './components/nav-bar.vue'
import chatList from './components/chat-list.vue'

import {
  chatListName,
  receiveOneType,
  receiveCircleType
} from '@/config/config.js'
import localStore from '@/helpers/localStore.js'
import { toFirst } from '@/helpers/utils.js'
import { chatFormat, formatMsg } from '@/helpers/chat.js'
import { mapGetters, mapState } from 'vuex'

export default {
  components: {
    'nav-bar': navBar,
    'chat-list': chatList
  },

  data() {
    return {
      list: []
    }
  },

  computed: {
    ...mapGetters('user', ['userId']),
    ...mapState('chat', ['CurrentToUser'])
  },

  onLoad() {
    // 开启监听
    uni.$on('UserChat', (res) => {
      if (res.type === receiveOneType) {
        const index = this.list?.findIndex(
          (val) => val.userId === res.body.userId
        )
        // 会话存在
        if (index !== -1) {
          this.list[index].data = formatMsg(res.body.type, {
            content: res.body.content
          })
          this.list[index].time = res.body.createTime
          this.list[index].noReadNum++
          // 置顶
          this.list = toFirst(this.list, index)
          return
        }
        // 不存在
        const user = {
          userId: this.userId,
          toUser: this.CurrentToUser.userId,
          toUserName: this.CurrentToUser.username,
          toUserAvatar: this.CurrentToUser.avatar
        }
        let obj = chatFormat(res, { type: 'chatList' }, user)
        obj.noReadNum = 1
        this.list.unshift(obj)
      } else if (res.type === receiveCircleType) {
        const index = this.list?.findIndex(
          (val) => val.circleId === res.body.circleId
        )
        // 会话存在
        if (index !== -1) {
          // 判断是否是本人
          if (res.body.userId == this.userId) {
            this.list[index].data = formatMsg(res.body.type, {
              content: res.body.content,
              isCircle: true,
              isMe: true
            })
          } else {
            this.list[index].data = formatMsg(res.body.type, {
              username: res.body.username,
              content: res.body.content,
              isCircle
            })
          }
          this.list[index].time = res.body.createTime
          this.list[index].noReadNum++
          // 置顶
          this.list = toFirst(this.list, index)
          return
        }
        // 不存在
        const user = {
          userId: this.userId
        }
        let obj = chatFormat(res, { type: 'chatList', isCircle: true }, user)
        obj.noReadNum = 1
        this.list.unshift(obj)
      }
    })
  },

  onShow() {
    // 获取列表
    this.getList()
  },

  methods: {
    getList() {
      this.list = localStore.get(chatListName) || []
    }
  }
}
</script>

<style lang="scss">
</style>
