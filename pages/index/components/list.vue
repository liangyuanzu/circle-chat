<template>
  <view>
    <uni-list>
      <uni-list :border="true">
        <uni-list-chat
          v-for="item in circleList"
          :key="item.circleId"
          :avatar-circle="true"
          :title="item.name"
          :avatar="item.img"
          :note="item.synopsis"
          link
          to="/pages/components/detail/detail"
        >
          <view class="chat-custom-right">
            <text class="chat-custom-text">
              <text>人数</text>
              <text>范围：{{ item.radius }}</text>
            </text>
          </view>
        </uni-list-chat>
      </uni-list>
    </uni-list>
  </view>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  mounted() {
    uni.showLoading()
    this.$store
      .dispatch('circle/nearlyCircle')
      .then(() => {
        uni.hideLoading()
      })
      .catch(() => {
        uni.hideLoading()
      })
  },

  data() {
    return {
      type: 0,
      clrcleTypeMap: [
        { type: 0, value: '交友圈' },
        { type: 1, value: '固定圈' },
        { type: 2, value: '紧急圈' },
        { type: 3, value: '我的圈' }
      ]
    }
  },

  computed: {
    ...mapGetters('circle', ['circleList'])
  },

  methods: {
    onClick() {
      console.log('成功触发')
      uni.navigateTo({
        url: '/pages/components/detail/detail',
        success() {
          console.log('接口成功')
        },
        fail() {
          console.log('接口失败')
        }
      })
    }
  }
}
</script>

<style lang="scss">
.chat-custom-right {
  .chat-custom-text {
    font-size: 12px;
    color: #999;

    text:nth-of-type(1) {
      margin-right: 50rpx;
    }
  }
}

.custom-list-hover {
  background-color: #f5f5f5 !important;
}
</style>
