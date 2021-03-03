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

export function getUserInfo() {
	return $request('/user/getUserIdFromToken', {})
}

/**
 * 退出登录
 * */
export function logout() {
	return $request('/user/logout', {
		method: 'POST'
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
 * 忘记密码
 * @param {string} oldPassword - 旧密码
 * @param {string} password - 密码
 * @param {string} rePassword - 确认密码
 * */
export function forgetPassword(data) {
	return $request('/user/forgetPassword', {
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
		name: 'file',
		filePath
	})
}

/**
 *
 * @param {string} username - 用户名
 * @param {string} sex - 性别
 * @param {string} birthday - 生日
 * @param {string} autograph - 个性签名
 */
export function updateMessage(data) {
	return $request('/user/updateMessage', {
		method: 'POST',
		data
	})
}

/**
 * 获取用户信息
 * @param {string} id - 用户 id
 * */
export function queryUserMsg(id) {
	return $request('/user/queryUserMsg', {
		params: {
			id
		}
	})
}

/**
 * 默认加圈，消息通知
 * @param {string} defaultAdd -默认加圈
 * @param {string} isNotice - 消息通知
 */
export function userSet(data) {
	return $request('/user/userSet', {
		method: 'POST',
		data
	})
}

/**
 * 百度登录
 * @param {string} code - 授权标识
 * */
export function login_baidu(data) {
	return $request('/baidu/login', {
		method: 'POST',
		data
	})
}

/**
 * 百度授权获取用户信息
 * @param {string} data 开放数据密文
 * @param {string} iv 加密向量
 * */
export function getUserInfo_baidu(data) {
	return $request('/baidu/getUserMsg', {
		method: 'POST',
		data
	})
}

/**
 * 退出登录
 * */
export function logout_baidu() {
	return $request('/baidu/logout', {
		method: 'POST'
	})
}

/**
 * 更新用户位置信息
 * @param {string} position 用户位置
 * */
export function updatePosition(data) {
	return $request('/user/updatePosition', {
		method: 'POST',
		data
	})
}

/**
 * 获取用户设置信息
 * */
export function getUserSetting() {
	return $request('/user/getUserSet', {})
}

/**
 * 签到
 * */
export function signIn() {
	return $request('/user/sign', {
		method: 'POST'
	})
}
