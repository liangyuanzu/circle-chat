<template>
  <view class="content padding-lg">
    <view class="brand">
      <view class="logo">
        <image :src="logoUrl" />
      </view>
      <view class="margin-top-sm text-xl text-black">{{ title }}</view>
    </view>

    <u-divider half-width="50" border-color="#666" class="margin-top-xl"
      >登录帐号，可享受以下功能和权益</u-divider
    >

    <u-grid :col="3" class="margin-top-xl" hover-class="none">
      <u-grid-item v-for="(item, index) in gridList" :key="index">
        <u-icon :name="item.name" :size="46"></u-icon>
        <view class="grid-text">{{ item.tetx }}</view>
      </u-grid-item>
    </u-grid>

    <u-button
      type="primary"
      shape="circle"
      style="margin-top: 200rpx"
      open-type="getUserInfo"
      :disabled="disabled"
      @getuserinfo="decryptUserInfo"
      >百度用户授权登录</u-button
    >
  </view>
</template>

<script>
// import logoUrl from './../logo.js'
import { mapGetters } from 'vuex'

export default {
  data() {
    return {
      logoUrl: '/static/logo.png',
      title: '咸鱼有梦的圈聊软件',
      gridList: [
        {
          name: 'chat',
          tetx: '实时聊天'
        },
        {
          name: 'map',
          tetx: '地图模式'
        },
        {
          name: 'star',
          tetx: '关注他人'
        },
        {
          name: 'plus-circle',
          tetx: '创建圈聊'
        },
        {
          name: 'account',
          tetx: '个人中心'
        },
        {
          name: 'clock',
          tetx: '历史记录'
        }
      ],
      disabled: true
    }
  },

  computed: {
    ...mapGetters('user', ['userId'])
  },

  onLoad() {
    uni.showLoading({
      title: '加载中...'
    })
    uni.login({
      success: ({ code }) => {
        this.$store.dispatch('user/login_baidu', { code }).then(() => {
          uni.hideLoading()
          this.disabled = false
        })
      },
      fail: () => {
        uni.showToast({
          title: '加载失败',
          icon: 'none'
        })
        uni.hideLoading()
      }
    })
  },

  methods: {
    decryptUserInfo(e) {
      if (this.disabled) return
      this.disabled = true // 避免重复点击按钮
      if (e.detail.errMsg == 'getUserInfo:ok') {
        uni.showLoading({
          title: '登录中...'
        })
        const sessionId = uni.getStorageSync('sessionId')
        this.$store
          .dispatch('user/getUserInfo_baidu', {
            data: e.detail.encryptedData,
            iv: e.detail.iv,
            userId: this.userId,
            sessionid: sessionId
          })
          .then(() => {
            uni.hideLoading()
            setTimeout(() => {
              uni.showToast({
                title: '登录成功',
                icon: 'none'
              })
              setTimeout(async () => {
                uni.showLoading({
                  title: '正在加载相关数据...'
                })
                await this.$store.dispatch('chat/getOldChatList', 0)
                await this.$store.dispatch('chat/getNoReadNum')
                // await this.$store.dispatch('circle/nearlyCircle', 0)
                await this.$store.dispatch('circle/nearlyCircleByPage', {
                  type: 0,
                  offset: 1
                })
                uni.hideLoading()
                setTimeout(() => {
                  uni.switchTab({
                    url: '/pages/me/me'
                  })
                }, 500)
              }, 500)
            }, 500)
          })
          .catch(() => {
            uni.hideLoading()
            this.disabled = false
            setTimeout(() => {
              uni.showToast({
                title: '登录失败',
                icon: 'none'
              })
            }, 500)
          })
      } else if (e.detail.errMsg == 'getUserInfo:fail auth deny') {
        uni.showToast({
          title: '您已拒绝了授权，请重新点击并授权！',
          icon: 'none'
        })
      }
    }
  }
}
</script>

<style lang="scss">
page {
  background-color: #ffffff !important;
}

.content {
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-top: 80rpx;

  .brand {
    margin: 0 auto;

    .logo {
      width: 161rpx;
      height: 161rpx;
      margin: 0 auto;
      // box-shadow: 0rpx 0rpx 60rpx 0rpx rgba(0, 0, 0, 0.1);
      border-radius: 50%;
      // background-color: #000000;

      image {
        width: 161rpx;
        height: 161rpx;
        border-radius: 50%;
      }
    }
  }

  .grid-text {
    font-size: 28rpx;
    margin-top: 4rpx;
    color: $u-type-info;
  }
}
</style>
