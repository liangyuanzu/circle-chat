import $request from '@/helpers/request.js'

/**
 * 登录
 * @param {string} email - 邮箱号
 * @param {string} password - 密码
 * */
export function login(data) {
	return $request('/user/login', {
		method: 'POST',
		data
	})
}

/**
 * 发送邮箱验证码(注册)
 * @param {string} email - 邮箱号
 * */
export function sendRegisterEmail(email) {
	return $request('/user/sendRegisterEmail', {
		params: {
			email
		}
	})
}

/**
 * 注册
 * @param {string} username - 用户名
 * @param {string} password - 密码
 * @param {string} rePassword - 确认密码
 * @param {string} email - 邮箱号
 * @param {string} code - 邮箱验证码
 * */
export function register(data) {
	return $request('/user/register', {
		method: 'POST',
		data
	})
}
