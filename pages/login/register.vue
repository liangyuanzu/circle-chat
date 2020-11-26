<template>
  <view class="register">
    <view class="content">
      <!-- 头部logo -->
      <view class="header">
        <image :src="logoImage" />
      </view>
      <!-- 主体 -->
      <view class="main">
        <wInput
          v-model="form.username"
          type="text"
          placeholder="请输入用户名"
          @blur="errMessage()"
        ></wInput>
        <wInput
          v-model="form.password"
          type="password"
          maxlength="12"
          placeholder="请输入密码"
          @input="pwdChage(form.password)"
          @blur="errMessage()"
          isShowPass
        ></wInput>
        <wInput
          v-model="form.rePassword"
          type="password"
          maxlength="12"
          placeholder="请确认密码"
          @input="pwdChage(form.rePassword)"
          @blur="confirmPwd()"
          isShowPass
        ></wInput>
        <wInput
          v-model="form.email"
          type="text"
          maxlength="30"
          placeholder="请输入邮箱号"
          @input="emailChage()"
          @blur="errMessage()"
        ></wInput>
        <wInput
          v-model="form.verCode"
          type="text"
          maxlength="6"
          placeholder="请输入验证码"
          ref="runCode"
          @setCode="getVerCode()"
          @input="codeChage()"
          :isShowCode="isShowCode"
        ></wInput>
      </view>

      <wButton
        class="wbutton"
        text="注 册"
        :disabled="showReg()"
        :rotate="isRotate"
        @click="startReg()"
      ></wButton>

      <!-- 底部信息 -->
      <view class="footer">
        <text
          @tap="isShowAgree"
          class="cuIcon"
          :class="showAgree ? 'cuIcon-radiobox' : 'cuIcon-round'"
          >同意</text
        >
        <!-- 协议地址 -->
        <navigator :url="agreeUrl" open-type="navigate">《协议》</navigator>
      </view>
    </view>
  </view>
</template>

<script>
var _this
import wInput from '../../components/watch-login/watch-input.vue' //input
import wButton from '../../components/watch-login/watch-button.vue' //button
import logoImage from './logo.js'
import md5Libs from 'uview-ui/libs/function/md5'

export default {
  data() {
    return {
      logoImage, //logo图片 base64
      form: {
        username: '', // 用户名
        password: '', //密码
        rePassword: '', //确认密码
        email: '', // 邮箱
        verCode: '' //验证码
      },
      showAgree: true, //协议是否选择
      agreeUrl: '', // 协议 url
      isRotate: false, //是否加载旋转
      isPwd: false, //判断密码是否符合要求
      pwdIsSame: false, // 两次输入的密码是否一致
      isEmail: false, //判断邮箱号是否正确
      isVerCode: false, //判断验证码长度是否符合要求
      isShowCode: false //是否显示获取验证码
    }
  },

  components: {
    wInput,
    wButton
  },

  mounted() {
    _this = this
  },

  methods: {
    isShowAgree() {
      //是否选择协议
      _this.showAgree = !_this.showAgree
    },

    pwdChage(pwd) {
      this.$u.debounce(() => {
        // 判断密码是否符合规范
        if (/^[\w]{6,12}$/.test(pwd)) {
          _this.isPwd = true
        } else {
          _this.isPwd = false
        }
      }, 200)
    },

    confirmPwd() {
      if (_this.form.password !== _this.form.rePassword) {
        uni.showToast({
          icon: 'none',
          position: 'bottom',
          title: '两次输入的密码不一致'
        })
        _this.pwdIsSame = false
      } else {
        _this.pwdIsSame = true
      }
    },

    emailChage() {
      this.$u.debounce(() => {
        // 判断邮箱号格式是否正确
        if (this.$u.test.email(_this.form.email)) {
          _this.isEmail = true
          _this.isShowCode = true
        } else {
          _this.isEmail = false
          _this.isShowCode = false
        }
      }, 200)
    },

    codeChage() {
      this.$u.debounce(() => {
        // 判断验证码长度是否符合规范
        if (_this.form.verCode.length === 6) {
          _this.isVerCode = true
        } else {
          _this.isVerCode = false
        }
      }, 200)
    },

    showReg() {
      //注册按钮是否可选
      if (
        this.form.username &&
        this.isPwd &&
        this.pwdIsSame &&
        this.isEmail &&
        this.isVerCode &&
        this.showAgree
      ) {
        return true
      } else {
        return false
      }
    },

    errMessage() {
      // 错误信息
      if (!_this.form.username) {
        uni.showToast({
          icon: 'none',
          position: 'bottom',
          title: '请输入用户名'
        })
        return false
      }
      if (!_this.isPwd || !_this.pwdIsSame) {
        uni.showToast({
          icon: 'none',
          position: 'bottom',
          title: '请输入6-12位字母数字下划线密码'
        })
        return false
      }
      if (!_this.isEmail) {
        uni.showToast({
          icon: 'none',
          position: 'bottom',
          title: '邮箱号不正确'
        })
        return false
      }
      if (!_this.showAgree) {
        uni.showToast({
          icon: 'none',
          position: 'bottom',
          title: '请同意《协议》'
        })
        return false
      }
    },

    getVerCode() {
      //获取验证码
      this.$store
        .dispatch('user/sendRegisterEmail', _this.form.email)
        .then(() => {
          uni.showToast({
            icon: 'none',
            position: 'bottom',
            title: '发送成功'
          })
          this.$refs.runCode.$emit('runCode')
        })
        .catch(() => {
          uni.showToast({
            icon: 'none',
            position: 'bottom',
            title: '发送失败'
          })
        })
    },

    startReg() {
      //注册
      if (this.isRotate) {
        //判断是否加载中，避免重复点击请求
        return false
      }

      _this.isRotate = true
      this.$store
        .dispatch('user/register', {
          username: _this.form.username,
          password: _this.form.password,
          rePassword: _this.form.rePassword,
          email: _this.form.email,
          code: _this.form.verCode
        })
        .then(() => {
          _this.isRotate = false
          uni.showToast({
            icon: 'success',
            title: '注册成功'
          })
          setTimeout(() => {
            uni.reLaunch({
              url: '/pages/login/login'
            })
          }, 1000)
        })
        .catch(() => {
          _this.isRotate = false
        })
    }
  }
}
</script>

<style>
@import url('../../components/watch-login/css/icon.css');
@import url('./css/main.css');
</style>
