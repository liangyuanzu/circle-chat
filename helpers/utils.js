/** @format */
// #ifndef MP-BAIDU
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
// #endif

/**
 * 对象转字符串
 * @return {string}
 */
export function obj2string(data) {
	let key
	if (typeof data === 'string' || typeof data === 'number') {
		key = data
	} else if (typeof data === 'object') {
		key = JSON.stringify(data)
	} else {
		return ''
	}
	return key
}

/**
 * 字符串转对象
 * @return {string}
 */
export function string2obj(data) {
	if (!data) {
		return ''
	}
	let value
	try {
		value = JSON.parse(data)
	} catch (e) {
		value = data
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

/**
 *
 * @param {*} b64data base64 图片
 */
export function base64ToBlob(b64data) {
	let byteString = atob(b64data.split(',')[1])
	let mimeString = b64data.split(',')[0].split(':')[1].split(';')[0]
	let ab = new ArrayBuffer(byteString.length)
	let ia = new Uint8Array(ab)
	for (let i = 0; i < byteString.length; i++) {
		ia[i] = byteString.charCodeAt(i)
	}
	return new Blob([ab], { type: mimeString })
}
