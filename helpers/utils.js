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
		return data
	}
	return CryptoJS.AES.encrypt(key, 'circle-chat').toString()
}

/**
 * 解密
 * @return {string}
 */
export function Decrypt(data) {
	if (!data || !_.isString(data)) {
		return data
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
 * 深拷贝
 * @return {object}
 */
export function cloneLoop(x) {
	const root = {}

	// 栈
	const loopList = [
		{
			parent: root,
			key: undefined,
			data: x
		}
	]

	while (loopList.length) {
		// 深度优先
		const node = loopList.pop()
		const parent = node.parent
		const key = node.key
		const data = node.data

		// 初始化赋值目标，key为undefined则拷贝到父元素，否则拷贝到子元素
		let res = parent
		if (typeof key !== 'undefined') {
			res = parent[key] = {}
		}

		for (let k in data) {
			if (data.hasOwnProperty(k)) {
				if (typeof data[k] === 'object') {
					// 下一次循环
					loopList.push({
						parent: res,
						key: k,
						data: data[k]
					})
				} else {
					res[k] = data[k]
				}
			}
		}
	}

	return root
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

/**
 * 格式化圈范围
 * @param {number, string} radius 半径
 */
export function formatRadius(radius) {
	radius = Number(radius)
	if (radius > 0 && radius < 1000) {
		return radius + ' m'
	} else if ((radius / 1000) % 1 > 0) {
		return (radius / 1000).toFixed(2) + ' km'
	} else {
		return parseInt(radius / 1000) + ' km'
	}
}

/**
 * 格式化圈类型
 * @param {string} type 圈类型
 */
export function formatType(type) {
	if (type === '交友圈') return 'primary'
	if (type === '固定圈') return 'warning'
	if (type === '紧急圈') return 'error'
}
