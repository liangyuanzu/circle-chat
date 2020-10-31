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
            <uni-list :border="false">
              <uni-list-item
                v-for="item in circleList"
                :key="item.circleId"
                :title="item.circleName"
                ellipsis="1"
                :thumb="item.img"
                thumbSize="lg"
                :note="item.synopsis"
                clickable
                @click="toCircleDetail(item)"
              >
                <template #right>
                  <view>
                    <view class="cu-capsule radius flex">
                      <view class="cu-tag bg-blue sm">
                        <text class="cuIcon-group"></text>
                      </view>
                      <view class="cu-tag line-blue sm">
                        {{ item.member }}
                      </view>
                    </view>
                    <view class="cu-capsule radius">
                      <view class="cu-tag bg-black sm">
                        <text class="cuIcon-radiobox"></text>
                      </view>
                      <view class="cu-tag line-black sm">
                        {{ formatRadius(item.radius) }}</view
                      >
                    </view>
                  </view>
                </template>
              </uni-list-item>
            </uni-list>
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
      this.$u.route('/pages/components/detail/detail', {
        info: JSON.stringify(item)
      })
    },

    formatRadius(radius) {
      if (radius > 0 && radius < 1000) {
        return radius + ' m'
      } else {
        return parseInt(radius / 1000) + ' km'
      }
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
.cu-capsule + .cu-capsule {
  margin-left: 0;
}
</style>
