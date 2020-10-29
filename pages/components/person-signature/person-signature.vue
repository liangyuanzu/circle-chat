<template>
  <view>
    <uni-list>
      <uni-list-item
        :title="personinfo.username"
        :thumb="personinfo.img"
        thumbSize="lg"
      ></uni-list-item>
    </uni-list>

    <u-card
      :show-head="showHead"
      box-shadow="6rpx 6rpx 8rpx rgba(26, 26, 26, 0.2)"
    >
      <template #body>
        <view>
          {{ personinfo.autograph }}
        </view>
      </template>
    </u-card>
  </view>
</template>

<script>
export default {
  data() {
    return {
      showHead: false,
      personinfo: {}
    }
  },

  onLoad({ personinfo }) {
    this.personinfo = JSON.parse(personinfo)
  }
}
</script>

<style lang="scss">
</style>
