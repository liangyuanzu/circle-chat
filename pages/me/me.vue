<template>
  <view>
    <avatar @toInfo="toInfo" />

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
import avatar from './components/avatar'
import operateList from './components/operateList'

export default {
  components: {
    avatar,
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
