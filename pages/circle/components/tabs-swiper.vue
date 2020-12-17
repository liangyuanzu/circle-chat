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
          <view v-if="loading">
            <view v-for="(item, index2) in loadingList" :key="index2">
              <view class="bg-white">
                <skeleton avatarSize="80rpx" avatarShape="square" :row="1">
                </skeleton>
              </view>
            </view>
          </view>

          <!-- #ifndef MP-BAIDU -->
          <view v-else-if="circleList.length > 0">
            <custom-circle-list
              :border="false"
              showJoin
              :list="circleList"
              @joinClick="joinClick"
            >
            </custom-circle-list>
          </view>
          <!-- #endif -->
          <!-- #ifdef MP-BAIDU -->
          <view v-else-if="circleList.length > 0">
            <custom-nearby-circle-list
              showJoin
              :list="circleList"
              @joinClick="joinClick"
            >
            </custom-nearby-circle-list>
          </view>
          <!-- #endif -->

          <view class="empty" :style="emptyTop" v-else>
            <u-empty mode="list"></u-empty>
          </view>
        </scroll-view>
      </swiper-item>
    </swiper>
  </view>
</template>

<script>
import { mapState } from 'vuex'
import localStore from '@/helpers/localStore.js'

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
      loading: false,
      loadingList: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
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
    // #ifdef MP-BAIDU
    uni.checkSession({
      success: () => {
        const userinfo = localStore.get('userinfo')
        if (userinfo) {
          this.loading = true
          this.getCircleList()
        }
      }
    })
    // #endif

    // #ifndef MP-BAIDU
    this.loading = true
    this.getCircleList()
    // #endif
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

    joinClick() {
      this.$store
        .dispatch('circle/nearlyCircle', this.swiperCurrent)
        .then(async () => {
          await this.$store.dispatch('chat/getOldChatList', 0)
          await this.$store.dispatch('chat/getNoReadNum')
        })
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
