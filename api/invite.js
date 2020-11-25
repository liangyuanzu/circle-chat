import $request from '@/helpers/request.js'

/**
 * 邀请用户加入圈
 * @param {string, Number} circleId - 圈id
 * @param {Array} uids - 用户id数组
 * */
export function inviteUsers(data) {
	return $request('/invite/invitePartOfUser', {
		method: 'POST',
		data
	})
}

/**
 * 邀请通知列表
 */
export function getInviteList() {
	return $request('/invite/queryMyInvitation', {})
}

/**
 * 同意或拒绝加圈
 * @param {string, Number} circleId - 圈id
 * @param {Boolean} flag true 为同意，false为不同意
 * */
export function agreeInvite(data) {
	return $request('/invite/agreeEnterCircle', {
		method: 'POST',
		data
	})
}

/**
 * 删除邀请通知
 * @param {Array} tids 圈 ids
 * */
export function delInvite(data) {
	return $request('/invite/delInvitation', {
		method: 'POST',
		data
	})
}
