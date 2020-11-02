<template>
  <view>
    <uni-list :border="border">
      <uni-list-item
        v-for="item in list"
        :key="item.circleId"
        :title="item.circleName || item.name"
        ellipsis="1"
        :thumb="item.img"
        thumbSize="lg"
        :note="item.synopsis"
        :showArrow="showArrow"
        clickable
        @click="onClick(item)"
      >
        <template #right>
          <view>
            <view class="cu-capsule radius flex" v-if="item.member">
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
 * @property {String} 	border = [true|false] 		边框
 * @property {Boolean} 	showArrow = [true|false] 		是否右侧箭头
 * @property {Array} 	list 							圈列表
 * @event {Function} 	click 							点击 uniListItem 触发事件
 */
export default {
  props: {
    border: {
      type: Boolean,
      default: true
    },
    showArrow: {
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
.cu-capsule + .cu-capsule {
  margin-left: 0;
}
</style>
