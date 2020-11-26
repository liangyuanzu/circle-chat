<template>
  <view>
    <view v-if="list.length > 0">
      <view class="cu-bar bg-white">
        <view class="flex justify-between" style="width: 100%">
          <button class="cu-btn round bg-white" @click="checkedAll">
            全选
          </button>
          <button class="cu-btn round bg-white" @click="finish">邀请</button>
        </view>
      </view>

      <u-checkbox-group @change="checkboxGroupChange">
        <view class="cu-list menu-avatar">
          <view class="cu-item" v-for="item in list" :key="item.userId">
            <view
              class="cu-avatar radius lg"
              :style="'background-image: url(' + item.img + ');'"
              @click="toPersonInfo(item.userId)"
            ></view>
            <view class="content" @click="toPersonInfo(item.userId)">
              <view class="text-cut">{{ item.username }}</view>
            </view>

            <view class="action">
              <u-checkbox
                v-model="item.inCircle"
                :name="item.userId"
              ></u-checkbox>
            </view>
          </view>
        </view>
      </u-checkbox-group>
    </view>

    <view class="empty" v-else>
      <u-empty mode="list"></u-empty>
    </view>
  </view>
</template>

<script>
import { mapState } from 'vuex'
export default {
  data() {
    return {
      list: [],
      uids: [],
      circleId: 0,
      isSelectAll: false
    }
  },

  computed: {
    ...mapState('circle', ['usersInCircleList'])
  },

  onLoad({ circleId }) {
    this.circleId = circleId
    this.$store.dispatch('circle/getUsersInCircleList', circleId).then(() => {
      this.list = this.usersInCircleList.filter((i) => !i.inCircle)
    })
  },

  methods: {
    checkboxGroupChange(e) {
      this.uids = e
    },

    checkedAll() {
      if (!this.isSelectAll) {
        this.isSelectAll = true
        this.list.map((val) => (val.inCircle = true))
        this.uids = this.list.map((i) => i.userId).filter(Boolean)
      } else {
        this.isSelectAll = false
        this.list.map((val) => (val.inCircle = false))
        this.uids = []
      }
    },

    finish() {
      if (this.uids.length === 0) return
      uni.showLoading({
        title: '加载中...'
      })
      this.$store
        .dispatch('invite/inviteUsers', {
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
    },

    toPersonInfo(id) {
      this.$u.route('/pages/components/person-info/person-info', { id })
    }
  }
}
</script>

<style lang="scss">
.sw-5__u-checkbox.sw-5__data-v-54acf820 {
  float: right !important;
}
</style>
