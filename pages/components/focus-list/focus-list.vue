<template>
  <view>
    <view>
      <u-subsection
        :list="optionList"
        current="0"
        mode="subsection"
        active-color="#ff9900"
        @change="changeItem"
      ></u-subsection>
    </view>

    <uni-list>
      <uni-list-item
        v-for="item in list"
        :key="item.userId"
        thumb="https://img-cdn-qiniu.dcloud.net.cn/new-page/uni.png"
        thumb-size="lg"
      >
        <template>
          <text>
            {{ item.username }}
            <!-- #ifdef H5 || APP-PLUS -->
            <text :class="sexClass(item)" style="margin-left: 20rpx"></text>
            <!-- #endif -->
            <!-- #ifdef MP-BAIDU || MP-WEIXIN -->
            <text style="margin-left: 20rpx"></text>
            <!-- #endif -->
          </text>
        </template>

        <template #right>
          <text @click="focusHandle(item.isFocus, item.userId)">{{
            focusText(item.isFocus)
          }}</text>
        </template>
      </uni-list-item>
    </uni-list>
  </view>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  mounted() {
    uni.showLoading()
    this.$store
      .dispatch('focus/queryMyFocus', this.type)
      .then(() => {
        uni.hideLoading()
      })
      .catch(() => {
        uni.hideLoading()
      })
  },

  data() {
    return {
      optionList: [
        {
          name: '我的关注'
        },
        {
          name: '关注我的'
        }
      ],
      type: 1,
      focusMap: [
        { status: 0, text: '关注' },
        { status: 1, text: '取消关注' },
        { status: 2, text: '相互关注' }
      ]
    }
  },

  computed: {
    ...mapGetters('focus', ['list'])
  },

  methods: {
    loadingList(type) {
      uni.showLoading()
      this.$store
        .dispatch('focus/queryMyFocus', type)
        .then(() => {
          uni.hideLoading()
        })
        .catch(() => {
          uni.hideLoading()
        })
    },

    changeItem(index) {
      this.type = index + 1
      this.loadingList(this.type)
    },

    sexClass(user) {
      return {
        'cuIcon-male': user.sex === '男',
        'text-blue': user.sex === '男',
        'cuIcon-female': user.sex === '女',
        'text-pink': user.sex === '女',
        'cuIcon-questionfill': user.sex !== '男' && user.sex !== '女',
        'text-gray': user.sex !== '男' && user.sex !== '女'
      }
    },

    focusText(isFocus) {
      return this.focusMap
        .filter((i) => i.status == isFocus)
        .map((j) => j.text)
        .toString()
    },

    focusHandle(isFocus, id) {
      uni.showLoading()
      if (isFocus == 0) {
        this.$store
          .dispatch('focus/addFocus', { id })
          .then(() => {
            uni.hideLoading()
            uni.showToast({
              icon: 'none',
              position: 'bottom',
              title: '关注成功'
            })
            setTimeout(() => {
              this.loadingList(this.type)
            }, 1000)
          })
          .catch(() => {
            uni.hideLoading()
          })
      } else if (isFocus == 1 || isFocus == 2) {
        this.$store
          .dispatch('focus/delFocus', { id })
          .then(() => {
            uni.hideLoading()
            uni.showToast({
              icon: 'none',
              position: 'bottom',
              title: '已取消关注'
            })
            setTimeout(() => {
              this.loadingList(this.type)
            }, 1000)
          })
          .catch(() => {
            uni.hideLoading()
          })
      }
    }
  }
}
</script>

<style lang="scss">
</style>
