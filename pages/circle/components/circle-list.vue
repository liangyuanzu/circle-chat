<template>
  <view>
    <uni-list :border="false">
      <uni-list-item
        v-for="item in circleList"
        :key="item.circleId"
        :title="item.circleName"
        ellipsis="1"
        :thumb="item.img"
        thumbSize="lg"
        :note="item.synopsis"
        clickable
        @click="toDetail(item)"
      >
        <template slot="right">
          <view class="custom-right">
            <text>人数：100人</text>
            <text>范围：{{ item.radius + '米' }}</text>
          </view>
        </template>
      </uni-list-item>
    </uni-list>
  </view>
</template>

<script>
import { mapState } from 'vuex'

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
    ...mapState('circle', ['circleList'])
  },

  methods: {
    toDetail(item) {
      uni.navigateTo({
        url: '/pages/components/detail/detail?info=' + JSON.stringify(item)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.custom-right {
  display: flex;
  flex-direction: column;
  font-size: 12px;
  color: #999;
}
</style>
