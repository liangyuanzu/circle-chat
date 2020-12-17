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
                  class="lg text-grey"
                  :class="'cuIcon-' + item.icon"
                ></text>
                <text class="text-grey">{{ item.text }}</text>
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>

    <tabs-swiper />

    <u-mask :show="show" :mask-click-able="maskClickAble" @click="show = false">
      <view class="to-create" :style="to_create_style" v-if="show_create">
        <view class="bg-white" :style="mask_create_style">
          <text>创建圈</text>
          <text class="lg cuIcon-add"></text>
        </view>
        <view class="create-img">
          <u-image width="150rpx" height="150rpx" :src="to_create"></u-image>
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
          <u-image width="100rpx" height="100rpx" :src="to_slide"></u-image>
        </view>
        <text class="text-white padding-xs">左滑查看更多分类</text>
      </view>
    </u-mask>
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
      to_create: '/static/guide/msg/to_create.png',
      to_slide: '/static/guide/msg/to_slide.png'
    }
  },

  computed: {
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
</style>
