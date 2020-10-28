<template>
  <view>
    <view style="margin-bottom: 20rpx">
      <uni-list>
        <uni-list-item title="头像" showArrow clickable>
          <template #right>
            <u-avatar :src="avatar" mode="square"> </u-avatar>
          </template>
        </uni-list-item>
      </uni-list>
    </view>

    <uni-list>
      <uni-list-item
        v-for="(item, index) in infoList"
        :key="index"
        :title="item.title"
        :rightText="item.rightText"
        :note="item.note"
        ellipsis="2"
        showArrow
        clickable
      ></uni-list-item>
    </uni-list>
  </view>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  data() {
    return {}
  },

  computed: {
    ...mapGetters('user', [
      'avatar',
      'username',
      'sex',
      'birthday',
      'autograph'
    ]),

    infoList() {
      return [
        {
          title: '昵称',
          rightText: this.username
        },
        {
          title: '性别',
          rightText: this.sex
        },
        {
          title: '生日',
          rightText: this.birthday
        },
        {
          title: '个性签名',
          note: this.autograph
        }
      ]
    }
  },

  methods: {
    chagePwd() {
      uni.navigateTo({
        url: '/pages/login/forget'
      })
    }
  }
}
</script>

<style lang="scss">
</style>
