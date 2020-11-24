import {
	websocketUrl,
	receiveOneType,
	receiveCircleType,
	chatListName
} from '@/config/config.js'
import localStore from '@/helpers/localStore.js'
import {
	chatFormat,
	updateNoReadNum,
	initTabBarBadge,
	formatMsg,
	chatListFormat
} from '@/helpers/chat.js'
import { getOldChatList, getNoReadNum, readMsg } from '@/api/chat.js'

const state = {
	isOpen: false,
	isCircle: false,
	toClose: false, // 是否强制关闭连接
	SocketTask: false,
	lockReconnect: false, //避免重复连接
	reconnectTimer: false,
	clientTimer: false,
	serverTimer: false,
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
		circleAvatar: '',
		circleType: ''
	}
}

const getters = {}

const mutations = {
	setIsOpen(state, isOpen) {
		state.isOpen = isOpen
	},
	setToClose(state, toClose) {
		state.toClose = toClose
	},
	setLockReconnect(state, lockReconnect) {
		state.lockReconnect = lockReconnect
	},
	setReconnectTimer(state, timer) {
		state.reconnectTimer = timer
	},
	setClientTimer(state, timer) {
		state.clientTimer = timer
	},
	setServerTimer(state, timer) {
		state.serverTimer = timer
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
	setCurrentToCircle(
		state,
		{ circleId, circleName, circleAvatar, circleType }
	) {
		state.CurrentToCircle.circleId = circleId
		state.CurrentToCircle.circleName = circleName
		state.CurrentToCircle.circleAvatar = circleAvatar
		state.CurrentToCircle.circleType = circleType
	}
}

const actions = {
	async init({ dispatch }) {
		await dispatch('getOldChatList', 0)
		await dispatch('getNoReadNum')
		await dispatch('createWebSocket')
	},

	createWebSocket({ state: { SocketTask }, commit, dispatch, rootGetters }) {
		if (SocketTask) return
		try {
			const socket = uni.connectSocket({
				url: `${websocketUrl}?user=${rootGetters['user/userId']}`,
				success: () => console.log('连接成功'),
				fail: (e) => {
					console.log('连接失败', e)
					uni.showToast({
						title: e.errMsg,
						icon: 'none'
					})
				}
			})
			commit('setSocketTask', socket)
			dispatch('socketInit')
		} catch (e) {
			console.log('连接异常', e)
			dispatch('reconnect')
		}
	},

	socketInit({ state: { SocketTask, toClose }, commit, dispatch }) {
		// 取消强制关闭连接
		if (toClose) commit('setToClose', false)

		// 监听开启
		SocketTask.onOpen(() => {
			console.log('开启')
			//心跳检测重置
			dispatch('heartCheck')
		})
		// 监听信息
		dispatch('message')
		// 监听关闭
		SocketTask.onClose(() => {
			console.log('关闭')
			commit('setSocketTask', false)
			dispatch('reconnect')
		})
		// 监听错误
		SocketTask.onError((e) => {
			console.log('发生错误', e)
			commit('setSocketTask', false)
			dispatch('reconnect')
		})
	},

	reconnect({
		state: { lockReconnect, toClose, reconnectTimer },
		commit,
		dispatch
	}) {
		if (lockReconnect || toClose) return
		commit('setLockReconnect', true)
		//没连接上会一直重连，设置延迟避免请求过多
		reconnectTimer && clearTimeout(reconnectTimer)
		commit(
			'setReconnectTimer',
			setTimeout(() => {
				dispatch('createWebSocket')
				commit('setLockReconnect', false)
			}, 3000)
		)
	},

	heartCheck({ state: { clientTimer, serverTimer, SocketTask }, commit }) {
		console.log('start')
		clientTimer && clearTimeout(clientTimer)
		serverTimer && clearTimeout(serverTimer)
		commit(
			'setClientTimer',
			setTimeout(() => {
				//这里发送一个心跳，后端收到后，返回一个心跳消息
				console.log('发送心跳')
				SocketTask.send({
					data: JSON.stringify({
						type: 'SEND_HEART_TEST_REQUEST',
						body: {
							message: '心跳检测'
						}
					}),
					success: () => console.log('发送心跳成功'),
					fail: (e) => console.log('发送心跳失败', e)
				})
				// 关闭连接
				commit(
					'setServerTimer',
					setTimeout(() => {
						console.log('服务器超时, 关闭连接')
						if (SocketTask) {
							SocketTask.close()
							commit('setSocketTask', false)
						}
					}, 3000)
				)
			}, 3000)
		)
	},

	// 强制关闭连接
	close({ state: { SocketTask }, commit }) {
		if (SocketTask) {
			SocketTask.close()
			commit('setToClose', true)
			commit('setSocketTask', false)
		}
	},

	message({ dispatch, state: { SocketTask, CurrentToUser, CurrentToCircle } }) {
		SocketTask.onMessage((e) => {
			// 当前连接正常, 发送心跳检测
			dispatch('heartCheck')

			const res = JSON.parse(e.data)
			// 获取总未读数,并且渲染到tabBar的badge
			initTabBarBadge()
			// 获取未读信息
			dispatch('getChatMessages')

			// 私聊
			if (res.type === receiveOneType) {
				// 全局通知接口
				uni.$emit('UserChat', res)
				// 更新chatList（将当前会话置顶，修改chatList中当前会话的data和time显示）
				dispatch('updateChatList', { res })
				// 存储到 chatDetail
				dispatch('updateChatDetail', { res })
				// 总未读数+1，修改tabBar信息数
				if (CurrentToUser.userId !== res.body.userId) {
					updateNoReadNum({ type: 'add' })
				}
			} else if (res.type === receiveCircleType) {
				uni.$emit('UserChat', res)
				dispatch('updateChatList', { res, isCircle: true })
				dispatch('updateChatDetail', { res, isCircle: true })
				if (CurrentToCircle.circleId !== res.body.circleId) {
					updateNoReadNum({ type: 'add' })
				}
			}
		})
	},

	// 发送消息
	send({ dispatch, rootGetters, state: { SocketTask, isCircle } }, res) {
		// 发送的格式
		let data
		if (isCircle) {
			data = {
				circleId: state.CurrentToCircle.circleId,
				circleName: state.CurrentToCircle.circleName,
				circleAvatar: state.CurrentToCircle.circleAvatar,
				circleType: state.CurrentToCircle.circleType,
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
			SocketTask.send({
				data: JSON.stringify(sendData),
				fail: (e) => console.log('发送失败', e)
			})
			// 存储到chatDetail
			dispatch('updateChatDetail', { res: sendData, isSend: true, isCircle })
			// 存储到chatList（将当前会话置顶，修改chatList中当前会话的data和time显示）
			dispatch('updateChatList', { res: sendData, isSend: true, isCircle })
		} catch (error) {
			uni.showToast({
				title: '发送失败',
				icon: 'none'
			})
			console.log(error)
		}
	},

	getChatMessages() {},

	updateChatDetail(
		{ rootGetters, state },
		{ res, isSend = false, isCircle = false }
	) {
		let chatDetail = []
		let circleId, userId
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
		let list = []
		if (chatDetail.length > 0) list = chatDetail

		// 追加
		list?.push(
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

	updateChatList(
		{ rootGetters, state },
		{ res, isSend = false, isCircle = false }
	) {
		// 获取旧数据
		let chatList = localStore.get(chatListName) || []
		if (isSend) {
			// 发送圈聊消息
			if (isCircle) {
				const { circleId, userId, content, createTime } = res.body
				// 判断是否已存在该会话，存在：将当前会话置顶；不存在：追加至头部
				const index = chatList?.findIndex((item) => item?.circleId == circleId)
				// 不存在
				if (index === -1) {
					const user = {
						userId
					}
					let obj = chatFormat(res, { type: 'chatList', isCircle }, user)
					chatList.unshift(obj)
				} else {
					// 存在：将当前会话置顶,修改chatList中当前会话的data和time显示
					let item = chatList[index]
					item.data = formatMsg(res.body.type, {
						content,
						isCircle,
						isMe: true
					})
					item.time = createTime

					// 删除数组中这个元素
					chatList.splice(index, 1)
					// 置顶
					chatList.unshift(item)
				}
			} else {
				// 发送私聊消息
				const { userId, toUser, content, createTime } = res.body
				// 判断是否已存在该会话，存在：将当前会话置顶；不存在：追加至头部
				const index = chatList?.findIndex((item) => item.userId == toUser)
				// 不存在
				if (index === -1) {
					const user = {
						userId,
						toUser,
						toUserName: state.CurrentToUser.username,
						toUserAvatar: state.CurrentToUser.avatar
					}
					let obj = chatFormat(res, { type: 'chatList' }, user)
					chatList.unshift(obj)
				} else {
					// 存在：将当前会话置顶,修改chatList中当前会话的data和time显示
					let item = chatList[index]
					item.data = formatMsg(res.body.type, { content })
					item.time = createTime

					// 删除数组中这个元素
					chatList.splice(index, 1)
					// 置顶
					chatList.unshift(item)
				}
			}
		} else {
			// 接收圈聊消息
			if (isCircle) {
				const { circleId, userId, username, content, createTime } = res.body
				// 判断是否已存在该会话，存在：将当前会话置顶；不存在：追加至头部
				const index = chatList?.findIndex((item) => item?.circleId == circleId)
				// 不存在
				if (index === -1) {
					const user = {
						userId: rootGetters['user/userId']
					}
					let obj = chatFormat(res, { type: 'chatList', isCircle }, user)
					// 未读数加 1
					obj.noReadNum = 1
					chatList.unshift(obj)
				} else {
					// 存在：将当前会话置顶,修改chatList中当前会话的data和time显示
					let item = chatList[index]
					item.data = formatMsg(res.body.type, {
						username,
						content,
						isCircle
					})
					item.time = createTime
					// 当前聊天对象不是该id，未读数+1（排除本人发送消息）
					if (
						userId !== rootGetters['user/userId'] &&
						state.CurrentToCircle.circleId !== item.circleId
					) {
						// 未读数加 1
						item.noReadNum++
					}

					// 删除数组中这个元素
					chatList.splice(index, 1)
					// 置顶
					chatList.unshift(item)
				}
			} else {
				// 接收私聊消息
				const { userId, content, createTime } = res.body
				// 判断是否已存在该会话，存在：将当前会话置顶；不存在：追加至头部
				const index = chatList?.findIndex((item) => item.userId == userId)
				// 不存在
				if (index === -1) {
					const user = {
						userId: rootGetters['user/userId']
					}
					let obj = chatFormat(res, { type: 'chatList' }, user)
					// 未读数加 1
					obj.noReadNum = 1
					chatList.unshift(obj)
				} else {
					// 存在：将当前会话置顶,修改chatList中当前会话的data和time显示
					let item = chatList[index]
					item.data = formatMsg(res.body.type, { content })
					item.time = createTime
					// 当前聊天对象不是该id，未读数+1（排除本人发送消息）
					if (
						userId !== rootGetters['user/userId'] &&
						state.CurrentToUser.userId !== item.userId
					) {
						// 未读数加 1
						item.noReadNum++
					}

					// 删除数组中这个元素
					chatList.splice(index, 1)
					// 置顶
					chatList.unshift(item)
				}
			}
		}

		// 存储到本地
		localStore.set(chatListName, chatList)
	},

	// 获取历史聊天列表
	async getOldChatList({}, type) {
		const list = await getOldChatList(type)
		const chatList = chatListFormat(list)
		localStore.set(chatListName, chatList)
	},

	async getNoReadNum({}) {
		const noReadNum = await getNoReadNum()
		if (noReadNum > 0) {
			uni.setTabBarBadge({
				index: 0,
				text: noReadNum > 99 ? '99+' : noReadNum.toString()
			})
		}
		localStore.set('noReadNum', noReadNum)
	},

	async readMsg({}, data) {
		await readMsg(data)
	}
}

export default {
	state,
	getters,
	mutations,
	actions
}
