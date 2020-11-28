<template>
  <view>
    <custom-avatar
      :src="circleInfo.img"
      :title="circleInfo.circleName"
      :note="circleInfo.circleId"
    >
    </custom-avatar>

    <view class="text-df text-grey padding bg-white margin-top-sm">
      <view>本圈创建于 {{ createTime }}</view>
      <view v-if="circleInfo.synopsis">{{ circleInfo.synopsis }}</view>
    </view>

    <view
      class="text-df text-grey padding bg-white margin-top-sm"
      v-if="circleInfo.explain"
    >
      <view>入圈说明</view>
      <view>{{ circleInfo.explain }}</view>
    </view>

    <view class="margin-top-sm">
      <uni-list>
        <uni-list-item title="圈类型">
          <template #footer>
            <u-tag :text="circleInfo.type" size="mini" :type="formatType" />
          </template>
        </uni-list-item>
        <uni-list-item title="圈人数">
          <template #footer>
            <view class="cu-capsule radius flex">
              <view class="cu-tag bg-blue sm">
                <text class="cuIcon-group"></text>
              </view>
              <view class="cu-tag line-blue sm">
                {{ circleInfo.member }}
              </view>
            </view>
          </template>
        </uni-list-item>
        <uni-list-item title="圈范围">
          <template #footer>
            <view class="cu-capsule radius">
              <view class="cu-tag bg-black sm">
                <text class="cuIcon-radiobox"></text>
              </view>
              <view class="cu-tag line-black sm">
                {{ $formatRadius(circleInfo.radius) }}</view
              >
            </view>
          </template>
        </uni-list-item>
      </uni-list>
    </view>

    <view class="margin-top-sm">
      <uni-list>
        <uni-list-item title="圈主" showArrow clickable @click="toOwner">
          <template #footer>
            <u-avatar
              :src="circleInfo.userImg"
              mode="square"
              size="mini"
            ></u-avatar>
          </template>
        </uni-list-item>
      </uni-list>
    </view>

    <view class="padding margin-top-lg" v-if="handle">
      <u-button style="width: 100%">{{ agree ? '已同意' : '已拒绝' }}</u-button>
    </view>

    <view class="flex justify-between padding margin-top-lg" v-else>
      <u-button style="width: 330rpx" @click="inviteHandle(false)"
        >拒绝</u-button
      >
      <u-button style="width: 330rpx" type="primary" @click="inviteHandle(true)"
        >同意</u-button
      >
    </view>

    <u-toast ref="uToast" position="top" />
  </view>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  data() {
    return {
      handle: false,
      agree: false
    }
  },

  computed: {
    ...mapGetters('circle', ['circleInfo']),
    createTime() {
      return /(\d{4})\-(\d{2})\-(\d{2})/
        .exec(this.circleInfo.createTime)[0]
        .replace(/(\d{4})\-(\d{2})\-(\d{2})/, '$1年$2月$3日')
    },
    formatType() {
      if (this.circleInfo.type === '固定圈') return 'warning'
      if (this.circleInfo.type === '紧急圈') return 'error'
    }
  },

  onLoad({ circleId, handle, agree }) {
    this.handle = handle
    this.agree = agree
    this.$store.dispatch('circle/getCircleInfo', circleId)
  },

  methods: {
    toOwner() {
      this.$u.route('/pages/components/person-info/person-info', {
        id: this.circleInfo.userId
      })
    },

    inviteHandle(flag) {
      uni.showLoading({
        title: '加载中...'
      })
      this.$store
        .dispatch('invite/agreeInvite', {
          circleId: this.circleInfo.circleId,
          flag
        })
        .then(() => {
          uni.hideLoading()
          if (flag) {
            this.$refs.uToast.show({
              title: '已同意',
              type: 'success',
              url: '/pages/components/chat/chat',
              params: {
                circleId: this.circleInfo.circleId
              }
            })
          } else {
            this.$refs.uToast.show({
              title: '已拒绝',
              type: 'error',
              url: '/pages/components/receive-invite-list/receive-invite-list'
            })
          }
        })
    }
  }
}
</script>

<style lang="scss">
</style>
