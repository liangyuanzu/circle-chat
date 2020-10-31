<template>
  <view>
    <view class="bar">
      <u-search
        placeholder="搜索圈"
        v-model="keyword"
        :clearabled="false"
        :show-action="false"
        class="search"
      ></u-search>
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
    createCircle() {
      this.$u.route('/pages/components/create-map/create-map')
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
