import {
	login,
	getUserInfo,
	sendRegisterEmail,
	register,
	sendForgetPasswordEmail,
	updatePassword,
	logout,
	updatePhoto,
	queryUserMsg
} from '@/api/user.js'
import { tokenName, userInfoName } from '@/config/config.js'

import localStore from '@/helpers/localStore.js'

const state = {
	userinfo: {}
}

const getters = {
	userinfo: (state) => state.userinfo,
	userId: (state) => state.userinfo.userId,
	username: (state) => state.userinfo.username,
	avatar: (state) => state.userinfo.img,
	email: (state) => state.userinfo.email,
	age: (state) => state.userinfo.age,
	sex: (state) => state.userinfo.sex,
	birthday: (state) => state.userinfo.birthday,
	autograph: (state) => state.userinfo.autograph
}

const mutations = {
	setUserInfo(state, userinfo) {
		state.userinfo = userinfo
	},
	setUsername(state, username) {
		state.username = username
	},
	setEmail(state, email) {
		state.email = email
	},
	setAvatar(state, avatar) {
		state.avatar = avatar
	},
	setUserId(state, userId) {
		state.userId = userId
	},
	setAge(state, age) {
		state.age = age
	},
	setSex(state, sex) {
		state.sex = sex
	},
	setBirthday(state, birthday) {
		state.birthday = birthday
	},
	setAutograph(state, autograph) {
		state.autograph = autograph
	}
}

const actions = {
	init({ commit }) {
		const userinfo = localStore.get(userInfoName)
		commit('setUserInfo', userinfo)
	},

	async login({ dispatch }, userinfo) {
		const { token } = await login(userinfo)
		if (token) {
			localStore.set(tokenName, token)
			dispatch('getUserInfo', token)
		} else {
			uni.showToast({
				icon: 'none',
				title: '登录接口异常'
			})
		}
	},

	async getUserInfo({ commit, dispatch }) {
		const token = localStore.get(tokenName)
		const data = await getUserInfo(token)
		if (Object.keys(data)) {
			commit('setUserInfo', data)
			localStore.set(userInfoName, data)
			dispatch('chat/open', {}, { root: true })
		} else {
			uni.showToast({
				icon: 'none',
				title: '获取用户信息接口异常'
			})
		}
	},

	async logout({ dispatch }) {
		await logout()
		localStore.delAll()
		dispatch('chat/close', {}, { root: true })
	},

	async sendRegisterEmail({}, email) {
		await sendRegisterEmail(email)
	},

	async register({}, regInfo) {
		await register(regInfo)
	},

	async sendForgetPasswordEmail({}, email) {
		await sendForgetPasswordEmail(email)
	},

	async updatePassword({}, resetInfo) {
		await updatePassword(resetInfo)
	},

	async updatePhoto({ commit }, imgSrc) {
		const avatar = await updatePhoto(imgSrc)
		if (avatar) {
			commit('setAvatar', avatar)
		} else {
			uni.showToast({
				icon: 'none',
				title: '更换用户头像接口异常'
			})
		}
	},

	async queryUserMsg({ commit }, userId) {
		const { age, userMsg } = await queryUserMsg(userId)
		if (age && userMsg) {
			commit('setUsername', username)
			commit('setEmail', email)
			commit('setAge', age)
			commit('setUserId', userMsg[0].userId)
			commit('setSex', userMsg[0].sex)
			commit('setBirthday', userMsg[0].birthday)
			commit('setAutograph', userMsg[0].autograph)
		} else {
			uni.showToast({
				icon: 'none',
				title: '获取用户信息接口异常'
			})
		}
	}
}

export default {
	state,
	getters,
	mutations,
	actions
}
