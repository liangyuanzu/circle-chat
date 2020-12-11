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
      ]
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
</style>
