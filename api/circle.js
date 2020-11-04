import $request from '@/helpers/request.js'

/**
 *
 * @param {number} type 圈类型
 */
export function nearlyCircle(type) {
	return $request('/circle/nearlyCircle', {
		params: {
			type
		}
	})
}

/**
 * 创建圈
 * @param {string} name - 圈名称
 * @param {string} position - 圈中心位置
 * @param {string} radius - 圈半径
 * @param {string} type - 圈类型
 * @param {number} effective - 圈的有效时间 单位天
 * @param {string} synopsis - 圈简介 可空
 * @param {string} explain - 圈的入圈说明 可空
 * @param {string} notice - 圈公告 可空
 * */
export function creatCircle(data) {
	return $request('/circle/creatCircle', {
		method: 'POST',
		data
	})
}

/**
 * 更换圈头像
 * @param {string} circleId - 圈 id
 * @param {string} img - 图片地址
 * */
export function updateCirclePhoto(data) {
	return $request('/circle/updateCirclePhoto', {
		method: 'UPLOAD',
		data
	})
}

/**
 * 加入圈
 * @param {*} circleId - 圈id
 */
export function joinCircle(data) {
	return $request('/circle/enterCircle', {
		method: 'POST',
		data
	})
}

/**
 * 查询我已加入的圈
 */
export function getMyJoinCircle() {
	return $request('/circle/queryMyCircle', {})
}

/**
 * 根据圈id查询圈信息
 * @param {number} circleId 圈id
 */
export function getCircleInfo(circleId) {
	return $request('/circle/queryByCircleId', {
		params: {
			circleId
		}
	})
}

/**
 * 查询所有已进入圈的用户
 * @param {number} circleId 圈id
 */
export function getCircleMember(circleId) {
	return $request('/circle/queryAllInCircle', {
		params: {
			circleId
		}
	})
}

/**
 * 更换圈头像
 * @param {string} filePath - 图片地址
 * @param {string | Number} circleId - 圈id
 * */
export function updateCircleAvatar(data) {
	return $request('/circle/updateCirclePhoto', {
		method: 'UPLOAD',
		filePath: data.filePath,
		formData: {
			circleId: data.circleId
		}
	})
}

/**
 * 修改圈的信息
 * @param {string, Number} circleId - 圈id
 * @param {string} name - 圈名称
 * @param {string} synopsis - 圈简介
 * @param {string} notice - 圈公告
 * @param {string} explain - 入圈声明
 * */
export function updateCircleInfo(data) {
	return $request('/circle/updateCircleMsg', {
		method: 'POST',
		data
	})
}
