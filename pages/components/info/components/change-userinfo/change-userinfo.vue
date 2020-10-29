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

    <u-field
      type="textarea"
      maxlength="60"
      v-model="signature"
      v-if="title === '个性签名'"
      focus
      :clearable="clearable"
      label-width="0"
      style="background-color: #fff"
    >
      <template #right>
        <view class="text-sm text-grey">{{ remainNum }}</view>
      </template>
    </u-field>
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
      signature: '',
      clearable: false
    }
  },

  computed: {
    ...mapGetters('user', ['username', 'sex', 'birthday', 'autograph']),
    disabled() {
      if (this.name || this.signature) return false
      return true
    },
    remainNum() {
      if (this.signature.length == 0) {
        return 60
      } else {
        return 60 - this.signature.length
      }
    }
  },

  onLoad(options) {
    this.title = options.title
    if (this.title === '昵称') this.name = this.username
    if (this.title === '个性签名') this.signature = this.autograph
  },

  methods: {
    back() {
      this.$u.route({ type: 'back' })
    },

    save() {
      switch (this.title) {
        case '昵称':
          this.commit({ username: this.name })
        case '个性签名':
          this.commit({ autograph: this.signature })
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
