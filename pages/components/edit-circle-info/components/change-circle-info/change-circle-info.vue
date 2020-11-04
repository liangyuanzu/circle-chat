<template>
  <view>
    <custom-update-info
      :title="title"
      :data="data"
      :isInput="isInput"
      :isTextarea="isTextarea"
      @top="save"
    ></custom-update-info>
  </view>
</template>

<script>
export default {
  data() {
    return {
      title: '',
      data: '',
      isInput: false,
      isTextarea: false,
      circleInfo: {}
    }
  },

  onLoad(options) {
    this.title = options.title
    const circleInfo = JSON.parse(options.circleInfo)
    this.circleInfo = circleInfo
    if (this.title === '圈聊名称') {
      this.data = circleInfo.circleName
      this.isInput = true
    } else if (this.title === '圈简介') {
      this.data = circleInfo.synopsis
      this.isTextarea = true
    } else if (this.title === '圈公告') {
      this.data = circleInfo.notice
      this.isTextarea = true
    } else if (this.title === '入圈声明') {
      this.data = circleInfo.explain
      this.isTextarea = true
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
      }
    },

    commit(data) {
      uni.showLoading()
      this.$store
        .dispatch('circle/updateCircleInfo', {
          circleId: this.circleInfo.circleId,
          ...data
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
