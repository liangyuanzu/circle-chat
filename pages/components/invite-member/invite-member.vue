<template>
  <view>
    <view class="cu-bar bg-white">
      <view class="flex justify-between" style="width: 100%">
        <button class="cu-btn round bg-white" @click="checkedAll">全选</button>
        <button class="cu-btn round bg-white" @click="finish">完成</button>
      </view>
    </view>

    <u-checkbox-group @change="checkboxGroupChange">
      <view class="cu-list menu-avatar">
        <view class="cu-item" v-for="item in list" :key="item.userId">
          <view
            class="cu-avatar radius lg"
            :style="'background-image: url(' + item.img + ');'"
          ></view>
          <view class="content">
            <view class="text-cut">{{ item.username }}</view>
          </view>

          <view class="action">
            <u-checkbox
              style="text-algin: right !important"
              v-model="item.inCircle"
              :name="item.userId"
              :disabled="item.inCircle"
            ></u-checkbox>
          </view>
        </view>
      </view>
    </u-checkbox-group>
  </view>
</template>

<script>
import { mapState } from 'vuex'
export default {
  data() {
    return {
      list: [],
      uids: [],
      circleId: 0
    }
  },

  computed: {
    ...mapState('circle', ['usersInCircleList'])
  },

  onLoad({ circleId }) {
    this.circleId = circleId
    this.$store.dispatch('circle/getUsersInCircleList', circleId).then(() => {
      this.list = this.usersInCircleList
    })
  },

  methods: {
    checkboxGroupChange(e) {
      this.uids = e
    },

    checkedAll() {
      this.list.map((val) => (val.inCircle = true))
      this.uids = this.list
        .map((i) => {
          if (!i.inCircle) return i.userId
        })
        .filter(Boolean)
    },

    finish() {
      if (this.uids.length === 0) return
      uni.showLoading({
        title: '加载中...'
      })
      this.$store
        .dispatch('circle/inviteUsers', {
          circleId: this.circleId,
          uids: this.uids
        })
        .then(() => {
          uni.hideLoading()
          setTimeout(() => {
            uni.showToast({
              title: '邀请成功',
              icon: 'none'
            })
            setTimeout(() => {
              uni.navigateBack()
            }, 200)
          }, 500)
        })
    }
  }
}
</script>

<style lang="scss">
.sw-5__u-checkbox.sw-5__data-v-54acf820 {
  float: right !important;
}
</style>
