<template>
  <view class="wrap">
    <u-tabs-swiper
      ref="tabs"
      :list="list"
      :current="current"
      @change="tabsChange"
      :is-scroll="false"
      swiperWidth="750"
    >
    </u-tabs-swiper>

    <swiper
      class="swiper-box"
      :current="swiperCurrent"
      @transition="transition"
      @animationfinish="animationfinish"
    >
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
          <view>
            <custom-circle-list :list="circleList" @click="toCircleDetail">
            </custom-circle-list>

            <view class="empty" style="top: 36%">
              <u-empty v-if="circleList.length === 0" mode="list"></u-empty>
            </view>
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
      swiperCurrent: 0
    }
  },

  computed: {
    ...mapState('circle', ['circleList'])
  },

  mounted() {
    this.getCircleList()
  },

  methods: {
    getCircleList() {
      this.$store.dispatch('circle/nearlyCircle')
    },

    tabsChange(index) {
      this.swiperCurrent = index
      this.getCircleList()
    },

    transition({ detail: { dx } }) {
      this.$refs.tabs.setDx(dx)
    },

    animationfinish({ detail: { current } }) {
      this.$refs.tabs.setFinishCurrent(current)
      this.swiperCurrent = current
      this.current = current
    },

    reachBottom() {},

    toCircleDetail(item) {
      this.$u.route('/pages/components/circle-detail/circle-detail', {
        info: JSON.stringify(item)
      })
    }
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
