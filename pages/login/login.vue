<template>
  <view class="login">
    <view class="content">
      <!-- 头部logo -->
      <view class="header">
        <image :src="logoImage" />
      </view>
      <!-- 主体表单 -->
      <view class="main">
        <!--
				<wInput
					v-model="phoneData"
					type="number"
					maxlength="11"
					placeholder="请输入手机号"
					@input="phoneChage"
					@blur="errMessage"
				></wInput>
        -->

        <wInput
          v-model="form.email"
          type="text"
          maxlength="30"
          placeholder="请输入邮箱号"
          @input="emailChage"
          @blur="errMessage"
        ></wInput>

        <wInput
          v-model="form.password"
          type="password"
          maxlength="12"
          placeholder="请输入密码"
          @input="pwdChage"
          isShowPass
        ></wInput>

        <!--
				<wInput
					v-model="verCode"
					type="number"
					maxlength="6"
					placeholder="请输入验证码"

					:isShowCode="isShowCode"
					ref="runCode"
					@setCode="getVerCode()"
					@input="codeChage"
				></wInput>
        -->
      </view>
      <wButton
        class="wbutton"
        text="登 录"
        :disabled="showLogin()"
        :rotate="isRotate"
        @click="startLogin"
      ></wButton>

      <!-- 其他登录 -->
      <!--
			<view class="other_login cuIcon">
				<view class="login_icon">
					<view class="cuIcon-weixin" @tap="login_weixin"></view>
				</view>
				<view class="login_icon">
					<view class="cuIcon-weibo" @tap="login_weibo"></view>
				</view>
				<view class="login_icon">
					<view class="cuIcon-github" @tap="login_github"></view>
				</view>
			</view>
      -->

      <!-- 底部信息 -->
      <view class="footer">
        <navigator url="forget" open-type="navigate">忘记密码</navigator>
        <text>|</text>
        <navigator url="register" open-type="navigate">注册账号</navigator>
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
        email: '', //邮箱号
        password: '' //密码
      },
      isEmail: false, //判断邮箱号是否正确
      isPwd: false, //判断密码是否符合要求
      isRotate: false //是否加载旋转

      // phoneData:'', //手机号
      // isPhone: false, //判断手机号是否正确
      // verCode:"", //验证码
      // isVerCode:false, //判断验证码长度是否符合要求
      // isShowCode: false, //是否显示获取验证码
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
    /*
			phoneChage() {
				this.$u.debounce(() => {
					// 判断手机号格式是否正确
					if (this.$u.test.mobile(_this.phoneData)) {
					  _this.isPhone = true
					  _this.isShowCode = true
					}else {
						_this.isPhone = false
						_this.isShowCode = false
					}
				}, 200)
			},
			*/

    emailChage() {
      this.$u.debounce(() => {
        // 判断邮箱号格式是否正确
        if (this.$u.test.email(_this.form.email)) {
          _this.isEmail = true
        } else {
          _this.isEmail = false
        }
      }, 200)
    },

    /*
			codeChage() {
				this.$u.debounce(() => {
					// 判断验证码长度是否符合规范
					if (this.verCode.length === 6) {
						_this.isVerCode = true
						_this.showLogin = true
					}else {
						_this.isVerCode = false
						_this.showLogin = false
					}
				}, 200)
			},
			*/

    pwdChage() {
      this.$u.debounce(() => {
        // 判断密码是否符合规范
        if (/^[\w]{6,12}$/.test(_this.form.password)) {
          _this.isPwd = true
        } else {
          _this.isPwd = false
        }
      }, 200)
    },

    showLogin() {
      // 登录按钮是否可选
      if (this.isPwd && this.isEmail) {
        return true
      } else {
        return false
      }
    },

    /*
			getVerCode(){
				//获取验证码
				this.$refs.runCode.$emit('runCode'); //触发倒计时（一般用于请求成功验证码后调用）
				uni.showToast({
				  icon: 'none',
					position: 'bottom',
				  title: '模拟倒计时触发'
				});

				setTimeout(function(){
					_this.$refs.runCode.$emit('runCode',0); //假装模拟下需要 终止倒计时
					uni.showToast({
					  icon: 'none',
						position: 'bottom',
					  title: '模拟倒计时终止'
					});
				},3000)
			},
			*/

    errMessage() {
      // 错误信息
      /*
				if (!_this.isPhone) {
					uni.showToast({
						icon: 'none',
						position: 'bottom',
						title: '手机号不正确'
					});
					return false;
				}
				*/

      if (!_this.isEmail) {
        uni.showToast({
          icon: 'none',
          position: 'bottom',
          title: '邮箱号不正确'
        })
        return false
      }
    },

    startLogin() {
      if (this.isRotate) return false //判断是否加载中，避免重复点击请求

      _this.isRotate = true
      uni.showLoading({
        title: '登录中...'
      })
      this.$store
        .dispatch('user/login', {
          email: _this.form.email,
          password: _this.form.password
        })
        .then(() => {
          _this.isRotate = false
          uni.hideLoading()
          uni.showToast({
            icon: 'success',
            title: '登录成功'
          })
          setTimeout(() => {
            uni.reLaunch({
              url: '/pages/msg/msg'
            })
          }, 1000)
        })
        .catch(() => {
          _this.isRotate = false
          uni.hideLoading()
        })
    }

    /*
			login_weixin() {
				//微信登录
				uni.showToast({
					icon: 'none',
					position: 'bottom',
					title: '...'
				});
			},
			login_weibo() {
				//微博登录
				uni.showToast({
					icon: 'none',
					position: 'bottom',
					title: '...'
				});
			},
			login_github() {
				//github登录
				uni.showToast({
					icon: 'none',
					position: 'bottom',
					title: '...'
				});
			}
			*/
  }
}
</script>

<style>
@import url('../../components/watch-login/css/icon.css');
@import url('./css/main.css');
</style>
