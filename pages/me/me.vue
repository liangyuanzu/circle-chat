<template>
  <view>
    <avatar @toInfo="toInfo" />

    <operateList @toInfo="toInfo" />

    <view style="margin-top: 20rpx">
      <uni-list>
        <uni-list-item
          title="退出登录"
          show-extra-icon
          :extraIcon="logoutIcon"
          showArrow
          clickable
          @click="logout"
        ></uni-list-item>
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
import { mapGetters } from 'vuex'
import avatar from './components/avatar'
import operateList from './components/operateList'

export default {
  components: {
    avatar,
    operateList
  },

  data() {
    return {
      showModal: false,
      logoutIcon: {
        color: '#fa3534',
        size: '22',
        type: 'gear-filled'
      }
    }
  },

  methods: {


    toInfo() {
      uni.navigateTo({
        url: '/pages/components/info/info'
      })
    },

    logout() {
      this.showModal = true
    },

    confirm() {
      this.showModal = false
      uni.showLoading({
        title: '加载中...'
      })
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
    }
  }
}
</script>

<style lang="scss">
</style>
