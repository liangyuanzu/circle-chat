<template>
  <view>
    <u-tabs
      :list="optionList"
      :is-scroll="false"
      :current="current"
      @change="change"
    ></u-tabs>

    <view v-for="(item, index) in focusList" :key="index">
      <uni-list v-if="type === index + 1">
        <uni-list-item
          v-for="i in item"
          :key="i.userId"
          :title="i.username"
          :thumb="i.img"
          thumbSize="lg"
          clickable
          @click="toPersonInfo(i.userId)"
        >
          <template #right>
            <u-button
              type="primary"
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
                :class="[i.isFocus === 1 ? 'text-grey' : '']"
                >{{ formatFocus(i.isFocus) }}</text
              >
            </u-button>
          </template>
        </uni-list-item>
      </uni-list>

      <view class="empty" v-if="focusList[type - 1].length === 0">
        <u-empty mode="list"></u-empty>
      </view>
    </view>
  </view>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  data() {
    return {
      optionList: [
        {
          name: '我的关注'
        },
        {
          name: '关注我的'
        }
      ],
      current: 0
    }
  },

  computed: {
    ...mapGetters('focus', ['myFocus', 'focusMy', 'focusList']),
    type() {
      return this.current + 1
    }
  },

  onShow() {
    this.getList(this.type)
  },

  methods: {
    getList(type) {
      this.$store.dispatch('focus/getFocusList', type)
    },

    change(index) {
      this.current = index
      if (this.type === 1 && this.myFocus.length === 0) {
        this.getList(this.type)
      } else if (this.type === 2 && this.focusMy.length === 0) {
        this.getList(this.type)
      }
    },

    toPersonInfo(id) {
      this.$u.route('/pages/components/person-info/person-info', {
        id
      })
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
      await this.getList(this.type)
    }
  }
}
</script>

<style lang="scss">
</style>
