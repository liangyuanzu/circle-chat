<template>
  <view>
    <!-- #ifndef MP-BAIDU -->
    <uni-list>
      <uni-list-item
        title="修改密码"
        showArrow
        clickable
        @click="changePwd"
      ></uni-list-item>
    </uni-list>
    <!-- #endif -->

    <view style="margin-top: 20rpx">
      <uni-list>
        <uni-list-item clickable @click="logout">
          <template #body>
            <view class="text-center text-red text-df" style="width: 100%"
              >退出登录</view
            >
          </template>
        </uni-list-item>
      </uni-list>

      <u-modal
        v-model="showModal"
        title="退出登录"
        content="是否确认退出登录?"
        show-cancel-button
        @confirm="confirm"
        ref="uModal"
      ></u-modal>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      showModal: false
    }
  },

  methods: {
    changePwd() {
      this.$u.route('/pages/login/forget')
    },

    logout() {
      this.showModal = true
    },

    confirm() {
      this.showModal = false
      uni.showLoading({
        title: '加载中...'
      })
      // #ifndef MP-BAIDU
      this.$store
        .dispatch('user/logout')
        .then(() => {
          uni.hideLoading()
          setTimeout(() => {
            uni.showToast({
              title: '退出成功！',
              icon: 'none'
            })
            setTimeout(() => {
              uni.reLaunch({
                url: '/pages/login/login'
              })
            }, 500)
          }, 500)
        })
        .catch(() => {
          uni.hideLoading()
        })
      // #endif

      // #ifdef MP-BAIDU
      this.$store
        .dispatch('user/logout_baidu')
        .then(() => {
          uni.hideLoading()
          setTimeout(() => {
            uni.showToast({
              title: '退出成功！',
              icon: 'none'
            })
            setTimeout(() => {
              uni.reLaunch({
                url: '/pages/msg/msg'
              })
            }, 500)
          }, 500)
        })
        .catch(() => {
          uni.hideLoading()
        })
      // #endif
    }
  }
}
</script>

<style lang="scss">
</style>
