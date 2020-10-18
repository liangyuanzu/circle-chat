import {
	websocketUrl,
	sendType,
	receiveType,
	chatListName
} from '@/config/config.js'
import localStore from '@/helpers/localStore.js'
import { toFirst } from '@/helpers/utils.js'
import { chatFormat, updateNoReadNum, initTabBarBadge } from '@/helpers/chat.js'

/**
接收信息
{
	"type":"SEND_TO_USER_REQUEST",
	"body":{
		"content":"我是一条单聊消息",
		"createTime":1602239488254,
		"toUser":"LiRyan s",
		"toUserId":10,
		"userId":9,
		"username":"LiRyan"
	}
}

发送信息
{
	type: "SEND_TO_ONE_REQUEST",
	body: {
		userId: 9,
		toUser: 10,
		content: "我是一条单聊消息"
	}
}
 */

/**
 * 原理：
 *
 * 接收信息（假如当前消息的 from_id = 12，当前用户id=17）
 * 场景一：与当前用户12处于聊天界面
 * 		  (1) 渲染到页面
 * 		  (2) 存储到本地存储
 * 			  a. chatDetail_17_12
 * 			  b. chatList17（将当前会话置顶，修改chatList中当前会话的data和time显示）
 *
 * 场景二：与当前用户12不处于聊天界面
 *		  (1) 渲染到页面（处于paper页，留个接口）
 * 		  (2) 存储到本地存储
 * 			  a. chatDetail_17_12
 * 			  b. chatList17
 * 			（将当前会话置顶，修改chatList中当前会话的data和time显示 和 当前会话未读数+1）
 * 			  c. 总未读数+1（显示在tabBar上）

 *
 * 发送消息
 * 		(1) 写入存储
 * 			chatDetail_17_12
 * 			chatList17（将当前会话置顶，修改chatList中当前会话的data和time显示）
 * 		(2) 请求ajax发送消息
 * 		(3) 渲染到页面（user-chat页面实现）
 *
 * 读取消息
 * 		(1) 写入存储
 * 			chatList17：获取将当前会话的未读数设为0，减少总未读数，渲染tabBar
 *
 * */

const state = {
	isOpen: false,
	SocketTask: false,
	// 当前聊天对象（进入聊天页面获取）
	CurrentToUser: {
		userId: 0, // 通过判断userId是否为0，当前用户处在什么场景下
		username: '',
		avatar: ''
	}
}

const getters = {}

const mutations = {
	setIsOpen(state, isOpen) {
		state.isOpen = isOpen
	},
	setSocketTask(state, SocketTask) {
		state.SocketTask = SocketTask
	},
	setCurrentToUser(state, { userId, username, avatar }) {
		state.CurrentToUser.userId = userId
		state.CurrentToUser.username = username
		state.CurrentToUser.avatar = avatar
	}
}

const actions = {
	open({ commit, dispatch, state, rootGetters }) {
		if (state.isOpen || !rootGetters['user/userId']) return
		const socket = uni.connectSocket({
			url: `${websocketUrl}?user=${rootGetters['user/userId']}`,
			complete: () => {}
		})
		console.log(socket)
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

	message({ dispatch, state: { SocketTask, CurrentToUser } }) {
		SocketTask.onMessage((e) => {
			const res = JSON.parse(e.data)
			// 获取总未读数,并且渲染到tabBar的badge
			initTabBarBadge()
			// 获取未读信息
			dispatch('getChatMessages')

			// 过滤初始连接信息
			if (res.type !== sendType && res.type !== receiveType) return
			console.log(res)
			// 全局通知接口
			uni.$emit('UserChat', res)
			// 存储到 chatDetail
			dispatch('updateChatDetail', { res })
			// 更新chatList（将当前会话置顶，修改chatList中当前会话的data和time显示）
			dispatch('updateChatList', res)
			// 总未读数+1，修改tabBar信息数
			if (CurrentToUser.userId !== res.body.userId) {
				updateNoReadNum({ type: 'add' })
			}
		})
	},

	// 发送消息
	send({ dispatch, rootGetters, state: { SocketTask } }, res) {
		/**
		 {
				type: 'system | user',
				msg: {
					id: 0,
					type: 'text | voice | img',
					time?: '12:56',
					userinfo?: {
						uid: 0,
						username?: '大黑哥',
						face: '/static/chat/img/face.jpg'
					},
					content: { text | url : '欢迎进入HM-chat聊天室', w?: 200, h?: 200, length?: '00:06' }
				}
			}
		 * */
		// 发送的格式
		const user = {
			userId: rootGetters['user/userId'],
			username: rootGetters['user/username'],
			toUser: state.CurrentToUser.userId
		}
		const sendData = chatFormat(res, { type: 'send' }, user)
		// 存储到chatDetail
		dispatch('updateChatDetail', { res: sendData, isSend: true })
		// 存储到chatList（将当前会话置顶，修改chatList中当前会话的data和time显示）
		dispatch('updateChatList', sendData)
		// 发送到服务器
		SocketTask.send({
			data: JSON.stringify(sendData),
			fail: (res) => console.log('发送失败')
		})
	},

	getChatMessages() {},

	updateChatDetail({ rootGetters, state }, { res, isSend = false }) {
		// 组织格式，本地存储
		/*
		[
			{
				"type": "user", // 固定值
				"msg": {
					"id": 96, // 聊天信息唯一 id
					"type": "text",   // 文本类型, 暂时不需要变
					"time": 1603014006394,
					"userinfo": {
						"uid": 9,   // 发送人 id
						"username": "LiRyan",   // 发送人 username
						"face": "/static/chat/img/face.jpg" // 发送人头像
					},
					"content": {
						"text": "测试内容"  // 文本内容, 暂时不需要变, 只需更改字段值
					}
				}
			}
		]
		*/
		console.log(res)
		const userId = isSend ? state.CurrentToUser.userId : res.body.userId
		// 获取旧数据（ chatDetail_[当前用户id]_[聊天对象id] ）
		const chatDetail = localStore.get(
			'chatDetail_' + rootGetters['user/userId'] + '_' + userId
		)
		let list = chatDetail || []

		// 追加
		list.push(
			chatFormat(res, {
				type: 'chatDetail',
				// isMe: isSend,
				oldData: list
			})
		)
		// 存储
		localStore.set(
			'chatDetail_' + rootGetters['user/userId'] + '_' + userId,
			list
		)
	},

	updateChatList({ rootGetters, state }, res) {
		// 组织格式，本地存储
		/*
		[
			{
				"userId": 9,	// 对方 id
				"username": "LiRyan"	// 对方用户名
				"avatar": "/static/chat/img/im/face/face_2.jpg", // 头像
				"data": "测试",
				"noReadNum": 0,	// 未读数
				"time": 1603018382636
			}
		]
		*/

		const { userId, toUserId, toUser, createTime, content } = res.body
		// 获取旧数据
		console.log(res)
		let chatList = localStore.get('chatList') || []
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
		// 存储到本地存储
		localStore.set(chatListName, chatList)
	}
}

export default {
	state,
	getters,
	mutations,
	actions
}
