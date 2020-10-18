import { tabBarIndex, noReadNumName, chatListName } from '@/config/config.js'
import localStore from '@/helpers/localStore.js'
import Time from '@/helpers/time.js'
import { html2text } from '@/helpers/utils.js'

// 聊天数据格式化
export function chatFormat(res, options = {}, user) {
	/**
 options = {
	 type:"chatDetail", // 转化类型
	 oldData:oldData,   // 旧数据（chatDetail中必填）
	 isMe:true			// （true本人，false聊天对象，chatDetail中必填）
 }
 * */

	switch (options.type) {
		case 'chatList': // 新增会话用到
			let obj = {
				userId: res.body.userId,
				username: res.body.username,
				avatar: '/static/chat/img/im/face/face_2.jpg',
				time: res.body.createTime, // 最新消息时间戳
				data: res.body.content,
				noReadNum: 0 // 未读数
			}
			// 本人发送的信息
			if (res.body.userId == user.userId) {
				obj.userId = user.toUser
				obj.username = user.toUserName
				obj.avatar = user.toUserAvatar
			}
			return obj
		case 'chatDetail':
			const list = options.oldData || []
			const lastTime =
				list?.length > 0
					? [...list].reverse().find((i) => i.msg.time).msg.time
					: 0
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
			 */

			return {
				type: 'user',
				msg: {
					id: Math.floor(Math.random() * 1000 + 1),
					type: 'text',
					time: Time.noFormatChatTime(res.body.createTime, lastTime),
					userinfo: {
						uid: res.body.userId,
						username: res.body.username,
						face: '/static/chat/img/face.jpg'
					},
					content: { text: res.body.content }
				}
				// isMe: options.isMe,
				// userpic: options.isMe ? User.userinfo.userpic : data.from_userpic,
				// type: res.type,
				// data: res.body.content,
				// time: chatTime,
				// formatTime: Time.getChatTime(
				// 	chatTime,
				// 	length > 0 ? list[length - 1].time : 0
				// )
			}
		case 'send':
			return {
				type: 'SEND_TO_ONE_REQUEST',
				body: {
					userId: user.userId,
					username: user.username,
					toUser: user.toUser,
					content: html2text(res.msg.content.text),
					createTime: new Date().getTime()
				}
			}
	}
}

// 读取当前会话
export function read(item) {
	/*
	item的格式
	{
		userId:12,
		userpic:"../../static/demo/userpic/12.jpg",
		username:"昵称",
		time:"10:21",
		data:"我是信息",
		noReadNum:2
	}
	*/
	if (!item.noReadNum) return
	let chatList = localStore.get(chatListName) || []
	// 拿到当前会话的索引
	const index = chatList?.findIndex((value) => value.userId == item.userId)
	// 如果会话存在
	if (index !== -1) {
		const oldNoReadNum = chatList[index].noReadNum
		chatList[index].noReadNum = 0
		// 存储
		localStore.set(chatListName, chatList)
		// 更新tabBar的badge
		updateNoReadNum({ type: 'read', num: oldNoReadNum })
	}
}

// 总未读数+1，修改tabBar信息数
export function updateNoReadNum(options = {}) {
	// 获取总未读数
	let noReadNum = uni.getStorageSync(noReadNumName)
	// 接收信息增加
	if (options.type == 'add') {
		// 总未读+1
		noReadNum++
		// 响铃震动提示
		// this.__Notify()
	} else {
		noReadNum -= options.num // 读取信息减少
	}
	noReadNum = noReadNum || 0
	// 修改tabBar信息数
	updateTabBarBadge(noReadNum)
	// 存储
	uni.setStorageSync(noReadNumName, noReadNum)
}

export function initTabBarBadge() {
	// 获取总未读数
	const noReadNum = uni.getStorageSync(noReadNumName)
	noReadNum && updateTabBarBadge(noReadNum)
}

function updateTabBarBadge(num) {
	if (num > 0) {
		return uni.setTabBarBadge({
			index: tabBarIndex,
			text: num > 99 ? '99+' : num.toString()
		})
	}
	return uni.removeTabBarBadge({
		index: tabBarIndex
	})
}
