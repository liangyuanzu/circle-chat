<template>
  <view>
    <custom-update-info
      :title="title"
      :oldData="oldData"
      :isInput="isInput"
      :isTextarea="isTextarea"
      :isEdit="true"
      @top="save"
    ></custom-update-info>
  </view>
</template>

<script>
import localStore from '@/helpers/localStore.js'
import { mapGetters } from 'vuex'

export default {
  data() {
    return {
      title: '',
      oldData: '',
      isInput: false,
      isTextarea: false
    }
  },

  computed: {
    ...mapGetters('user', ['username', 'autograph'])
  },

  onLoad({ title }) {
    this.title = title
    if (this.title === '昵称') {
      this.oldData = this.username
      this.isInput = true
    } else if (this.title === '个性签名') {
      this.oldData = this.autograph
      this.isTextarea = true
    }
  },

  methods: {
    save(content) {
      if (this.title === '昵称') {
        this.commit({ username: content })
      } else if (this.title === '个性签名') {
        this.commit({ autograph: content })
      }
    },

    commit(newData) {
      uni.showLoading({
        title: '修改中...'
      })
      this.$store
        .dispatch('user/updateMessage', newData)
        .then(() => {
          // #ifdef MP-BAIDU
          if (newData.username) {
            this.$store.commit('user/setUsername', newData.username)
            let userinfo = localStore.get('userinfo')
            userinfo.username = newData.username
            localStore.set('userinfo', userinfo)
          } else if (newData.autograph) {
            this.$store.commit('user/setAutograph', newData.autograph)
            let userinfo = localStore.get('userinfo')
            userinfo.autograph = newData.autograph
            localStore.set('userinfo', userinfo)
          }
          // #endif
          uni.hideLoading()
          setTimeout(() => {
            uni.showToast({
              title: '修改成功',
              icon: 'none'
            })
            setTimeout(() => {
              this.$u.route({ type: 'back' })
            }, 500)
          }, 500)
        })
        .catch(() => {
          uni.hideLoading()
        })
    }
  }
}
</script>

<style lang="scss">
</style>
