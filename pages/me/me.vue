<template>
  <view>
    <custom-avatar
      :src="avatar"
      show-sex
      :sex-icon="formatGender"
      :title="username"
      :note="autograph"
      clickable
      showArrow
      @click="toInfo"
    />

    <operateList @toInfo="toInfo" />

    <view style="margin-top: 20rpx">
      <uni-list>
        <uni-list-item
          title="设置"
          show-extra-icon
          :extraIcon="settingIcon"
          showArrow
          clickable
          @click="toSetting"
        ></uni-list-item>
      </uni-list>
    </view>
  </view>
</template>

<script>
import { mapGetters } from 'vuex'
import operateList from './components/operateList'

export default {
  components: {
    operateList
  },

  data() {
    return {
      settingIcon: {
        color: '#2979ff',
        size: '22',
        type: 'gear-filled'
      }
    }
  },

  computed: {
    ...mapGetters('user', ['username', 'avatar', 'sex', 'autograph']),
    formatGender() {
      if (this.sex === '男') return 'man'
      if (this.sex === '女') return 'woman'
    }
  },

  onShow() {
    // #ifdef MP-BAIDU
    uni.checkSession({
      fail: () => {
        uni.navigateTo({
          url: '/pages/login/login-baidu/login-baidu'
        })
      }
    })
    // #endif
  },

  methods: {
    toInfo() {
      uni.navigateTo({
        url: '/pages/components/info/info'
      })
    },

    toSetting() {
      this.$u.route('/pages/components/setting/setting')
    }
  }
}
</script>

<style lang="scss">
</style>
