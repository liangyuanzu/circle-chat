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
