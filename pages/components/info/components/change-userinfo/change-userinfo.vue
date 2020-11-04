<template>
  <view>
    <custom-update-info
      :title="title"
      :data="data"
      :isInput="isUsername"
      :isTextarea="isAutograph"
      @top="save"
    ></custom-update-info>
  </view>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  data() {
    return {
      title: '',
      data: '',
      isUsername: false,
      isAutograph: false
    }
  },

  computed: {
    ...mapGetters('user', ['username', 'autograph'])
  },

  onLoad({ title }) {
    this.title = title
    if (this.title === '昵称') {
      this.data = this.username
      this.isUsername = true
    }
    if (this.title === '个性签名') {
      this.data = this.autograph
      this.isAutograph = true
    }
  },

  methods: {
    save(content) {
      if (this.isUsername) {
        this.commit({ username: content })
      } else if (this.isAutograph) {
        this.commit({ autograph: content })
      }
    },

    commit(data) {
      uni.showLoading()
      this.$store
        .dispatch('user/updateMessage', data)
        .then(() => {
          uni.hideLoading()
          setTimeout(() => {
            uni.showToast({
              title: '修改成功',
              icon: 'none'
            })
            setTimeout(() => {
              this.back()
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
