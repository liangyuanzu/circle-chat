<template>
  <view>
    <uni-list>
      <uni-list-item :title="title" showArrow clickable @click="chooseAvatar">
        <template #footer>
          <u-avatar :src="src" mode="square"> </u-avatar>
        </template>
      </uni-list-item>
    </uni-list>
  </view>
</template>

<script>
/**
 * custom-update-avatar 自定义更新头像组件
 * @description 本组件是适用于本项目的更新头像组件，一般用于展示更新头像的地方，如个人资料，圈聊资料编辑。
 * @property {String} 	title 							标题
 * @property {String} src 头像路径，如加载失败，将会显示默认头像
 * @property {Boolean} isCircle = [true|false] 是否为群头像
 *
 * @event {Function} click 头像被点击
 */

import { base64ToPath } from '@/utils/image-tools/index.js'
export default {
  props: {
    title: {
      type: String,
      default: ''
    },
    src: {
      type: String,
      default: ''
    },
    isCircle: {
      type: Boolean,
      default: false
    }
  },

  created() {
    // 监听从裁剪页发布的事件，获得裁剪结果
    uni.$on('uAvatarCropper', (path) => {
      // #ifndef MP-BAIDU
      base64ToPath(path)
        .then((filePath) => {
          if (!this.isCircle) {
            this.$store
              .dispatch('user/updatePhoto', filePath)
              .then(() => {
                uni.showToast({
                  icon: 'none',
                  position: 'bottom',
                  title: '修改成功'
                })
              })
              .catch(() => {})
          }
        })
        .catch((error) => {
          console.error(error)
        })
      // #endif

      // #ifdef MP-BAIDU
      if (!this.isCircle) {
        this.$store
          .dispatch('user/updatePhoto', path)
          .then(() => {
            uni.showToast({
              icon: 'none',
              position: 'bottom',
              title: '修改成功'
            })
          })
          .catch(() => {})
      }
      // #endif
    })
  },

  methods: {
    chooseAvatar() {
      this.$u.route({
        url: '/uview-ui/components/u-avatar-cropper/u-avatar-cropper',
        params: {
          // 输出图片宽度，高等于宽，单位px
          destWidth: 200,
          // 裁剪框宽度，高等于宽，单位px
          rectWidth: 200,
          // 输出的图片类型，如果'png'类型发现裁剪的图片太大，改成"jpg"即可
          fileType: 'jpg'
        }
      })
    }
  }
}
</script>

<style lang="scss">
</style>
