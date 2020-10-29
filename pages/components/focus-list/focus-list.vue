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
        </uni-list-item>
      </uni-list>
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

  onLoad() {
    if (this.myFocus.length === 0 || !this.focusMy.length === 0) {
      this.getList(this.type)
    }
  },

  methods: {
    getList(type) {
      uni.showLoading()
      this.$store
        .dispatch('focus/getFocusList', type)
        .then(() => {
          uni.hideLoading()
        })
        .catch(() => {
          uni.hideLoading()
        })
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
    }
  }
}
</script>

<style lang="scss">
</style>
