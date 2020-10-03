import $request from '@/helpers/request.js'

/**
 * 查询关注列表
 * @param {number} type  1 我的关注 2 关注我的
 * */
export function queryMyFocus(type) {
	return $request('/focus/queryMyFocus', {
		params: {
			type
		}
	})
}

/**
 * 查询两人关注关系
 * @param {number} id  用户 id
 * */
export function queryFocusSb(id) {
	return $request('/focus/queryFocusSb', {
		params: {
			id
		}
	})
}

/**
 * 关注
 * @param {number} id 用户 id
 */
export function addFocus(data) {
	return $request('/focus/addFocus', {
		method: 'POST',
		data
	})
}

/**
 * 取消关注
 * @param {number} id 用户 id
 */
export function delFocus(data) {
	return $request('/focus/delFocus', {
		method: 'POST',
		data
	})
}
