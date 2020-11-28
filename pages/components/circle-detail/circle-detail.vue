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

    <view style="margin-top: 100rpx; padding: 0 20rpx">
      <u-button
        v-if="circleInfo.inCircle"
        type="primary"
        plain
        @click="toCircleChat"
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
