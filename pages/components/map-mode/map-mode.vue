<template>
  <view>
    <uni-list>
      <uni-list-item
        v-for="(item, index) in list"
        :key="index"
        :title="item.title"
        :rightText="item.rightText"
        showArrow
        clickable
        @click="listItemClick(item.title)"
      >
      </uni-list-item>
    </uni-list>
  </view>
</template>

<script>
export default {
  data() {
    return {
      list: [
        {
          title: '创建圈',
          rightText: '通过地图确定圈范围'
        },
        {
          title: '附近的圈',
          rightText: '在地图中查看附近的圈'
        }
      ]
    }
  },

  methods: {
    listItemClick(title) {
      switch (title) {
        case '创建圈':
          if (uni.getSystemInfoSync().platform === 'ios') {
            this.$u.toast('ios 因兼容性问题暂未开放')
          } else {
            this.$u.route(
              '/pages/components/create-circle-map/create-circle-map'
            )
          }
          break
        case '附近的圈':
          this.$u.route('/pages/components/nearby-circle-map/nearby-circle-map')
          break
        default:
          break
      }
    }
  }
}
</script>

<style lang="scss">
</style>
