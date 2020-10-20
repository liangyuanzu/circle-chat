import {
	websocketUrl,
	receiveOneType,
	receiveCircleType,
	chatListName
} from '@/config/config.js'
import localStore from '@/helpers/localStore.js'
import { toFirst } from '@/helpers/utils.js'
import { chatFormat, updateNoReadNum, initTabBarBadge } from '@/helpers/chat.js'

const state = {
	isOpen: false,
	isCircle: false,
	SocketTask: false,
	// 当前聊天对象
	CurrentToUser: {
		userId: 0,
		username: '',
		avatar: ''
	},
	// 当前聊天圈
	CurrentToCircle: {
		circleId: 0,
		circleName: '',
		circleAvatar: ''
	}
}

const getters = {}

const mutations = {
	setIsOpen(state, isOpen) {
		state.isOpen = isOpen
	},
	setIsCircle(state, isCircle) {
		state.isCircle = isCircle
	},
	setSocketTask(state, SocketTask) {
		state.SocketTask = SocketTask
	},
	setCurrentToUser(state, { userId, username, avatar }) {
		state.CurrentToUser.userId = userId
		state.CurrentToUser.username = username
		state.CurrentToUser.avatar = avatar
	},
	setCurrentToCircle(state, { circleId, circleName, circleAvatar }) {
		state.CurrentToCircle.circleId = circleId
		state.CurrentToCircle.circleName = circleName
		state.CurrentToCircle.circleAvatar = circleAvatar
	}
}

