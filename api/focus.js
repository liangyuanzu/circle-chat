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
