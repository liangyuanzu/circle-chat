<template>
  <view class="wrap">
    <u-tabs-swiper
      ref="tabs"
      :list="list"
      :current="current"
      @change="tabsChange"
      :is-scroll="false"
      :show-bar="showBar"
      swiperWidth="750"
    >
    </u-tabs-swiper>

    <swiper class="swiper-box" :current="swiperCurrent" @change="change">
      <swiper-item
        class="swiper-item"
        v-for="(item, index) in list"
        :key="index"
      >
        <scroll-view
          scroll-y
          style="height: 100%; width: 100%"
          @scrolltolower="reachBottom"
        >
          <!-- #ifndef MP-BAIDU -->
          <custom-circle-list
            :border="false"
            showJoin
            :list="circleList"
            @joinClick="getCircleList"
          >
          </custom-circle-list>
          <!-- #endif -->
          <!-- #ifdef MP-BAIDU -->
          <custom-nearby-circle-list
            showJoin
            :list="circleList"
            @joinClick="getCircleList"
          >
          </custom-nearby-circle-list>
          <!-- #endif -->

          <view class="empty" :style="emptyTop" v-if="circleList.length === 0">
            <u-empty mode="list"></u-empty>
          </view>
        </scroll-view>
      </swiper-item>
    </swiper>
  </view>
</template>

<script>
import { mapState } from 'vuex'

export default {
  data() {
    return {
      list: [
        {
          name: '综合'
        },
        {
          name: '交友圈'
        },
        {
          name: '固定圈'
        },
        {
          name: '紧急圈'
        }
      ],
      current: 0,
      swiperCurrent: 0,
      loading: false
    }
  },

  computed: {
    ...mapState('circle', ['circleList']),
    showBar() {
      // #ifdef MP-BAIDU
      return false
      // #endif
      return true
    },
    emptyTop() {
      // #ifdef MP-BAIDU
      return 'top: 38%'
      // #endif
      return 'top: 36%'
    }
  },

  mounted() {
    this.getCircleList()
  },

  methods: {
    getCircleList() {
      this.$store
        .dispatch('circle/nearlyCircle', this.swiperCurrent)
        .then(() => (this.loading = false))
    },

    tabsChange(index) {
      this.swiperCurrent = index
    },

    change({ detail: { current } }) {
      if (this.loading) return
      this.loading = true
      this.swiperCurrent = current
      this.current = current
      this.getCircleList()
    },

    reachBottom() {}
  }
}
</script>

<style lang="scss">
.wrap {
  display: flex;
  flex-direction: column;
  height: calc(100vh - var(--window-top));
  width: 100%;
}
.swiper-box {
  flex: 1;
}
.swiper-item {
  height: 100%;
}
</style>
