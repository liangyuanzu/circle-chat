<template>
  <view>
    <custom-avatar
      :src="avatar"
      :show-sex="showSex"
      :sex-icon="formatGender"
      :title="username"
      :note="autograph"
      clickable
      showArrow
      @click="toInfo"
    />

    <view class="cu-bar bg-white flex">
      <view
        class="text-center flex-sub"
        v-for="(item, index) in infoList"
        :key="index"
        @click="infoClick(item.text)"
      >
        <view class="text-sm text-bold text-black">{{ item.val }}</view>
        <view class="text-xs text-gray">{{ item.text }}</view>
      </view>
    </view>

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
    ...mapGetters('user', [
      'username',
      'avatar',
      'sex',
      'autograph',
      'myFocus',
      'myFans',
      'points'
    ]),
    formatGender() {
      if (this.sex === '男') return 'man'
      if (this.sex === '女') return 'woman'
    },
    showSex() {
      if (this.sex === '男' || this.sex === '女') return true
      return false
    },
    infoList() {
      return [
        {
          text: '关注',
          val: this.myFocus
        },
        {
          text: '粉丝',
          val: this.myFans
        },
        {
          text: '积分',
          val: this.points
        }
      ]
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
    },

    infoClick(text) {
      switch (text) {
        case '关注':
          this.$u.route('/pages/components/focus-list/focus-list', {
            params: {
              index: 0
            }
          })
          break
        case '粉丝':
          this.$u.route('/pages/components/focus-list/focus-list', {
            index: 1
          })
          break
      }
    }
  }
}
</script>

<style lang="scss">
</style>
