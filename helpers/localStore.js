/** @format */

import { Encrypt, Decrypt } from './utils'

export default {
	get: (key) => {
		const value = uni.getStorageSync(key)
		return Decrypt(value)
	},
	set: (key, value) => {
		const val = Encrypt(value)
		uni.setStorageSync(key, val)
	},
	del: (key) => uni.removeStorageSync(key),
	delAll: () => uni.clearStorageSync()
}
