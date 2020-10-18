/** @format */

import * as CryptoJS from '@/utils/crypto-js/crypto-js.js'
import * as _ from '@/utils/lodash/lodash.js'

/**
 * 加密
 * @return {string}
 */
export function Encrypt(data) {
	let key
	if (_.isString(data)) {
		key = data
	} else if (_.isObject(data)) {
		key = JSON.stringify(data)
	} else {
		return ''
	}
	return CryptoJS.AES.encrypt(key, 'circle-chat').toString()
}

/**
 * 解密
 * @return {string}
 */
export function Decrypt(data) {
	if (!data || !_.isString(data)) {
		return ''
	}
	const bytes = CryptoJS.AES.decrypt(data, 'circle-chat')
	const decryptedData = bytes.toString(CryptoJS.enc.Utf8)
	let value
	try {
		value = JSON.parse(decryptedData)
	} catch (e) {
		value = decryptedData
	}

	return value
}

/**
 * 将数组中某个元素置顶
 * @param {Array} arr
 * @param {Number | String} index
 * @return {Array}
 */
export function toFirst(arr, index) {
	if (index != 0) {
		arr.unshift(arr?.splice(index, 1)[0])
	}
	return arr
}

/**
 * 提取 html 字符串的的内容
 * @param {string} str
 */
export function html2text(str) {
	/*
	const oDiv = document.createElement('div')
	oDiv.innerHTML = str
	return oDiv.innerText
	*/
	return str.replace(/<[^<>]+>/g, '')
}

/**
 * 转义 html 代码
 * @param {string} str
 */
export function html2Escape(str) {
	return str.replace(/[<>&"]/g, (c) => {
		return { '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;' }[c]
	})
}
