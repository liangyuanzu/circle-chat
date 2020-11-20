<template>
  <view>
    <custom-update-info
      :title="title"
      :oldData="oldData"
      :isInput="isInput"
      :isTextarea="isTextarea"
      :isNumberBox="isNumberBox"
      :isEdit="isEdit"
      @top="save"
    ></custom-update-info>
  </view>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  data() {
    return {
      title: '',
      oldData: '',
      isInput: false,
      isTextarea: false,
      isNumberBox: false,
      isEdit: false
    }
  },

  computed: {
    ...mapGetters('circle', ['circleInfo'])
  },

  async onLoad(options) {
    this.title = options.title
    this.isEdit = options.isEdit == 'true' ? true : false
    await this.$store.dispatch('circle/getCircleInfo', options.circleId)
    if (this.title === '圈聊名称') {
      this.oldData = this.circleInfo.circleName
      this.isInput = true
    } else if (this.title === '圈简介') {
      this.oldData = this.circleInfo.synopsis
      this.isTextarea = true
    } else if (this.title === '圈公告') {
      this.oldData = this.circleInfo.notice
      this.isTextarea = true
    } else if (this.title === '入圈声明') {
      this.oldData = this.circleInfo.explain
      this.isTextarea = true
    } else if (this.title === '有效时间') {
      this.oldData = this.circleInfo.effective
      this.isNumberBox = true
    }
  },

  methods: {
    save(content) {
      if (this.title === '圈聊名称') {
        this.commit({ name: content })
      } else if (this.title === '圈简介') {
        this.commit({ synopsis: content })
      } else if (this.title === '圈公告') {
        this.commit({ notice: content })
      } else if (this.title === '入圈声明') {
        this.commit({ explain: content })
      } else if (this.title === '有效时间') {
        this.commitEffective({ effective: content })
      }
    },

    commit(newData) {
      uni.showLoading()
      this.$store
        .dispatch('circle/updateCircleInfo', {
          circleId: this.circleInfo.circleId,
          ...newData
        })
        .then(() => {
          uni.hideLoading()
          setTimeout(() => {
            uni.showToast({
              title: '修改成功',
              icon: 'none'
            })
            setTimeout(() => {
              this.$u.route({ type: 'back' })
            }, 500)
          }, 500)
        })
        .catch(() => {
          uni.hideLoading()
        })
    },

    commitEffective(newData) {
      uni.showLoading()
      this.$store
        .dispatch('circle/addCircleEffective', {
          circleId: this.circleInfo.circleId,
          ...newData
        })
        .then(() => {
          uni.hideLoading()
          setTimeout(() => {
            uni.showToast({
              title: '修改成功',
              icon: 'none'
            })
            setTimeout(() => {
              this.$u.route({ type: 'back' })
            }, 500)
          }, 500)
        })
        .catch(() => {
          uni.hideLoading()
        })
    }
  }
}
</script>

<style lang="scss">
</style>
