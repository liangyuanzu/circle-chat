<template>
  <view>
    <view class="margin-bottom-sm">
      <custom-update-avatar
        title="头像"
        :src="avatar"
        :clickable="avatarClickable"
        :showArrow="avatarShowArrow"
      ></custom-update-avatar>
    </view>

    <uni-list>
      <uni-list-item
        v-for="(item, index) in infoList"
        :key="index"
        :title="item.title"
        :rightText="item.rightText"
        :note="item.note"
        noteEllipsis="2"
        :showArrow="itemShowArrow(item.title)"
        :clickable="itemClickable(item.title)"
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
      :defaultTime="defaultTime"
      @confirm="birthdayConfirm"
    ></u-picker>
  </view>
</template>

<script>
import { mapGetters } from 'vuex'
import time from '@/helpers/time.js'

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
      showBirthday: false,
      defaultTime: ''
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

    avatarClickable() {
      // #ifdef MP-BAIDU
      return false
      // #endif
    },

    avatarShowArrow() {
      // #ifdef MP-BAIDU
      return false
      // #endif
    },

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

  onReady() {
    if (this.birthday) {
      this.defaultTime = this.birthday
    } else {
      this.defaultTime = time.format('yyyy-MM-dd')
    }
  },

  methods: {
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
    },

    itemClickable(title) {
      // #ifdef MP-BAIDU
      if (title === '昵称' || title === '性别') return false
      // #endif
      return true
    },

    itemShowArrow(title) {
      // #ifdef MP-BAIDU
      if (title === '昵称' || title === '性别') return false
      // #endif
      return true
    }
  }
}
</script>

<style lang="scss">
</style>
