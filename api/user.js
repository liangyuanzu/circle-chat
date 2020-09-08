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
