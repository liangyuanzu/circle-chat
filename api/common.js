import $request from '@/helpers/request.js'

/**
 * 搜索圈和用户
 * @param {string} data - 用户名和圈名
 * */
export function getSearch(data) {
	return $request('/chat/searchUserAndCircle', {
		params: {
			data
		}
	})
}

/**
 * 上传图片
 * @param {string} filePath - 图片地址
 * */
export function uploadImage(filePath) {
	return $request('/down/upload', {
		method: 'UPLOAD',
		filePath
	})
}

/**
 * 上传文件
 * @param {string} filePath - 文件地址
 * @param {string} type - 文件类型 voice 或者 image
 * @param {string} userId - 用户 id
 * */
export function uploadFile({ filePath, type, userId }) {
	return $request('/down/uploadFile', {
		method: 'UPLOAD',
		name: 'file',
		filePath,
		formData: {
			type,
			userId
		}
	})
}
