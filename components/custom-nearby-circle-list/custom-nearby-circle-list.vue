<template>
  <view>
    <view class="cu-list menu-avatar">
      <view
        class="cu-item"
        v-for="item in list"
        :key="item.circleId"
        @click="onClick(item)"
      >
        <view
          class="cu-avatar radius lg"
          :style="'background-image: url(' + item.img + ')'"
        ></view>
        <view class="content">
          <view class="text-cut">{{ item.circleName }}</view>
          <view>
            <view class="cu-capsule radius" v-if="item.member">
              <view class="cu-tag bg-blue sm">
                <text class="cuIcon-group"></text>
              </view>
              <view class="cu-tag line-blue sm"> {{ item.member }} </view>
            </view>
            <view class="cu-capsule radius" v-if="item.radius">
              <view class="cu-tag bg-black sm">
                <text class="cuIcon-radiobox"></text>
              </view>
              <view class="cu-tag line-black sm">{{
                $formatRadius(item.radius)
              }}</view>
            </view>
          </view>
          <view class="text-gray text-sm flex" v-if="showNote && item.synopsis">
            <view class="text-cut"> {{ item.synopsis }}</view></view
          >
        </view>
        <view class="action margin-right">
          <view v-if="showJoin">
            <u-button
              :type="item.inCircle ? 'default' : 'primary'"
              size="mini"
              shape="circle"
              plain
              @click="jionCircle(item)"
            >
              <uni-icons
                :size="12"
                color="#0081ff"
                :type="item.inCircle ? '' : 'plusempty'"
              />
              <text
                style="margin-left: 10rpx"
                :class="[item.inCircle ? 'text-grey' : '']"
                >{{ formatJoin(item.inCircle) }}</text
              >
            </u-button>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
/**
 * custom-nearby-circle-list 自定义附近的圈列表组件
 * @description 本组件是适用于本项目的附近的圈列表组件，用于兼容百度小程序
 * @property {Boolean, String} 	showJoin = [true|false] 		是否显示加入按钮
 * @property {Boolean, String} 	showNote = [true|false] 		是否显示圈简介
 * @property {Array} 	list 							圈列表
 * @event {Function} 	click 							点击列表项触发事件
 * @event {Function} 	joinClick 							点击 关注按钮 触发事件
 */
export default {
  name: 'custom-nearby-circle-list',

  props: {
    showJoin: {
      type: [Boolean, String],
      default: false
    },
    showNote: {
      type: [Boolean, String],
      default: true
    },
    list: {
      type: Array,
      default: []
    }
  },

  methods: {
    formatJoin(inCircle) {
      if (inCircle) return '已加入'
      return '加入'
    },

    onClick(item) {
      if (item.inCircle) {
        this.toCircleChat(item)
      } else {
        this.$u.route('/pages/components/circle-detail/circle-detail', {
          circleId: item.circleId
        })
      }
      this.$emit('click')
    },

    toCircleChat(circleInfo) {
      this.$u.route('/pages/components/chat/chat', {
        circleInfo: encodeURIComponent(JSON.stringify(circleInfo))
      })
    },

    async jionCircle(circleinfo) {
      if (circleinfo?.inCircle) return
      await this.$store
        .dispatch('circle/joinCircle', {
          circleId: circleinfo.circleId
        })
        .then(() => {
          setTimeout(() => {
            uni.showToast({
              title: '加入成功',
              icon: 'none'
            })
            setTimeout(() => {
              this.toCircleChat(circleinfo)
            }, 500)
          }, 500)
        })
      this.$emit('joinClick')
    }
  }
}
</script>

<style lang="scss">
.cu-list.menu-avatar > .cu-item .content .cu-tag.sm {
  margin-left: 0;
}
</style>
