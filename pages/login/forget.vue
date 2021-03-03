<template>
  <view class="forget">
    <view class="content">
      <view class="main">
        <view class="tips">若你忘记了密码，可在此重置新密码。</view>
        <wInput
          style="margin-top: 100rpx"
          v-model="form.email"
          type="text"
          maxlength="30"
          placeholder="请输入邮箱号"
        ></wInput>
        <wInput
          v-model="form.password"
          type="password"
          placeholder="请输入新密码"
          isShowPass
        ></wInput>
        <wInput
          v-model="form.verCode"
          type="text"
          maxlength="6"
          placeholder="请输入验证码"
          ref="runCode"
          isShowCode
          @setCode="getVerCode"
        ></wInput>
      </view>

      <wButton
        class="wbutton"
        text="重置密码"
        :rotate="isRotate"
        @click="startRePass"
      ></wButton>
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
      form: {
        email: '',
        password: '',
        verCode: ''
      },
      isRotate: false //是否加载旋转
    }
  },

  methods: {
    ...mapActions('user', ['sendForgetPasswordEmail', 'forgetPassword']),

    async getVerCode() {
      await this.sendForgetPasswordEmail(this.form.email)
      this.$u.toast('发送成功')
      this.$refs.runCode.$emit('runCode')
    },

    async startRePass() {
      if (this.isRotate) return false
      this.isRotate = true
      try {
        await this.forgetPassword({
          email: this.form.email,
          password: this.form.password,
          code: this.form.verCode
        })
        this.isRotate = false
        this.$u.toast('修改成功')
        setTimeout(() => {
          uni.reLaunch({
            url: '/pages/login/login'
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

