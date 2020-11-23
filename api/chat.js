import $request from '@/helpers/request.js'

/**
 * 获取历史聊天列表
 * @param {string} type -  0: 全部 1：交友圈 2：固定圈 3：紧急圈 4：我创建的圈 5:私聊
 * */
export function getOldChatList(type) {
	return $request('/chat/getChatList', {
		params: {
			type
		}
	})
}

/**
 * 获取所有未读消息数
 * */
export function getNoReadNum() {
	return $request('/chat/getNoReadNum', {})
}

/**
 * 获取历史消息-私聊
 * @param {string} toUserId - 对方 id
 * @param {string} offset - 当前页
 * @param {string} limit - 每页多少行
 * */
export function getOldChatDetailPrivate({ toUserId, offset }) {
	return $request('/chat/queryPrivateChatByPage', {
		params: {
			toUserId,
			offset,
			limit: 20
		}
	})
}

/**
 * 获取历史消息-圈聊
 * @param {string} circleId - 圈 id
 * @param {string} offset - 当前页
 * @param {string} limit - 每页多少行
 * */
export function getOldChatDetailCircle({ circleId, offset }) {
	return $request('/chat/queryCircleChatByPage', {
		params: {
			circleId,
			offset,
			limit: 20
		}
	})
}

/**
 * 读取消息
 * @param {number} toUserId 对方 id
 * @param {number} circleId 圈 id
 */
export function readMsg(data) {
	return $request('/chat/readMsg', {
		method: 'POST',
		data
	})
}
