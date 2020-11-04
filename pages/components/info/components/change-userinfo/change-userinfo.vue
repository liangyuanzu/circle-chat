<template>
  <view>
    <custom-update-info
      :title="title"
      :data="data"
      :isInput="isInput"
      :isTextarea="isTextarea"
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
      this.data = this.username
      this.isInput = true
    } else if (this.title === '个性签名') {
      this.data = this.autograph
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
