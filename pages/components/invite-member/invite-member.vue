<template>
  <view>
    <view class="cu-load text-grey text-lg loading empty" v-if="loading"></view>

    <view v-else-if="list.length > 0">
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
            <view class="custom-avatar" @click="toPersonInfo(item.userId)"
              ><u-image
                :src="item.img"
                height="100%"
                mode="scaleToFill"
                border-radius="6"
                ><u-loading slot="loading"></u-loading></u-image
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

      <u-loadmore
        v-if="list.length >= 15"
        :status="loadStatus"
        bgColor="#f2f2f2"
      ></u-loadmore>
    </view>

    <view class="empty" v-else>
      <u-empty text="附近没有可邀请的用户"></u-empty>
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
      isSelectAll: false,
      loading: false,
      loadingList: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
      offset: 1,
      loadStatus: 'loadmore'
    }
  },

  computed: {
    ...mapState('circle', ['usersInCircleList'])
  },

  onLoad({ circleId }) {
    this.circleId = circleId
    if (this.usersInCircleList.length === 0) {
      this.loading = true
      this.getList()
    }
  },

  onUnload() {
    this.$store.commit('circle/resetUsersInCircleList')
  },

  onReachBottom() {
    this.loadStatus = 'loading'
    this.offset++
    this.getList()
  },

  methods: {
    getList() {
      this.$store
        .dispatch('circle/getUsersInCircleList', {
          circleId: this.circleId,
          offset: this.offset
        })
        .then(() => {
          this.loading = false
          if (this.list.length !== this.usersInCircleList.length) {
            this.list = this.usersInCircleList.filter((i) => !i.inCircle)
            this.loadStatus = 'loadmore'
          } else {
            this.loadStatus = 'nomore'
          }
        })
        .catch(() => {
          this.loading = false
        })
    },

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
