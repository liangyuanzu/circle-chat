import { tokenName } from '../config/config'

/**
 * @description 获取 token
 */
export function getToken() {
	let token = ''
	try {
		token = uni.getStorageSync(tokenName)
	} catch (e) {
		console.log(e)
	}
	return token
}

/**
 * @description 存储 token
 * @param {string} token -token的值
 */
export function setToken(token) {
	try {
		uni.setStorageSync(tokenName, token)
	} catch (e) {
		console.log(e)
	}
}

/**
 * @description 移除 token
 */
export function removeToken() {
	try {
		uni.removeStorageSync(tokenName)
	} catch (e) {
		console.log(e)
	}
}
