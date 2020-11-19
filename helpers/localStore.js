/** @format */
// #ifndef MP-BAIDU
import { Encrypt, Decrypt } from './utils'
// #endif

export default {
	get: (key) => {
		const value = uni.getStorageSync(key)
		// #ifdef MP-BAIDU
		return value
		// #endif

		return Decrypt(value)
	},
	set: (key, value) => {
		// #ifdef MP-BAIDU
		uni.setStorageSync(key, value)
		// #endif

		// #ifndef MP-BAIDU
		const val = Encrypt(value)
		uni.setStorageSync(key, val)
		// #endif
	},
	del: (key) => uni.removeStorageSync(key),
	delAll: () => uni.clearStorageSync()
}