const actions = {
	open({ commit, dispatch, state, rootGetters }) {
		if (state.isOpen || !rootGetters['user/userId']) return
		const socket = uni.connectSocket({
			url: `${websocketUrl}?user=${rootGetters['user/userId']}`,
			complete: () => {}
		})
		commit('setSocketTask', socket)
		const { SocketTask } = state
		if (!SocketTask) return

		// 监听开启
		SocketTask.onOpen(() => {
			console.log('开启')
			commit('setIsOpen', true)
		})
		// 监听信息
		dispatch('message')
		// 监听关闭
		SocketTask.onClose(() => {
			console.log('关闭')
			commit('setIsOpen', false)
			commit('setSocketTask', false)
		})
		// 监听错误
		SocketTask.onError((e) => {
			console.log(e)
			commit('setIsOpen', false)
			commit('setSocketTask', false)
		})
	},

	// 关闭连接
	close({ state }) {
		if (state.isOpen) {
			state.SocketTask.close()
		}
	},

	message({ dispatch, state: { SocketTask, CurrentToUser, CurrentToCircle } }) {
		SocketTask.onMessage((e) => {
			const res = JSON.parse(e.data)
			// 获取总未读数,并且渲染到tabBar的badge
			initTabBarBadge()
			// 获取未读信息
			dispatch('getChatMessages')

			// 私聊
			if (res.type === receiveOneType) {
				// 全局通知接口
				uni.$emit('UserChat', res)
				// 存储到 chatDetail
				dispatch('updateChatDetail', { res })
				// 更新chatList（将当前会话置顶，修改chatList中当前会话的data和time显示）
				dispatch('updateChatList', { res })
				// 总未读数+1，修改tabBar信息数
				if (CurrentToUser.userId !== res.body.userId) {
					updateNoReadNum({ type: 'add' })
				}
			} else if (res.type === receiveCircleType) {
				uni.$emit('UserChat', res)
				dispatch('updateChatDetail', { res, isCircle: true })
				dispatch('updateChatList', { res, isCircle: true })
				if (CurrentToCircle.circleId !== res.body.circleId) {
					updateNoReadNum({ type: 'add' })
				}
			}
		})
	},

	// 发送消息
	async send({ dispatch, rootGetters, state: { SocketTask, isCircle } }, res) {
		// 发送的格式
		let data
		if (isCircle) {
			data = {
				circleId: state.CurrentToCircle.circleId,
				circleName: state.CurrentToCircle.circleName,
				circleAvatar: state.CurrentToCircle.circleAvatar,
				userId: rootGetters['user/userId'],
				avatar: rootGetters['user/avatar']
			}
		} else {
			data = {
				userId: rootGetters['user/userId'],
				username: rootGetters['user/username'],
				avatar: rootGetters['user/avatar'],
				toUser: state.CurrentToUser.userId
			}
		}
		const sendData = chatFormat(res, { type: 'send', isCircle }, data)
		try {
			// 发送到服务器
			await SocketTask.send({
				data: JSON.stringify(sendData),
				fail: (res) => console.log('发送失败')
			})
			// 存储到chatDetail
			dispatch('updateChatDetail', { res: sendData, isSend: true, isCircle })
			// 存储到chatList（将当前会话置顶，修改chatList中当前会话的data和time显示）
			dispatch('updateChatList', { res: sendData, isCircle })
		} catch (error) {
			console.log(error)
		}
	},

	getChatMessages() {},

	updateChatDetail(
		{ rootGetters, state },
		{ res, isSend = false, isCircle = false }
	) {
		let chatDetail, circleId, userId
		if (isCircle) {
			circleId = isSend ? state.CurrentToCircle.circleId : res.body.circleId
			// 获取旧数据（ chatDetail_[当前用户id]_[聊天对象id] ）
			chatDetail = localStore.get(
				'chatDetail_' + rootGetters['user/userId'] + '_' + circleId
			)
		} else {
			userId = isSend ? state.CurrentToUser.userId : res.body.userId
			chatDetail = localStore.get(
				'chatDetail_' + rootGetters['user/userId'] + '_' + userId
			)
		}
		let list = chatDetail || []

		// 追加
		list.push(
			chatFormat(res, {
				type: 'chatDetail',
				oldData: list,
				isCircle
			})
		)
		// 存储
		if (isCircle) {
			localStore.set(
				'chatDetail_' + rootGetters['user/userId'] + '_' + circleId,
				list
			)
		} else {
			localStore.set(
				'chatDetail_' + rootGetters['user/userId'] + '_' + userId,
				list
			)
		}
	},

	updateChatList({ rootGetters, state }, { res, isCircle = false }) {
		// 获取旧数据
		let chatList = localStore.get(chatListName) || []
		// 判断是否为群聊
		if (isCircle) {
			const { circleId, userId, username, content, createTime } = res.body
			// 判断是否已存在该会话，存在：将当前会话置顶；不存在：追加至头部
			const index = chatList?.findIndex((item) => item?.circleId == circleId)
			// 不存在
			if (index == -1) {
				const user = {
					userId: rootGetters['user/userId']
				}
				let obj = chatFormat(res, { type: 'chatList', isCircle }, user)
				// 忽略本人发送
				if (userId !== rootGetters['user/userId']) {
					obj.noReadNum = 1
				}
				chatList.unshift(obj)
			} else {
				// 存在：将当前会话置顶,修改chatList中当前会话的data和time显示
				if (userId == rootGetters['user/userId']) {
					chatList[index].data = content
				} else {
					chatList[index].data = `${username}：${content}`
				}
				chatList[index].time = createTime

				// 当前聊天对象不是该id，未读数+1（排除本人发送消息）
				if (
					userId !== rootGetters['user/userId'] &&
					state.CurrentToCircle.circleId !== chatList[index].circleId
				) {
					chatList[index].noReadNum++
				}
				// 置顶当前会话
				chatList = toFirst(chatList, index)
			}
		} else {
			const { userId, toUserId, toUser, content, createTime } = res.body
			// 判断是否已存在该会话，存在：将当前会话置顶；不存在：追加至头部
			const index = chatList?.findIndex(
				(item) =>
					item.userId == userId ||
					item.userId == toUserId ||
					item.userId == toUser
			)
			// 不存在
			if (index == -1) {
				const user = {
					userId: rootGetters['user/userId'],
					toUser: state.CurrentToUser.userId,
					toUserName: state.CurrentToUser.username,
					toUserAvatar: state.CurrentToUser.avatar
				}
				let obj = chatFormat(res, { type: 'chatList' }, user)
				// 忽略本人发送
				if (userId !== rootGetters['user/userId']) {
					obj.noReadNum = 1
				}
				chatList.unshift(obj)
			} else {
				// 存在：将当前会话置顶,修改chatList中当前会话的data和time显示
				chatList[index].data = content
				chatList[index].time = createTime
				// 当前聊天对象不是该id，未读数+1（排除本人发送消息）
				if (
					userId !== rootGetters['user/userId'] &&
					state.CurrentToUser.userId !== chatList[index].userId
				) {
					chatList[index].noReadNum++
				}
				// 置顶当前会话
				chatList = toFirst(chatList, index)
			}
		}

		// 存储到本地
		localStore.set(chatListName, chatList)
	}
}

export default {
	state,
	getters,
	mutations,
	actions
}
