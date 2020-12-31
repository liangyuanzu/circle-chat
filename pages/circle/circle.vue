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

      <view class="create" @tap="showModal" data-target="RadioModal">
        <text>创建圈</text>
        <uni-icons size="16" color="#c0c4cc" type="plusempty"> </uni-icons>
      </view>

      <view
        class="cu-modal"
        :class="modalName == 'RadioModal' ? 'show' : ''"
        @tap="hideModal"
      >
        <text class="lg text-white cuIcon-usefullfill custom-icon"></text>
        <view class="cu-dialog cutom-modal" @tap.stop="">
          <view class="cu-list menu sm-border">
            <view
              class="cu-item"
              v-for="(item, index) in list"
              :key="index"
              @tap="itemClick(item.text)"
            >
              <view class="content">
                <text
                  style="color: #666"
                  class="lg"
                  :class="'cuIcon-' + item.icon"
                ></text>
                <text style="color: #666">{{ item.text }}</text>
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>

    <view class="wrap">
      <u-tabs-swiper
        ref="tabs"
        :list="tabList"
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
          v-for="(item, index) in dataList"
          :key="index"
        >
          <scroll-view
            scroll-y
            style="height: 100%; width: 100%"
            @scrolltolower="reachBottom"
          >
            <view
              class="cu-load text-grey text-lg loading empty"
              :style="emptyTop"
              v-if="loading"
            ></view>

            <!-- #ifndef MP-BAIDU -->
            <view v-else-if="item.length > 0">
              <custom-circle-list
                :border="false"
                showJoin
                :list="item"
                @joinClick="joinClick"
              >
              </custom-circle-list>
              <u-loadmore
                v-if="item.length >= 10"
                :status="loadStatus[index]"
                bgColor="#f2f2f2"
              ></u-loadmore>
            </view>
            <!-- #endif -->
            <!-- #ifdef MP-BAIDU -->
            <view v-else-if="item.length > 0">
              <custom-nearby-circle-list
                showJoin
                :list="item"
                @joinClick="joinClick"
              >
              </custom-nearby-circle-list>
              <u-loadmore
                v-show="item.length >= 10"
                :status="loadStatus[index]"
                bgColor="#f2f2f2"
              ></u-loadmore>
            </view>
            <!-- #endif -->

            <view class="empty" :style="emptyTop" v-else>
              <u-empty text="附近没有圈">
                <u-button slot="bottom" size="mini" @click="toCreateCircle">
                  去创建
                </u-button>
              </u-empty>
            </view>
          </scroll-view>
        </swiper-item>
      </swiper>
    </view>

    <u-mask :show="show" :mask-click-able="maskClickAble" @click="show = false">
      <view class="to-create" :style="to_create_style" v-if="show_create">
        <view class="bg-white" :style="mask_create_style">
          <text>创建圈</text>
          <text class="lg cuIcon-add"></text>
        </view>
        <view class="create-img">
          <image style="width: 150rpx; height: 150rpx" :src="to_create"></image>
        </view>
        <view class="text-xl text-bold text-white margin-tb-sm">创建圈</view>
        <view class="text-white padding-xs"
          >以此时位置为圆心，<br />圈范围为半径，快速创建一个圈子。<br />创建圈后即可邀请附近的用户加入哦！</view
        >
        <button class="cu-btn round lines-white margin-top-sm" @tap="konwClick">
          我知道了
        </button>
      </view>

      <view class="to_slide" v-if="show_slide">
        <view class="slide-animation">
          <image style="width: 100rpx; height: 100rpx" :src="to_slide"></image>
        </view>
        <text class="text-white padding-xs">左滑查看更多分类</text>
      </view>
    </u-mask>
  </view>
</template>

<script>
import { mapState } from 'vuex'
import localStore from '@/helpers/localStore.js'

