<template>
  <view>
    <view v-if="inviteList.length > 0">
      <view class="cu-bar bg-white margin-bottom-sm">
        <view class="flex justify-end padding-right" style="width: 100%">
          <button class="cu-btn round bg-white" @click="showModal = true">
            清空
          </button>
        </view>
      </view>

      <view class="cu-list menu-avatar">
        <view
          v-for="item in inviteList"
          :key="item.tId"
          class="cu-item"
          :class="modalName == 'move-box-' + item.tId ? 'move-cur' : ''"
          :data-target="'move-box-' + item.tId"
          @touchstart="ListTouchStart"
          @touchmove="ListTouchMove"
          @touchend="ListTouchEnd"
        >
          <view
            class="cu-avatar lg"
            :style="[
              {
                backgroundImage: 'url(' + item.circleImg + ')'
              }
            ]"
            @click="toCircleInvite(item)"
          ></view>
          <view class="content" @click="toCircleInvite(item)">
            <view class="text-cut">{{ item.circleName }}</view>
            <view>
              <view class="cu-capsule radius" v-if="item.member">
                <view class="cu-tag bg-blue sm">
                  <text class="cuIcon-group"></text>
                </view>
                <view class="cu-tag line-blue sm"> {{ item.member }} </view>
              </view>
              <view class="cu-capsule radius" v-if="item.radius">
                <view class="cu-tag bg-black sm">
                  <text class="cuIcon-radiobox"></text>
                </view>
                <view class="cu-tag line-black sm">{{
                  item.radius + 'm'
                }}</view>
              </view>
            </view>
            <view class="text-gray text-sm flex" v-if="item.synopsis">
              <view class="text-cut"> {{ item.synopsis }}</view></view
            >
          </view>
          <view class="action margin-right">
            <u-button
              :type="btnType(item.handle, item.agree)"
              size="mini"
              shape="circle"
              plain
              @click="agreeInvite(item)"
            >
              {{ btnText(item.handle, item.agree) }}
            </u-button>
          </view>
          <view class="move" style="width: 130rpx">
            <view class="bg-red" @click="del(item.circleId)">删除</view>
          </view>
        </view>
      </view>
    </view>

    <view class="empty" v-else>
      <u-empty mode="list"></u-empty>
    </view>
    <u-modal
      v-model="showModal"
      :show-title="false"
      content="确定清空所有入圈邀请吗？"
      show-cancel-button
      confirm-color="#fa3534"
      @confirm="delAll"
      ref="uModal"
    ></u-modal>
  </view>
</template>

<script>
import { mapState } from 'vuex'

export default {
  data() {
    return {
      modalName: null,
      listTouchStart: 0,
      listTouchDirection: null,
      showModal: false
    }
  },

  computed: {
    ...mapState('invite', ['inviteList'])
  },

  onShow() {
    this.getList()
  },

  methods: {
    btnType(handle, agree) {
      if (handle) {
        if (agree) return 'default'
        return 'error'
      }
      return 'primary'
    },

    btnText(handle, agree) {
      if (handle) {
        if (agree) return '已同意'
        return '已拒绝'
      }
      return '同意'
    },

    getList() {
      this.$store.dispatch('invite/getInviteList')
    },

    async agreeInvite(item) {
      if (item.handle) return
      await this.$store.dispatch('invite/agreeInvite', {
        circleId: item.circleId,
        flag: true
      })
      this.getList()
    },

    toCircleInvite({ circleId, handle, agree }) {
      this.$u.route(
        '/pages/components/receive-invite-list/to-circle-invite/to-circle-invite',
        {
          circleId,
          handle,
          agree
        }
      )
    },

    del(cid) {
      this.clear([cid])
    },

    delAll() {
      const cids = this.inviteList.map((i) => i.circleId)
      this.clear(cids)
    },

    clear(tIds) {
      uni.showLoading({
        title: '正在删除...'
      })
      this.$store
        .dispatch('invite/delInvite', { tIds })
        .then(() => {
          uni.hideLoading()
          this.getList()
        })
        .catch(() => {
          uni.hideLoading()
          uni.showToast({
            title: '操作失败',
            icon: 'none'
          })
        })
    },

    // ListTouch触摸开始
    ListTouchStart(e) {
      this.listTouchStart = e.touches[0].pageX
    },

    // ListTouch计算方向
    ListTouchMove(e) {
      this.listTouchDirection =
        e.touches[0].pageX - this.listTouchStart > 0 ? 'right' : 'left'
    },

    // ListTouch计算滚动
    ListTouchEnd(e) {
      if (this.listTouchDirection == 'left') {
        this.modalName = e.currentTarget.dataset.target
      } else {
        this.modalName = null
      }
      this.listTouchDirection = null
    }
  }
}
</script>

<style lang="scss" scoped>
.cu-list > .cu-item.move-cur {
  transform: translateX(-130upx) !important;
}
</style>
