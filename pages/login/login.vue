<template>
  <view class="login">
    <view class="content">
      <view class="header">
        <image :src="logoImage" />
      </view>
      <view class="main">
        <wInput
          v-model="form.email"
          type="text"
          maxlength="30"
          placeholder="请输入邮箱号"
        ></wInput>
        <wInput
          v-model="form.password"
          type="password"
          placeholder="请输入密码"
          isShowPass
        ></wInput>
      </view>
      <wButton
        class="wbutton"
        text="登 录"
        :rotate="isRotate"
        @click="startLogin"
      ></wButton>

      <view class="footer">
        <navigator url="forget" open-type="navigate">忘记密码</navigator>
        <text>|</text>
        <navigator url="register" open-type="navigate">注册账号</navigator>
      </view>
    </view>
  </view>
</template>

<script>
import { mapActions } from 'vuex'
import wInput from '../../components/watch-login/watch-input.vue'
import wButton from '../../components/watch-login/watch-button.vue'

export default {
  components: {
    wInput,
    wButton
  },

  data() {
    return {
      logoImage: '/static/logo.png',
      form: {
        email: '',
        password: ''
      },
      isRotate: false //是否加载旋转
    }
  },

  methods: {
    ...mapActions('user', ['login']),

    async startLogin() {
      if (this.isRotate) return false
      this.isRotate = true
      try {
        await this.login({
          email: this.form.email,
          password: this.form.password
        })
        this.isRotate = false
        this.$u.toast('登录成功')
        setTimeout(() => {
          uni.reLaunch({
            url: '/pages/msg/msg'
          })
        }, 1000)
      } catch {
        this.isRotate = false
      }
    }
  }
}
</script>

<style>
@import url('../../components/watch-login/css/icon.css');
@import url('./css/main.css');
</style>
