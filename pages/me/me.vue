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
        <!-- 个人信息 关注列表 -->
        <uni-list-item
          v-for="(item, index) in list"
          :key="index"
          :title="item.title"
          show-extra-icon
          :extraIcon="item.extraIcon"
          showArrow
          clickable
          @click="listItemClick(item.title)"
        >
        </uni-list-item>
        <!-- 默认加圈 -->
        <uni-list-item
          :title="defalutAdd.title"
          show-extra-icon
          :extraIcon="defalutAdd.extraIcon"
        >
          <template #right>
            <u-switch
              size="40"
              v-model="addChecked"
              :loading="addLoading"
            ></u-switch>
          </template>
        </uni-list-item>
        <!-- 消息通知 -->
        <uni-list-item
          :title="notice.title"
          show-extra-icon
          :extraIcon="notice.extraIcon"
        >
          <template #right>
            <u-switch
              size="40"
              v-model="noticeChecked"
              :loading="noticeLoading"
            ></u-switch>
          </template>
        </uni-list-item>
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
      addChecked: false,
      noticeChecked: false,
      addLoading: false,
      noticeLoading: false,
      // 中间变量，避免在watch中多次回调，造成无限循环
      addOpenStatus: false,
      addCloseStatus: false,
      noticeOpenStatus: false,
      noticeCloseStatus: false,
      showModal: false,

      list: [
        {
          title: '个人信息',
          extraIcon: {
            color: '#2979ff',
            size: '22',
            type: 'contact-filled'
          }
        },
        {
          title: '关注列表',
          extraIcon: {
            color: '#ff9900',
            size: '22',
            type: 'star-filled'
          }
        }
      ],

      defalutAdd: {
        title: '默认加圈',
        extraIcon: {
          color: '#909399',
          size: '22',
          type: 'circle-filled'
        }
      },

      notice: {
        title: '消息通知',
        extraIcon: {
          color: '#ff9900',
          size: '22',
          type: 'sound-filled'
        }
      },

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

  watch: {
    addChecked(val) {
      if (val) {
        if (this.addOpenStatus) {
          this.addOpenStatus = false
          return
        }
        // 避免造成无限循环
        this.addCloseStatus = true
        this.addChecked = false
        this.addLoading = true
        this.$store
          .dispatch('user/userSet', {
            defaultAdd: '111'
          })
          .then(() => {
            this.addOpenStatus = true
            this.addChecked = true
            this.addLoading = false
          })
          .catch(() => (this.addLoading = false))
      } else {
        if (this.addCloseStatus) {
          this.addCloseStatus = false
          return
        }
        this.addOpenStatus = true
        this.addChecked = true
        this.addLoading = true
        this.$store
          .dispatch('user/userSet', {
            defaultAdd: '000'
          })
          .then(() => {
            this.addCloseStatus = true
            this.addChecked = false
            this.addLoading = false
          })
          .catch(() => (this.addLoading = false))
      }
    },

    noticeChecked(val) {
      if (val) {
        if (this.noticeOpenStatus) {
          this.noticeOpenStatus = false
          return
        }
        // 避免造成无限循环
        this.noticeCloseStatus = true
        this.noticeChecked = false
        this.noticeLoading = true
        this.$store
          .dispatch('user/userSet', {
            isNotice: 0
          })
          .then(() => {
            this.noticeOpenStatus = true
            this.noticeChecked = true
            this.noticeLoading = false
          })
          .catch(() => (this.noticeLoading = false))
      } else {
        if (this.noticeCloseStatus) {
          this.noticeCloseStatus = false
          return
        }
        this.noticeOpenStatus = true
        this.noticeChecked = true
        this.noticeLoading = true
        this.$store
          .dispatch('user/userSet', {
            defaultAdd: '000',
            isNotice: 1
          })
          .then(() => {
            this.noticeCloseStatus = true
            this.noticeChecked = false
            this.noticeLoading = false
          })
          .catch(() => (this.noticeLoading = false))
      }
    }
  },

  methods: {
    listItemClick(title) {
      switch (title) {
        case '个人信息':
          this.toInfo()
          break
        case '关注列表':
          this.toFocusList()
          break
        default:
          break
      }
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
