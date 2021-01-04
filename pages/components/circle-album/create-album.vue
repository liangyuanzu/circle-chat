<template>
  <view class="wrap">
    <u-form :model="form" ref="uForm" label-width="120" :border-bottom="false">
      <u-form-item
        label-width="150"
        label="相册名"
        prop="name"
        :border-bottom="false"
        required
      >
        <u-input
          v-model="form.name"
          maxlength="15"
          placeholder="请输入相册名"
        />
      </u-form-item>

      <u-form-item label="描述" :border-bottom="false">
        <u-input
          v-model="form.introduction"
          type="textarea"
          :auto-height="false"
          maxlength="60"
          :customStyle="{
            height: '180rpx'
          }"
          placeholder="请输入相册描述"
        />
      </u-form-item>

      <u-form-item label="上传图片" label-width="150" :border-bottom="false">
        <u-upload
          width="160"
          height="160"
          max-count="1"
          :size-type="['compressed']"
          :action="uploadFixedCircleImage"
          :form-data="formData"
          :header="header"
          :show-progress="false"
          ref="uUpload"
        ></u-upload>
      </u-form-item>

      <view style="margin-top: 100rpx">
        <u-button @click="creatAlbum">创建相册</u-button>
      </view>
    </u-form>
  </view>
</template>

<script>
import { uploadFixedCircleImage } from '@/config/config.js'
import localStore from '@/helpers/localStore.js'
import { mapState } from 'vuex'

export default {
  data() {
    return {
      form: {
        name: '',
        introduction: '',
        img: ''
      },
      uploadFixedCircleImage,
      header: {
        sessionid: localStore.get('sessionId')
      },
      rules: {
        name: [
          {
            required: true,
            message: '请输入相册名',
            trigger: ['change', 'blur']
          }
        ]
      }
    }
  },

  computed: {
    ...mapState('circle', ['circleInfo']),
    formData() {
      return {
        name: 'file',
        circleId: this.circleInfo.circleId
      }
    }
  },

  onReady() {
    this.$refs.uForm.setRules(this.rules)
  },

  methods: {
    creatAlbum() {
      const files = this.$refs.uUpload.lists.filter(
        (val) => val.progress == 100
      )
      if (files.length > 0) {
        let src = files[0].response?.data || ''
        if (typeof src === 'object' && Object.keys(src).length === 0) {
          uni.showToast({
            title: '图片上传失败，请重新上传',
            icon: 'none'
          })
          return
        }
        this.form.img = src
      } else {
        this.form.img = ''
      }

      if (!this.form.img) {
        uni.showToast({
          title: '请上传图片',
          icon: 'none'
        })
        return
      }

      this.$refs.uForm.validate((valid) => {
        if (valid) {
          uni.showLoading({
            title: '创建中...'
          })
          this.$store
            .dispatch('circle/createAlbum', {
              circleId: this.circleInfo.circleId,
              name: this.form.name,
              introduction: this.form.introduction,
              img: this.form.img
            })
            .then(async () => {
              await this.$store.dispatch(
                'circle/getAlbum',
                this.circleInfo.circleId
              )
              uni.hideLoading()
              setTimeout(() => {
                uni.showToast({
                  icon: 'none',
                  title: '创建成功'
                })
                setTimeout(() => {
                  uni.navigateBack()
                }, 500)
              }, 500)
            })
            .catch(() => {
              uni.hideLoading()
              setTimeout(() => {
                uni.showToast({
                  icon: 'none',
                  title: '创建失败'
                })
              }, 500)
            })
        }
      })
    }
  }
}
</script>

<style lang="scss">
page {
  background-color: #fff;
}

.wrap {
  padding: 30rpx;
}
</style>
