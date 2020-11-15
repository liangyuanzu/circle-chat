<script>
import Vue from 'vue'

export default {
  data() {
    return {
      timer: ''
    }
  },

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

    this.$store.dispatch('user/init', {}, { root: true })

    this.timer = setInterval(() => {
      this.$store.dispatch('user/getPosition', {}, { root: true })
    }, 300000)

    // #ifdef MP-BAIDU
    uni.checkSession({
      fail: () => {
        uni.reLaunch({
          url: '/pages/login/login-baidu/login-baidu'
        })
      }
    })
    // #endif

    // if (uni.getStorageSync('token')) {
    //   this.$store.dispatch('user/init', {}, { root: true })

    //   this.timer = setInterval(() => {
    //     this.$store.dispatch('user/getPosition', {}, { root: true })
    //   }, 300000)
    // } else {
    //   uni.reLaunch({
    //     url: '/pages/login/login'
    //   })
    // }
  },

  onShow: function () {
    console.log('App Show')
  },

  onHide: function () {
    console.log('App Hide')
    clearInterval(this.timer)
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
.empty {
  position: fixed;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
</style>
