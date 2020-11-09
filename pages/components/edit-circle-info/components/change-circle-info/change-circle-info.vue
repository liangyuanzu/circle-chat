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
export default {
  data() {
    return {
      title: '',
      oldData: '',
      isInput: false,
      isTextarea: false,
      isNumberBox: false,
      isEdit: false,
      circleInfo: {}
    }
  },

  onLoad(options) {
    this.title = options.title
    this.isEdit = options.isEdit == 'true' ? true : false
    const circleInfo = JSON.parse(options.circleInfo)
    this.circleInfo = circleInfo
    if (this.title === '圈聊名称') {
      this.oldData = circleInfo.circleName
      this.isInput = true
    } else if (this.title === '圈简介') {
      this.oldData = circleInfo.synopsis
      this.isTextarea = true
    } else if (this.title === '圈公告') {
      this.oldData = circleInfo.notice
      this.isTextarea = true
    } else if (this.title === '入圈声明') {
      this.oldData = circleInfo.explain
      this.isTextarea = true
    } else if (this.title === '有效时间') {
      this.oldData = circleInfo.effective
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
