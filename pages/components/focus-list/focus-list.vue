<template>
  <view>
    <u-tabs
      :list="optionList"
      :is-scroll="false"
      :current="current"
      @change="change"
    ></u-tabs>

    <view v-for="(item, index) in focusList" :key="index">
      <custom-focus-list
        v-if="type === index + 1"
        :list="item"
        @focusClick="onFocus"
      ></custom-focus-list>

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

    async onFocus() {
      await this.getList(this.type)
    }
  }
}
</script>

<style lang="scss">
</style>
