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
          @click="toSignature(personinfo)"
        ></uni-list-item>
      </uni-list>
    </view>

    <view style="margin-top: 20rpx">
      <uni-list>
        <uni-list-item clickable @click="focus">
          <template>
            <view class="text-center text-blue text-df">
              <uni-icons :size="16" color="#0081ff" type="star" />
              <text style="margin-left: 20rpx">关注</text>
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
      },
      focusIcon: {
        color: '#909399',
        size: '22',
        type: 'star'
      }
    }
  },

  computed: {
    ...mapGetters('user', ['personinfo']),
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
    }
  },

  onLoad({ id }) {
    uni.showLoading()
    this.$store
      .dispatch('user/getPersonInfo', id)
      .then(() => {
        uni.hideLoading()
      })
      .catch(() => {
        uni.hideLoading()
      })
  },

  methods: {
    toSignature(personinfo) {
      this.$u.route('/pages/components/person-signature/person-signature', {
        personinfo: JSON.stringify(personinfo)
      })
    },

    focus() {
      console.log('关注')
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

.uni-list-item--hover {
  background-color: $uni-bg-color-hover !important;
}
</style>
