<script>
import Vue from 'vue'
import { accessTokenName } from '@/config/config.js'
import localStore from '@/helpers/localStore.js'

export default {
  created() {
    // #ifdef APP-PLUS
    plus.navigator.closeSplashscreen()
    // #endif
  },

  onLaunch: function () {
    console.log('App Launch')

    uni.getSystemInfo({
      success: function (e) {
        // #ifndef MP
        Vue.prototype.StatusBar = e.statusBarHeight
        if (e.platform == 'android') {
          Vue.prototype.CustomBar = e.statusBarHeight + 50
        } else {
          Vue.prototype.CustomBar = e.statusBarHeight + 45
        }
        // #endif
        // #ifdef MP-WEIXIN
        Vue.prototype.StatusBar = e.statusBarHeight
        let custom = wx.getMenuButtonBoundingClientRect()
        Vue.prototype.Custom = custom
        Vue.prototype.CustomBar = custom.bottom + custom.top - e.statusBarHeight
        // #endif
        // #ifdef MP-ALIPAY
        Vue.prototype.StatusBar = e.statusBarHeight
        Vue.prototype.CustomBar = e.statusBarHeight + e.titleBarHeight
        // #endif
        // #ifdef MP-BAIDU
        Vue.prototype.StatusBar = e.statusBarHeight
        Vue.prototype.CustomBar = e.statusBarHeight + e.navigationBarHeight
        // #endif
      }
    })

    // 判断是否存在 token
    if (!localStore.get(accessTokenName)) {
      uni.reLaunch({
        url: '/pages/login/login'
      })
    } else {
      // 初始化
      this.$store.dispatch('user/init', {}, { root: true })
      // 连接 socket
      this.$store.dispatch('chat/open', {}, { root: true })
    }
  },
  onShow: function () {
    console.log('App Show')
  },
  onHide: function () {
    console.log('App Hide')
  }
}
</script>

<style lang="scss">
/* uview-ui */
@import 'uview-ui/index.scss';
/* color-ui */
@import 'colorui/main.css';
@import 'colorui/icon.css';
/*每个页面公共css */
</style>
