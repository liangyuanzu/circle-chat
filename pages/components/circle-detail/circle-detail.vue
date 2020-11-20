<template>
  <view>
    <custom-avatar
      :src="info.img"
      :title="info.circleName"
      :note="info.circleId"
    >
    </custom-avatar>

    <view style="margin-top: 20rpx" class="text-df text-grey padding bg-white">
      <view>本圈创建于 {{ createTime }}</view>
      <view v-if="info.synopsis">{{ info.synopsis }}</view>
    </view>

    <view
      style="margin-top: 20rpx"
      class="text-df text-grey padding bg-white"
      v-if="info.explain"
    >
      <view>入圈说明</view>
      <view>{{ info.explain }}</view>
    </view>

    <uni-list style="margin-top: 20rpx">
      <uni-list-item title="圈类型">
        <template #footer>
          <u-tag :text="info.type" size="mini" :type="formatType" />
        </template>
      </uni-list-item>
      <uni-list-item title="圈人数">
        <template #footer>
          <view class="cu-capsule radius flex">
            <view class="cu-tag bg-blue sm">
              <text class="cuIcon-group"></text>
            </view>
            <view class="cu-tag line-blue sm">
              {{ info.member }}
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
            <view class="cu-tag line-black sm"> {{ info.radius }}</view>
          </view>
        </template>
      </uni-list-item>
    </uni-list>

    <uni-list style="margin-top: 20rpx">
      <uni-list-item title="圈主" showArrow clickable @click="toOwner">
        <template #footer>
          <u-avatar :src="info.userImg" mode="square" size="mini"></u-avatar>
        </template>
      </uni-list-item>
    </uni-list>

    <view style="margin-top: 100rpx; padding: 0 20rpx">
      <u-button v-if="info.inCircle" type="primary" plain @click="toCircleChat"
        >发消息</u-button
      >
      <u-button
        v-else
        type="primary"
        plain
        :loading="loading"
        @click="jionCircle"
        >加入圈</u-button
      >
    </view>
  </view>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  data() {
    return {
      info: {},
      loading: false
    }
  },

  computed: {
    ...mapGetters('circle', ['circleInfo', 'circleMember']),
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

  onLoad({ circleId }) {
    this.$store.dispatch('circle/getCircleInfo', circleId)
  },

  methods: {
    formatRadius(radius) {
      if (radius > 0 && radius < 1000) {
        return radius + ' m'
      } else {
        return parseInt(radius / 1000) + ' km'
      }
    },

    toOwner() {
      this.$u.route('/pages/components/person-info/person-info', {
        id: this.circleInfo.userId
      })
    },

    toCircleChat() {
      this.$u.route({
        type: 'redirect',
        url: '/pages/components/chat/chat',
        params: {
          circleId: this.circleInfo.circleId
        }
      })
    },

    jionCircle() {
      this.loading = true
      this.$store
        .dispatch('circle/joinCircle', {
          circleId: this.circleInfo.circleId
        })
        .then(() => {
          this.loading = false
          setTimeout(() => {
            uni.showToast({
              title: '加入成功',
              icon: 'none'
            })
            setTimeout(() => {
              this.toCircleChat()
            }, 500)
          }, 500)
        })
        .catch(() => {
          this.loading = false
        })
    }
  }
}
</script>

<style lang="scss">
</style>
