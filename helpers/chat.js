import {
	tabBarIndex,
	noReadNumName,
	chatListName,
	sendOneType,
	sendCircleType
} from '@/config/config.js'
import localStore from '@/helpers/localStore.js'
import Time from '@/helpers/time.js'
import { html2text } from '@/helpers/utils.js'

export function chatFormat(res, options = { isCircle: false }, data) {
	const { isCircle } = options
	switch (options.type) {
		case 'chatList':
			if (isCircle) {
				let obj = {
					circleId: res.body.circleId,
					circleName: res.body.circleName,
					avatar: data.circleAvatar || res.body.circleImg,
					time: res.body.createTime,
					data: `${res.body.username}：${res.body.content}`,
					noReadNum: 0 // 未读数
				}
				// 本人发送的信息
				if (res.body.userId == data.userId) {
					obj.data = res.body.content
				}
				return obj
			}

			let obj = {
				userId: res.body.userId,
				username: res.body.username,
				avatar: data.toUserAvatar || res.body.userImg,
				time: res.body.createTime,
				data: res.body.content,
				noReadNum: 0 // 未读数
			}
			// 本人发送的信息
			if (res.body.userId == data.userId) {
				obj.userId = data.toUser
				obj.username = data.toUserName
			}
			return obj

		case 'chatDetail':
			const list = options.oldData || []
			const lastTime =
				list?.length > 0
					? [...list].reverse().find((i) => i.msg.time).msg.time
					: 0
			return {
				type: 'user',
				msg: {
					id: Math.floor(Math.random() * 1000 + 1),
					type: 'text',
					time: Time.noFormatChatTime(res.body.createTime, lastTime),
					userinfo: {
						uid: res.body.userId,
						username: isCircle ? res.body.username : '',
						face: res.body.userImg
					},
					content: { text: res.body.content }
				}
			}

		case 'send':
			if (isCircle) {
				return {
					type: sendCircleType,
					body: {
						circleId: data.circleId,
						circleName: data.circleName,
						circleImg: data.circleAvatar,
						userId: data.userId,
						userImg: data.avatar,
						content: html2text(res.msg.content.text),
						createTime: new Date().getTime()
					}
				}
			}
			return {
				type: sendOneType,
				body: {
					userId: data.userId,
					username: data.username,
					userImg: data.avatar,
					toUser: data.toUser,
					content: html2text(res.msg.content.text),
					createTime: new Date().getTime()
				}
			}
	}
}

// 读取当前会话
export function read(item) {
	if (!item.noReadNum) return
	let chatList = localStore.get(chatListName) || []
	const index = chatList?.findIndex((value) => value.userId == item.userId)
	// 如果会话存在
	if (index !== -1) {
		const oldNoReadNum = chatList[index].noReadNum
		chatList[index].noReadNum = 0
		localStore.set(chatListName, chatList)
		updateNoReadNum({ type: 'read', num: oldNoReadNum })
	}
}

// 总未读数+1，修改tabBar信息数
export function updateNoReadNum(options = {}) {
	let noReadNum = uni.getStorageSync(noReadNumName)
	if (options.type == 'add') {
		noReadNum++
		// this.__Notify()
	} else {
		noReadNum -= options.num
	}
	noReadNum = noReadNum || 0
	updateTabBarBadge(noReadNum)
	uni.setStorageSync(noReadNumName, noReadNum)
}

export function initTabBarBadge() {
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
