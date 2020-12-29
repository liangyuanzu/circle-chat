import $request from '@/helpers/request.js'

/**
 * 附近的圈
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
 * 附近的圈-分页
 * @param {number} type 圈类型
 * @param {number} offset 当前页
 */
export function nearlyCircleByPage({ type, offset }) {
	return $request('/circle/nearlyCircleByPage', {
		params: {
			type,
			offset,
			limit: 10
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
 * 查询我创建的圈
 */
export function getMyCreateCircle() {
	return $request('/circle/getMyCircle', {})
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
export function updateCircleAvatar({ filePath, circleId }) {
	return $request('/circle/updateCirclePhoto', {
		method: 'UPLOAD',
		name: 'file',
		filePath,
		formData: {
			circleId
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

/**
 * 增加圈额存在时长
 * @param {string, Number} circleId - 圈id
 * @param {Number} effective - 增加天数
 * */
export function addCircleEffective(data) {
	return $request('/circle/addCircleEffective', {
		method: 'POST',
		data
	})
}

/**
 * 退出圈
 * @param {string, Number} circleId - 圈id
 * */
export function exitCircle(data) {
	return $request('/circle/exitCircle', {
		method: 'POST',
		data
	})
}

/**
 * 索引列表
 * @param {number} circleId 圈id
 */
export function getIndexList(circleId) {
	return $request('/circle/getUserInCircleBySort', {
		params: {
			circleId
		}
	})
}

/**
 * 获取圈内用户(地理位置)
 * @param {number} circleId 圈id
 */
export function getUsersInCircle({ circleId, offset }) {
	return $request('/circle/queryUserInCircle', {
		params: {
			circleId,
			offset,
			limit: 15
		}
	})
}

/**
 * 设置紧急圈的丢失的人或物的信息
 * @param {string, Number} circleId - 圈id
 * @param {string} type - 人或物品 person | item
 * @param {string} name - 名字或物品类别
 * @param {string} size - 年龄大小或物品尺寸
 * @param {string} form - 穿着打扮或物品形状
 * @param {string} properties - 性格特征或物品特征
 * @param {string} supply - 补充说明
 * @param {string} picture - 人或物的照片
 * @param {string} createTime - 丢失时间
 * */
export function urgentMsg(data) {
	return $request('/circle/urgentMsg', {
		method: 'POST',
		data
	})
}

/**
 * 获取紧急圈的 丢失的人或物的 信息
 * @param {string, number} circleId 圈id
 */
export function getUrgent(circleId) {
	return $request('/circle/getUrgentCircleMsg', {
		params: {
			circleId
		}
	})
}
