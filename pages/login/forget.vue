<template>
  <view class="forget">
    <view class="content">
      <!-- 主体 -->
      <view class="main">
        <!-- <view class="tips">若你忘记了密码，可在此重置新密码。</view> -->
        <wInput
          style="margin-top: 100rpx"
          v-model="form.email"
          type="text"
          maxlength="30"
          placeholder="请输入邮箱号"
          @input="emailChage()"
          @blur="errMessage()"
        ></wInput>
        <wInput
          v-model="form.password"
          type="password"
          maxlength="12"
          placeholder="请输入新密码"
          @input="pwdChage(form.password)"
          @blur="errMessage()"
          isShowPass
        ></wInput>
        <wInput
          v-model="form.verCode"
          type="text"
          maxlength="6"
          placeholder="请输入验证码"
          ref="runCode"
          codeText="获取重置码"
          @setCode="getVerCode()"
          @input="codeChage()"
          :isShowCode="isShowCode"
        ></wInput>
      </view>

      <wButton
        class="wbutton"
        text="重置密码"
        :disabled="showReset()"
        :rotate="isRotate"
        @click="startRePass()"
      ></wButton>
    </view>
  </view>
</template>

<script>
var _this
import wInput from '../../components/watch-login/watch-input.vue' //input
import wButton from '../../components/watch-login/watch-button.vue' //button
import md5Libs from 'uview-ui/libs/function/md5'

export default {
  data() {
    return {
      form: {
        email: '', //邮箱号
        password: '', //密码
        verCode: '' //验证码
      },
      isRotate: false, //是否加载旋转
      isEmail: false, //判断邮箱号是否正确
      isPwd: false, //判断密码是否符合要求
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

    showReset() {
      //重置按钮是否可选
      if (this.isEmail && this.isPwd && this.isVerCode) {
        return true
      } else {
        return false
      }
    },

    errMessage() {
      // 错误信息
      if (!_this.isEmail) {
        uni.showToast({
          icon: 'none',
          position: 'bottom',
          title: '邮箱号不正确'
        })
        return false
      }
      if (!_this.isPwd) {
        uni.showToast({
          icon: 'none',
          position: 'bottom',
          title: '请输入6-12位字母数字下划线密码'
        })
        return false
      }
    },

    getVerCode() {
      //获取验证码
      this.$store
        .dispatch('user/sendForgetPasswordEmail', _this.form.email)
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

    startRePass() {
      //重置密码
      if (this.isRotate) {
        //判断是否加载中，避免重复点击请求
        return false
      }

      _this.isRotate = true
      this.$store
        .dispatch('user/updatePassword', {
          email: _this.form.email,
          password: md5Libs.md5(_this.form.password),
          code: _this.form.verCode
        })
        .then(() => {
          _this.isRotate = false
          uni.showToast({
            icon: 'success',
            title: '修改成功'
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

