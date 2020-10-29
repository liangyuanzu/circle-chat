<template>
  <view>
    <uni-nav-bar fixed status-bar left-icon="back" @clickLeft="back">
      <template #left>
        <view>{{ title }}</view>
      </template>
      <template #right>
        <button type="primary" size="mini" :disabled="disabled" @tap="save">
          保存
        </button>
      </template>
    </uni-nav-bar>

    <u-field
      v-model="name"
      v-if="title === '昵称'"
      focus
      :clearable="clearable"
      label-width="0"
      style="background-color: #fff"
    ></u-field>
  </view>
</template>

<script>
import { mapGetters } from 'vuex'
import uniNavBar from '@/components/uni-nav-bar/uni-nav-bar.vue'

export default {
  components: { uniNavBar },

  data() {
    return {
      title: '',
      name: '',
      clearable: false
    }
  },

  computed: {
    ...mapGetters('user', ['username', 'sex', 'birthday', 'autograph']),
    disabled() {
      if (this.name) return false
      return true
    }
  },

  onLoad(options) {
    this.title = options.title
    this.name = this.username
  },

  methods: {
    back() {
      this.$u.route({ type: 'back' })
    },

    save() {
      switch (this.title) {
        case '昵称':
          this.commit({ username: this.name })
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
