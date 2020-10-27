<template>
  <view class="avatar" hover-class="uni-list-item--hover" @click="toUserinfo">
    <view class="avatar-left">
      <u-avatar
        :src="avatar"
        mode="square"
        size="large"
        show-sex
        :sex-icon="formatGender"
        style="margin-left: 30rpx"
      >
      </u-avatar>
      <view class="info">
        <view class="text-lg text-black text-cut" style="width: 470rpx">
          {{ username }}
        </view>
        <view class="text-sm text-grey text-cut" style="width: 470rpx">
          {{ autograph }}
        </view>
      </view>
    </view>

    <uni-icons
      :size="16"
      class="uni-icon-wrapper"
      color="#bbb"
      type="arrowright"
    />
  </view>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  data() {
    return {}
  },

  computed: {
    ...mapGetters('user', ['username', 'avatar', 'sex', 'autograph']),
    formatGender() {
      if (this.sex === '男') return 'man'
      if (this.sex === '女') return 'woman'
    }
  },

  methods: {
    toUserinfo() {
      this.$emit('toInfo')
    }
  }
}
</script>

<style lang="scss">
.avatar {
  width: 100%;
  height: 150rpx;
  padding-right: 30rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #fff;

  .avatar-left {
    display: flex;
    align-items: center;

    .info {
      margin: 0 20rpx 0 40rpx;
    }
  }
}

.uni-list-item--hover {
  background-color: $uni-bg-color-hover !important;
}
</style>
