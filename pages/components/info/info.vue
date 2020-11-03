<template>
  <view>
    <custom-update-avatar title="头像" :src="avatar"></custom-update-avatar>

    <uni-list style="margin-top: 20rpx">
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
    }
  }
}
</script>

<style lang="scss">
</style>
