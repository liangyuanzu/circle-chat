<template>
  <view>
    <nav-bar />
    <chat-list :list="list" />
  </view>
</template>

<script>
import navBar from './components/nav-bar.vue'
import chatList from './components/chat-list.vue'
import localStore from '@/helpers/localStore.js'
import { chatListName } from '@/config/config.js'
import { toFirst } from '@/helpers/utils.js'
import { chatFormat } from '@/helpers/chat.js'
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
      console.log('正在监听', res)
      // 置顶更新
      const index = this.list?.findIndex(
        (val) => val.userId === res.body.userId
      )
      // 会话存在
      if (index !== -1) {
        this.list[index].data = res.body.content
        this.list[index].time = res.body.createTime
        this.list[index].noReadNum++
        // 置顶
        this.list = toFirst(this.list, index)
        return
      }
      // 追加
      const user = {
        userId: this.userId,
        toUser: this.CurrentToUser.userId,
        toUserName: this.CurrentToUser.username,
        toUserAvatar: this.CurrentToUser.avatar
      }
      let obj = chatFormat(res, { type: 'chatList' }, user)
      obj.noReadNum = 1
      this.list.unshift(obj)
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
