<template>
  <view>
    <custom-avatar
      :src="personinfo.img"
      :show-sex="showSex"
      :sex-icon="formatGender"
      :title="personinfo.username"
    >
      <template #bottom>
        <view>
          <view class="text-sm text-grey text-cut" style="width: 470rpx">
            {{ formatAge }}
          </view>
          <view class="text-sm text-grey text-cut" style="width: 470rpx">
            {{ formatBirthday }}
          </view>
        </view>
      </template>
    </custom-avatar>

    <view style="margin-top: 20rpx" v-if="personinfo.autograph">
      <uni-list>
        <uni-list-item
          :title="personinfo.autograph"
          titleEllipsis="1"
          show-extra-icon
          :extraIcon="signatureIcon"
          clickable
          @click="toSignature"
        ></uni-list-item>
      </uni-list>
    </view>

    <view style="margin-top: 20rpx" v-if="userId !== personinfo.userId">
      <uni-list>
        <uni-list-item clickable @click="onFocus">
          <view
            slot="body"
            class="text-center text-blue text-df"
            style="width: 100%"
          >
            <uni-icons :size="16" color="#0081ff" :type="focus.icon" />
            <text style="margin-left: 20rpx">{{ focus.text }}</text>
          </view>
        </uni-list-item>
        <uni-list-item clickable @click="sendMsg">
          <view
            slot="body"
            class="text-center text-blue text-df"
            style="width: 100%"
          >
            <uni-icons :size="16" color="#0081ff" type="chatbubble" />
            <text style="margin-left: 20rpx">发消息</text>
          </view>
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
    ...mapGetters('user', ['personinfo', 'userId']),
    // ...mapGetters('focus', ['focusStatus']),
    showSex() {
      if (this.personinfo.sex === '男' || this.personinfo.sex === '女')
        return true
      return false
    },
    formatGender() {
      if (this.personinfo.sex === '男') return 'man'
      if (this.personinfo.sex === '女') return 'woman'
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
      if (this.personinfo.isFocus === 0 || this.personinfo.isFocus === 2) {
        return false
      } else if (
        this.personinfo.isFocus === 1 ||
        this.personinfo.isFocus === 3
      ) {
        return true
      }
    },
    focus() {
      if (!this.isFocus) {
        return {
          icon: 'plusempty',
          text: '关注'
        }
      } else if (this.personinfo.isFocus === 1) {
        return {
          icon: 'checkmarkempty',
          text: '已关注'
        }
      } else if (this.personinfo.isFocus === 3) {
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
      // this.$store.dispatch('focus/getFocusStatus', id)
    },

    toSignature() {
      this.$u.route('/pages/components/person-signature/person-signature', {
        personId: this.personinfo.userId
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
      await this.$store.dispatch('chat/getOldChatList', 0)
      await this.$store.dispatch('chat/getNoReadNum')
    },

    sendMsg() {
      if (this.personinfo.isFocus !== 3) {
        uni.showToast({
          title: '互相关注后才可发消息',
          icon: 'none'
        })
      } else {
        this.$u.route({
          type: 'redirect',
          url: '/pages/components/chat/chat',
          params: {
            personId: this.personinfo.userId
          }
        })
      }
    }
  }
}
</script>

<style lang="scss">
</style>
