<template>
  <view>
    <!-- 默认加圈 -->
    <uni-list>
      <uni-list-item title="默认加圈" note="开启后，将会自动为您加入一些圈。">
        <template #footer>
          <u-switch
            size="40"
            v-model="addChecked"
            @change="addConfirm"
          ></u-switch>
        </template>
      </uni-list-item>

      <!-- 消息通知 -->
      <!--
      <uni-list-item title="消息通知">
        <template #footer>
          <u-switch
            size="40"
            v-model="noticeChecked"
            @change="noticeConfirm"
          ></u-switch>
        </template>
      </uni-list-item>
			-->
    </uni-list>
    <!-- #ifndef MP-BAIDU -->
    <view class="margin-top-sm">
      <uni-list>
        <uni-list-item
          title="修改密码"
          showArrow
          clickable
          @click="changePwd"
        ></uni-list-item>
      </uni-list>
    </view>
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
        confirm-color="#fa3534"
        @confirm="confirm"
        ref="uModal"
      ></u-modal>
    </view>
  </view>
</template>

<script>
import { mapState } from 'vuex'

export default {
  data() {
    return {
      addChecked: false,
      noticeChecked: false,
      showModal: false // 退出登录
    }
  },

  computed: {
    ...mapState('user', ['setting'])
  },

  async onLoad() {
    await this.$store.dispatch('user/getUserSetting')
    if (this.setting.default === '111') this.addChecked = true
    if (this.setting.notice) this.noticeChecked = true
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
              uni.switchTab({
                url: '/pages/msg/msg'
              })
            }, 500)
          }, 500)
        })
        .catch(() => {
          uni.hideLoading()
        })
      // #endif
    },

    addConfirm() {
      uni.showLoading({
        title: '设置中...'
      })
      this.$store
        .dispatch('user/userSet', {
          defaultAdd: this.addChecked ? '111' : '000'
        })
        .then(() => {
          uni.hideLoading()
          uni.showToast({
            title: '设置成功',
            icon: 'none'
          })
        })
        .catch(() => (this.addChecked = !this.addChecked))
    },

    noticeConfirm() {
      uni.showLoading({
        title: '设置中...'
      })
      this.$store
        .dispatch('user/userSet', {
          isNotice: this.noticeChecked ? 0 : 1
        })
        .then(() => {
          uni.hideLoading()
          uni.showToast({
            title: '设置成功',
            icon: 'none'
          })
        })
        .catch(() => (this.noticeChecked = !this.noticeChecked))
    }
  }
}
</script>

<style lang="scss">
</style>
