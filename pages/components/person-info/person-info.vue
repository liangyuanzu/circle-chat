<template>
  <view>
    <view class="avatar">
      <view class="avatar-left">
        <u-avatar
          :src="personinfo.img"
          mode="square"
          size="large"
          show-sex
          :sex-icon="formatGender"
          style="margin-left: 30rpx"
        >
        </u-avatar>
        <view class="info">
          <view class="text-lg text-black text-cut" style="width: 470rpx">
            {{ personinfo.username }}
          </view>
          <view class="text-sm text-grey text-cut" style="width: 470rpx">
            {{ formatAge }}
          </view>
          <view class="text-sm text-grey text-cut" style="width: 470rpx">
            {{ formatBirthday }}
          </view>
        </view>
      </view>
    </view>

    <view style="margin-top: 20rpx">
      <uni-list>
        <uni-list-item
          :title="personinfo.autograph"
          ellipsis="1"
          show-extra-icon
          :extraIcon="signatureIcon"
          clickable
          @click="toSignature"
        ></uni-list-item>
      </uni-list>
    </view>

    <view style="margin-top: 20rpx">
      <uni-list>
        <uni-list-item clickable @click="onFocus">
          <template>
            <view class="text-center text-blue text-df">
              <uni-icons :size="16" color="#0081ff" :type="focus.icon" />
              <text style="margin-left: 20rpx">{{ focus.text }}</text>
            </view>
          </template>
        </uni-list-item>
        <uni-list-item clickable @click="sendMsg">
          <template>
            <view class="text-center text-blue text-df">
              <uni-icons :size="16" color="#0081ff" type="chatbubble" />
              <text style="margin-left: 20rpx">发消息</text>
            </view>
          </template>
        </uni-list-item>
      </uni-list>
    </view>
  </view>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  data() {
    return {
      signatureIcon: {
        color: '#909399',
        size: '22',
        type: 'compose'
      }
    }
  },

  computed: {
    ...mapGetters('user', ['personinfo']),
    ...mapGetters('focus', ['focusStatus']),
    formatGender() {
      if (this.sex === '男') return 'man'
      if (this.sex === '女') return 'woman'
    },
    formatAge() {
      if (this.personinfo.age) return '年龄：' + this.personinfo.age + ' 岁'
      return ''
    },
    formatBirthday() {
      if (this.personinfo.birthday) return '生日：' + this.personinfo.birthday
      return ''
    },
    isFocus() {
      if (this.focusStatus === 0 || this.focusStatus === 2) {
        return false
      } else if (this.focusStatus === 1 || this.focusStatus === 3) {
        return true
      }
    },
    focus() {
      if (!this.isFocus) {
        return {
          icon: 'plusempty',
          text: '关注'
        }
      } else if (this.focusStatus === 1) {
        return {
          icon: 'checkmarkempty',
          text: '已关注'
        }
      } else if (this.focusStatus === 3) {
        return {
          icon: 'star-filled',
          text: '互相关注'
        }
      } else {
        return {
          icon: '',
          text: ''
        }
      }
    }
  },

  onLoad({ id }) {
    this.getInfo(id)
  },

  methods: {
    getInfo(id) {
      this.$store.dispatch('user/getPersonInfo', id)
      this.$store.dispatch('focus/getFocusStatus', id)
    },

    toSignature() {
      this.$u.route('/pages/components/person-signature/person-signature', {
        personinfo: JSON.stringify(this.personinfo)
      })
    },

    async onFocus() {
      if (!this.isFocus) {
        await this.$store.dispatch('focus/addFocus', {
          id: this.personinfo.userId
        })
      } else if (this.isFocus) {
        await this.$store.dispatch('focus/cancelFocus', {
          id: this.personinfo.userId
        })
      }
      await this.getInfo(this.personinfo.userId)
    },

    sendMsg() {
      console.log('发消息')
    }
  }
}
</script>

<style lang="scss">
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
</style>
