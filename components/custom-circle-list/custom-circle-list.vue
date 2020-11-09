<template>
  <view>
    <uni-list>
      <uni-list-item
        v-for="item in list"
        :key="item.circleId"
        :thumb="item.img"
        thumbSize="lg"
        :showArrow="showArrow"
        :border="border"
        clickable
        @click="onClick(item)"
      >
        <template #body>
          <view>
            <!-- 标题 -->
            <view class="text-lg text-black text-cut" style="width: 474rpx">
              {{ item.circleName || item.name }}
            </view>
            <!-- 标签 -->
            <view class="cu-capsule radius" v-if="item.member">
              <view class="cu-tag bg-blue sm">
                <text class="cuIcon-group"></text>
              </view>
              <view class="cu-tag line-blue sm">
                {{ item.member }}
              </view>
            </view>
            <view class="cu-capsule radius" v-if="item.radius">
              <view class="cu-tag bg-black sm">
                <text class="cuIcon-radiobox"></text>
              </view>
              <view class="cu-tag line-black sm">
                {{ formatRadius(item.radius) }}</view
              >
            </view>
            <!-- 简介 -->
            <view
              class="text-sm text-grey my-text-cut"
              style="width: 474rpx; margin-top: 10rpx"
            >
              {{ item.synopsis }}
            </view>
          </view>
        </template>

        <template #footer>
          <view class="flex align-center" v-if="showJoin">
            <u-button type="primary" size="mini" shape="circle" plain>
              <uni-icons :size="12" color="#0081ff" :type="'plusempty'" />
              <text style="margin-left: 10rpx">加入</text>
            </u-button>
          </view>
        </template>
      </uni-list-item>
    </uni-list>
  </view>
</template>

<script>
/**
 * custom-circle-list 自定义圈列表组件
 * @description 本组件是适用于本项目的圈列表组件，一般用于展示圈列表的地方，如附近的圈，我加入的圈。
 * @property {String} 	border = [true|false] 		列表项边框
 * @property {Boolean, String} 	showArrow = [true|false] 		是否显示右侧箭头
 * @property {Boolean, String} 	showJoin = [true|false] 		是否显示加入按钮
 * @property {Array} 	list 							圈列表
 * @event {Function} 	click 							点击 uniListItem 触发事件
 */
export default {
  name: 'custom-circle-list',

  props: {
    border: {
      type: Boolean,
      default: true
    },
    showArrow: {
      type: [Boolean, String],
      default: false
    },
    showJoin: {
      type: [Boolean, String],
      default: false
    },
    list: {
      type: Array,
      default: []
    }
  },

  methods: {
    formatRadius(radius) {
      if (radius > 0 && radius < 1000) {
        return radius + ' m'
      } else {
        return parseInt(radius / 1000) + ' km'
      }
    },

    onClick(item) {
      this.$emit('click', item)
    }
  }
}
</script>

<style lang="scss">
.my-text-cut {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  overflow: hidden;
  /*! autoprefixer: off */
  -webkit-box-orient: vertical;
}
</style>
