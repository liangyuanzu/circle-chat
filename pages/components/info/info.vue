<template>
  <view>
    <view class="margin-bottom-sm">
      <custom-update-avatar title="头像" :src="avatar"></custom-update-avatar>
    </view>

    <uni-list>
      <uni-list-item
        v-for="(item, index) in infoList"
        :key="index"
        :title="item.title"
        :rightText="item.rightText"
        :note="item.note"
        noteEllipsis="2"
        :showArrow="true"
        :clickable="true"
        @click="onClick(item.title)"
      >
      </uni-list-item>
    </uni-list>

    <u-select
      v-model="showSex"
      :list="sexOptions"
      @confirm="sexConfirm"
    ></u-select>

    <u-picker
      mode="time"
      :end-year="new Date().getFullYear()"
      v-model="showBirthday"
      :defaultTime="defaultTime"
      @confirm="birthdayConfirm"
    ></u-picker>
  </view>
</template>

<script>
import { mapGetters } from 'vuex'
import time from '@/helpers/time.js'
import localStore from '@/helpers/localStore.js'

export default {
  data() {
    const currentDate = this.getDate({
      format: true
    })
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
      defaultTime: '',
      date: currentDate
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

    startDate() {
      return this.getDate('start')
    },
    endDate() {
      return this.getDate('end')
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

    bindDateChange: function (e) {
      this.date = e.target.value
    },

    getDate(type) {
      const date = new Date()
      let year = date.getFullYear()
      let month = date.getMonth() + 1
      let day = date.getDate()

      if (type === 'start') {
        year = year - 60
      } else if (type === 'end') {
        year = year + 2
      }
      month = month > 9 ? month : '0' + month
      day = day > 9 ? day : '0' + day
      return `${year}-${month}-${day}`
    },

    save(data) {
      uni.showLoading({
        title: '修改中...'
      })
      this.$store
        .dispatch('user/updateMessage', data)
        .then(() => {
          if (data.sex) {
            this.$store.commit('user/setSex', data.sex)
            let userinfo = localStore.get('userinfo')
            userinfo.sex = data.sex
            localStore.set('userinfo', userinfo)
          } else if (data.birthday) {
            this.$store.commit('user/setBirthday', data.birthday)
            let userinfo = localStore.get('userinfo')
            userinfo.birthday = data.birthday
            localStore.set('userinfo', userinfo)
          }
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
      const newBirthday = `${e.year}-${e.month}-${e.day}`
      this.save({ birthday: newBirthday })
    }
  }
}
</script>

<style lang="scss">
</style>
