<template>
  <view class="content">
    <view class="avatar" hover-class="uni-list-item--hover" @click="toInfo">
      <view class="avatar-left">
        <u-avatar
          :src="avatar"
          mode="square"
          size="large"
          show-sex
          :sex-icon="formatGender"
          style="margin-left: 30rpx"
        >
        </u-avatar>
        <view class="info">
          <view class="text-lg text-black text-cut" style="width: 470rpx">
            {{ username }}
          </view>
          <view class="text-sm text-grey text-cut" style="width: 470rpx">
            {{ autograph }}
          </view>
        </view>
      </view>

      <uni-icons
        :size="16"
        class="uni-icon-wrapper"
        color="#bbb"
        type="arrowright"
      />
    </view>

    <view style="margin-top: 20rpx">
      <uni-list>
        <uni-list-item
          v-for="(item, index) in list"
          :key="index"
          :title="item.title"
          show-extra-icon
          :extraIcon="item.extraIcon"
          :showArrow="item.showArrow"
          clickable
          @click="onClick(item.title)"
          :showSwitch="item.showSwitch"
          @switchChange="switchChange"
        ></uni-list-item>
      </uni-list>
    </view>

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

export default {
  data() {
    return {
      showModal: false,
      list: [
        {
          title: '个人信息',
          extraIcon: {
            color: '#2979ff',
            size: '22',
            type: 'contact-filled'
          },
          showArrow: true
        },
        {
          title: '关注列表',
          extraIcon: {
            color: '#ff9900',
            size: '22',
            type: 'star-filled'
          },
          showArrow: true
        },
        {
          title: '默认加圈',
          extraIcon: {
            color: '#909399',
            size: '22',
            type: 'circle-filled'
          },
          showArrow: false,
          showSwitch: true
        },
        {
          title: '消息通知',
          extraIcon: {
            color: '#ff9900',
            size: '22',
            type: 'sound-filled'
          },
          showArrow: false,
          showSwitch: true
        }
      ],
      logoutIcon: {
        color: '#fa3534',
        size: '22',
        type: 'gear-filled'
      }
    }
  },

  computed: {
    ...mapGetters('user', ['username', 'email', 'avatar', 'sex', 'autograph']),
    formatGender() {
      if (this.sex === '男') return 'man'
      if (this.sex === '女') return 'woman'
    }
  },

  methods: {
    onClick(title) {
      switch (title) {
        case '个人信息':
          this.toInfo()
          break
        case '关注列表':
          this.toFocusList()
          break
      }
    },

    switchChange(e) {
      console.log(e)
    },

    changeAvatar() {
      uni.chooseImage({
        count: 1,
        sizeType: ['original', 'compressed'],
        sourceType: ['album'],
        success: (res) => {
          uni.showLoading()
          console.log(res)
          this.$store
            .dispatch('user/updatePhoto', JSON.stringify(res.tempFilePaths[0]))
            .then(() => {
              uni.hideLoading()
              uni.showToast({
                icon: 'none',
                position: 'bottom',
                title: '修改成功'
              })
            })
            .catch(() => {
              uni.hideLoading()
            })
        }
      })
    },

    toInfo() {
      uni.navigateTo({
        url: '/pages/components/info/info'
      })
    },

    toFocusList() {
      uni.navigateTo({
        url: '/pages/components/focus-list/focus-list'
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
.content {
  .avatar {
    width: 100%;
    height: 150rpx;
    padding-right: 30rpx;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #fff;

    .avatar-left {
      display: flex;
      align-items: center;

      .info {
        margin: 0 20rpx 0 40rpx;
      }
    }
  }
}

.uni-list-item--hover {
  background-color: $uni-bg-color-hover !important;
}
</style>
