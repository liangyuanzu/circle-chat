<template>
  <view>
    <view style="margin-bottom: 20rpx">
      <uni-list>
        <uni-list-item title="头像" showArrow clickable @click="chooseAvatar">
          <template #footer>
            <u-avatar :src="avatar" mode="square"> </u-avatar>
          </template>
        </uni-list-item>
      </uni-list>
    </view>

    <uni-list>
      <uni-list-item
        v-for="(item, index) in infoList"
        :key="index"
        :title="item.title"
        :rightText="item.rightText"
        :note="item.note"
        noteEllipsis="2"
        showArrow
        clickable
        @click="onClick(item.title)"
      ></uni-list-item>
    </uni-list>

    <u-select
      v-model="showSex"
      :list="sexOptions"
      @confirm="sexConfirm"
    ></u-select>

    <u-picker
      mode="time"
      v-model="showBirthday"
      :default-time="birthday"
      @confirm="birthdayConfirm"
    ></u-picker>
  </view>
</template>

<script>
import { mapGetters } from 'vuex'
import { base64ToPath } from '@/utils/image-tools/index.js'

export default {
  data() {
    return {
      showSex: false,
      sexOptions: [
        {
          value: '男',
          label: '男'
        },
        {
          value: '女',
          label: '女'
        }
      ],
      showBirthday: false
    }
  },

  computed: {
    ...mapGetters('user', [
      'avatar',
      'username',
      'sex',
      'birthday',
      'autograph'
    ]),

    infoList() {
      return [
        {
          title: '昵称',
          rightText: this.username
        },
        {
          title: '性别',
          rightText: this.sex
        },
        {
          title: '生日',
          rightText: this.birthday
        },
        {
          title: '个性签名',
          rightText: this.autograph.length <= 20 ? this.autograph : '',
          note: this.autograph.length > 20 ? this.autograph : ''
        }
      ]
    }
  },

  created() {
    // 监听从裁剪页发布的事件，获得裁剪结果
    uni.$on('uAvatarCropper', (path) => {
      // #ifndef MP-BAIDU
      base64ToPath(path)
        .then((filePath) => {
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
        })
        .catch((error) => {
          console.error(error)
        })
      // #endif

      // #ifdef MP-BAIDU
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
    },

    onClick(title) {
      if (title === '性别') {
        this.showSex = true
      } else if (title === '生日') {
        this.showBirthday = true
      } else {
        this.$u.route(
          '/pages/components/info/components/change-userinfo/change-userinfo',
          {
            title
          }
        )
      }
    },

    save(data) {
      uni.showLoading()
      this.$store
        .dispatch('user/updateMessage', data)
        .then(() => {
          uni.hideLoading()
          setTimeout(() => {
            uni.showToast({
              title: '修改成功',
              icon: 'none'
            })
          }, 500)
        })
        .catch(() => {
          uni.hideLoading()
        })
    },

    sexConfirm(e) {
      const userSex = e[0].value
      this.save({ sex: userSex })
    },

    birthdayConfirm(e) {
      const userBirthday = `${e.year}/${e.month}/${e.day}`
      this.save({ birthday: userBirthday })
    }
  }
}
</script>

<style lang="scss">
</style>