export default {
  data() {
    return {
      modalName: null,
      radio: 'radio1',
      list: [
        {
          icon: 'locationfill',
          text: '地图模式'
        },
        {
          icon: 'radioboxfill',
          text: '极简模式'
        }
      ],
      show: true,
      maskClickAble: false,
      show_create: true,
      show_slide: false,
      to_create: '/static/guide/to_create.png',
      to_slide: '/static/guide/to_slide.png',
      refreshing: false,
      tabList: [
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
      loadingList: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
      offset: 1,
      loadStatus: ['loadmore', 'loadmore', 'loadmore', 'loadmore'],
      loadCount: 0
    }
  },

  computed: {
    ...mapState('circle', ['circleList']),
    curOffset() {
      let offset
      this.circleList.forEach((i) => {
        if (i.type === this.current) offset = i.offset
      })
      return offset
    },
    curList() {
      let curList
      this.circleList.forEach((i) => {
        if (i.type === this.current) curList = i.list
      })
      return curList
    },
    dataList() {
      return this.circleList.map((i) => i.list)
    },
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
    },
    to_create_style() {
      const style = `position: fixed; right: 100rpx; top:${
        this.CustomBar + 30
      }px;`
      return style
    },
    mask_create_style() {
      const style = `position: fixed; right: 17%; top:${this.CustomBar - 3}px;`
      return style
    }
  },

  onLoad() {
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

  onPullDownRefresh() {
    if (this.refreshing) return
    this.refreshing = true
    this.loading = true
    this.$store.commit('circle/resetCircleList')
    this.offset = this.curOffset
    this.getCircleList()
  },

  methods: {
    toSearch() {
      this.$u.route('/pages/components/search/search')
    },

    showModal(e) {
      this.modalName = e.currentTarget.dataset.target
    },

    hideModal(e) {
      this.modalName = null
    },

    itemClick(text) {
      this.hideModal()
      switch (text) {
        case '地图模式':
          if (uni.getSystemInfoSync().platform === 'ios') {
            this.$u.toast('ios 因兼容性问题暂未开放')
          } else {
            this.$u.route(
              '/pages/components/create-circle-map/create-circle-map'
            )
          }
          break
        case '极简模式':
          this.$u.route('/pages/components/create-circle/create-circle')
          break
      }
    },

    konwClick() {
      this.show_create = false
      this.show_slide = true
      this.maskClickAble = true
    },

    toCreateCircle() {
      this.$u.route('/pages/components/create-circle/create-circle')
    },

    getCircleList() {
      this.$store
        .dispatch('circle/nearlyCircleByPage', {
          type: this.swiperCurrent,
          offset: this.offset
        })
        .then(() => {
          this.loading = false
          this.refreshing = false
          uni.stopPullDownRefresh()
          if (this.curOffset === this.offset) {
            this.loadStatus.splice(this.swiperCurrent, 1, 'loadmore')
          } else {
            this.loadStatus.splice(this.swiperCurrent, 1, 'nomore')
          }
        })
        .catch(() => {
          this.loading = false
          this.refreshing = false
          uni.stopPullDownRefresh()
        })
    },

    tabsChange(index) {
      this.swiperCurrent = index
    },

    change({ detail: { current } }) {
      if (this.loading) return
      this.swiperCurrent = current
      this.current = current
      this.offset = this.curOffset
      if (this.curList.length === 0) {
        this.loading = true
        this.getCircleList()
      } else {
        this.loading = false
      }
    },

    async joinClick({ index }) {
      this.$store.commit('circle/setCircleList', {
        type: this.swiperCurrent,
        index
      })
      await this.$store.dispatch('chat/getOldChatList', 0)
      await this.$store.dispatch('chat/getNoReadNum')
    },

    reachBottom() {
      this.offset = this.curOffset
      this.offset++
      this.loadStatus.splice(this.swiperCurrent, 1, 'loading')
      this.getCircleList()
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

.cutom-modal {
  width: 300rpx;
  position: absolute;
  top: 70rpx;
  right: 60rpx;
}
.custom-icon {
  position: absolute;
  top: 30rpx;
  right: 78rpx;
}

.to-create {
  .create-img {
    position: relative;
    left: 40%;
    top: -15rpx;
  }
}

.to_slide {
  position: fixed;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);

  .slide-animation {
    position: absolute;
    top: -100rpx;
    left: 40%;
    transform: translateX(-40%);
    animation: slide 0.5s linear 0s;
  }

  @keyframes slide {
    from {
      left: 60%;
    }

    to {
      left: 40%;
    }
  }
}

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
