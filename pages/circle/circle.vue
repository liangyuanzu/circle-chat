<template>
  <view>
    <view class="bar">
      <view class="search">
        <u-search
          placeholder="搜索用户和圈"
          :clearabled="false"
          :show-action="false"
          disabled
          @click="toSearch"
        ></u-search>
      </view>

      <view class="create" @click="createCircle">
        <text>创建圈</text>
        <uni-icons size="16" color="#c0c4cc" type="plusempty"> </uni-icons>
      </view>
    </view>

    <tabs-swiper />
  </view>
</template>

<script>
import tabsSwiper from './components/tabs-swiper.vue'

export default {
  components: {
    tabsSwiper
  },

  data() {
    return {
      keyword: ''
    }
  },

  methods: {
    // #ifndef MP-BAIDU
    createCircle() {
      this.$u.route('/pages/components/create-circle-map/create-circle-map')
    },
    // #endif
    // #ifdef MP-BAIDU
    createCircle() {
      this.$u.route('/pages/components/create-circle/create-circle')
    },
    // #endif

    toSearch() {
      this.$u.route('/pages/components/search/search')
    }
  }
}
</script>

<style lang="scss">
.bar {
  width: 100%;
  height: 80rpx;
  line-height: 80rpx;
  position: relative;
  background-color: #fff;

  .search {
    width: 60%;
    position: relative;
    left: 10%;
  }

  .create {
    position: absolute;
    right: 10%;
    top: 50%;
    transform: translateY(-50%);
    color: rgb(96, 98, 102);
  }
}
</style>
