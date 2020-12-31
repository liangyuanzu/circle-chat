<template>
  <view>
    <uni-list>
      <uni-list-item
        v-for="i in list"
        :key="i.userId"
        :title="i.username"
        :thumb="i.img"
        thumbSize="lg"
        :border="border"
        clickable
        @click="onClick(i.userId)"
      >
        <view
          slot="footer"
          class="flex align-center"
          :class="{ 'margin-right-xl': isMargin }"
        >
          <view v-show="i.userId !== userId">
            <u-button
              :type="i.isFocus === 1 ? 'default' : 'primary'"
              size="mini"
              shape="circle"
              plain
              @click="onFocus(i.isFocus, i.userId)"
            >
              <uni-icons
                :size="12"
                color="#0081ff"
                :type="!focusStatus(i.isFocus) ? 'plusempty' : ''"
              />
              <text
                style="margin-left: 10rpx"
                :class="[i.isFocus === 1 ? 'text-gray' : '']"
                >{{ formatFocus(i.isFocus) }}</text
              >
            </u-button>
          </view>
        </view>
      </uni-list-item>
    </uni-list>
  </view>
</template>

<script>
/**
 * custom-focus-list 自定义关注列表组件
 * @description 本组件是适用于本项目的关注列表组件，一般用于展示关注信息的地方，如关注列表，圈聊索引列表。
 * @property {String} 	border = [true|false] 		列表项边框
 * @property {Array} 	list 							数据列表
 * @property {Boolean} isMargin = [true|false] 按钮右侧是否空出间距
 *
 * @event {Function} click 列表项被被点击
 * @event {Function} focusClick 按钮被点击
 */
import { mapState } from 'vuex'

export default {
  name: 'custom-focus-list',

  props: {
    border: {
      type: Boolean,
      default: false
    },
    list: {
      type: Array,
      default: []
    },
    isMargin: {
      type: Boolean,
      default: false
    }
  },

  computed: {
    ...mapState('user', ['userId'])
  },

  methods: {
    onClick(id) {
      this.$u.route('/pages/components/person-info/person-info', {
        id
      })
      this.$emit('click')
    },

    focusStatus(isFocus) {
      if (isFocus === 0 || isFocus === 2) return false
      if (isFocus === 1 || isFocus === 3) return true
    },

    formatFocus(isFocus) {
      if (isFocus === 1) {
        return '已关注'
      } else if (isFocus === 3) {
        return '互相关注'
      } else if (!this.focusStatus(isFocus)) {
        return '关注'
      }
    },

    async onFocus(isFocus, id) {
      if (!this.focusStatus(isFocus)) {
        await this.$store.dispatch('focus/addFocus', { id })
      } else if (this.focusStatus(isFocus)) {
        await this.$store.dispatch('focus/cancelFocus', { id })
      }
      this.$emit('focusClick')
    }
  }
}
</script>

<style lang="scss">
</style>
