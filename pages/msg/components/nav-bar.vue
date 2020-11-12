<template>
  <view class="cu-custom" :style="[{ height: CustomBar + 'px' }]">
    <view class="cu-bar fixed search bg-blue" :style="style">
      <view
        class="cu-avatar round"
        style="
          background-image: url(https://ossweb-img.qq.com/images/lol/web201310/skin/big11010.jpg;;
        "
      ></view>
      <view class="search-form round" :style="[{ top: StatusBar + 'px' }]">
        <text class="cuIcon-search"></text>
        <input
          @focus="InputFocus"
          @blur="InputBlur"
          :adjust-position="false"
          type="text"
          placeholder="搜索图片、文章、视频"
          confirm-type="search"
        />
      </view>
      <view class="action">
        <text>筛选</text>
        <text class="cuIcon-triangledownfill"></text>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {}
  },

  name: 'cu-custom',

  computed: {
    style() {
      var StatusBar = this.StatusBar
      var CustomBar = this.CustomBar
      var style = `height:${CustomBar}px;padding-top:${StatusBar}px;`
      return style
    }
  },

  methods: {
    InputFocus() {
      uni.navigateTo({
        url: '/pages/components/nearby-circle-map/nearby-circle-map'
      })
    },
    InputBlur() {
      console.log('失去焦点')
    }
  }
}
</script>

<style>
</style>
