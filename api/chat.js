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
