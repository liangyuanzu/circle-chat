<template>
  <view>
    <u-mask :show="showMask" :mask-click-able="false">
      <view class="mask-style">
        <view class="text-xxl text-bold text-white margin-tb">地图模式</view>
        <view class="text-xl text-white padding-xs"
          >可以在地图使用上帝视角画圈来创建一个圈，<br />也可以在地图中直观地查看附近有哪些圈。</view
        >
        <button
          class="text-xl cu-btn round lines-white margin-top"
          @tap="konwClick"
        >
          我知道了
        </button>
      </view>
    </u-mask>

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
      ],
      showMask: false
    }
  },

  onReady() {
    if (!uni.getStorageSync('mapMaskShowed')) this.showMask = true
  },

  methods: {
    konwClick() {
      this.showMask = false
      uni.setStorageSync('mapMaskShowed', true)
    },

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
