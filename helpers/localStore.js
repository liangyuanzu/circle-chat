/** @format */
// #ifndef MP-BAIDU
import { Encrypt, Decrypt } from './utils'
// #endif
// #ifdef MP-BAIDU
import { obj2string, string2obj } from './utils'
// #endif

export default {
	get: (key) => {
		const value = uni.getStorageSync(key)
		// #ifdef MP-BAIDU
		return string2obj(value)
		// return value
		// #endif

		return Decrypt(value)
	},
	set: (key, value) => {
		// #ifdef MP-BAIDU
		const val = obj2string(value)
		uni.setStorageSync(key, val)
		// uni.setStorageSync(key, value)
		// #endif

		// #ifndef MP-BAIDU
		const val = Encrypt(value)
		uni.setStorageSync(key, val)
		// #endif
	},
	del: (key) => uni.removeStorageSync(key),
	delAll: () => uni.clearStorageSync()
}
