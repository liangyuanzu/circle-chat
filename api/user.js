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
 * 退出登录
 * @param {string} email - 邮箱号
 * */
export function logout(email) {
	return $request('/user/logout', {
		params: {
			email
		}
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

/**
 * 发送邮箱验证码(忘记密码)
 * @param {string} email - 邮箱号
 * */
export function sendForgetPasswordEmail(email) {
	return $request('/user/sendForgetPasswordEmail', {
		params: {
			email
		}
	})
}

/**
 * 修改密码
 * @param {string} oldPassword - 旧密码
 * @param {string} password - 密码
 * @param {string} rePassword - 确认密码
 * */
export function updatePassword(data) {
	return $request('/user/updatePassword', {
		method: 'POST',
		data
	})
}

/**
 * 更换用户头像
 * @param {string} img - 图片地址
 * */
export function updatePhoto(filePath) {
	return $request('/user/updatePhoto', {
		method: 'UPLOAD',
		filePath
	})
}

/**
 * 获取用户信息
 * @param {string} userId - 用户 id
 * */
export function queryUserMsg(userId) {
	return $request('/user/queryUserMsg', {
		params: {
			userId
		}
	})
}
