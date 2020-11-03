<template>
  <view>
    <uni-list>
      <uni-list-item
        title="编辑资料"
        :border="false"
        showArrow
        clickable
        @click="toEditCircleInfo"
      >
      </uni-list-item>
    </uni-list>
  </view>
</template>

<script>
export default {
  data() {
    return {
      circleId: ''
    }
  },

  onLoad({ circleId }) {
    this.circleId = circleId
  },

  methods: {
    toEditCircleInfo() {
      this.$u.route('/pages/components/edit-circle-info/edit-circle-info', {
        circleId: this.circleId
      })
    }
  }
}
</script>

<style lang="scss">
</style>
