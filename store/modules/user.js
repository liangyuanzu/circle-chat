import {
	login,
	getUserInfo,
	sendRegisterEmail,
	register,
	sendForgetPasswordEmail,
	updatePassword,
	logout,
	updatePhoto,
	queryUserMsg,
	userSet
} from '@/api/user.js'
import { accessTokenName, refreshTokenName } from '@/config/config.js'

import localStore from '@/helpers/localStore.js'

const state = {
	userId: '',
	username: '',
	avatar: '',
	age: '',
	sex: '',
	birthday: '',
	autograph: ''
}

const getters = {
	userId: (state) => state.userId,
	username: (state) => state.username,
	avatar: (state) => state.avatar,
	age: (state) => state.age,
	sex: (state) => state.sex,
	birthday: (state) => state.birthday,
	autograph: (state) => state.autograph
}

const mutations = {
	setUserId(state, userId) {
		state.userId = userId
	},
	setUsername(state, username) {
		state.username = username
	},
	setAvatar(state, avatar) {
		state.avatar = avatar
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
	init({ dispatch }) {
		dispatch('getUserInfo')
		dispatch('chat/open', {}, { root: true })
	},

	async login({ dispatch }, userinfo) {
		const { accessToken, refreshToken } = await login(userinfo)
		if (accessToken && refreshToken) {
			localStore.set(accessTokenName, accessToken)
			localStore.set(refreshTokenName, refreshToken)
			dispatch('init')
		} else {
			uni.showToast({
				icon: 'none',
				title: '登录接口异常'
			})
		}
	},

	async getUserInfo({ commit }) {
		const token = localStore.get(accessTokenName)
		const userinfo = await getUserInfo(token)
		if (Object.keys(userinfo)) {
			commit('setUserId', userinfo.userId)
			commit('setUsername', userinfo.username)
			commit('setAvatar', userinfo.img)
			commit('setAge', userinfo.age)
			commit('setSex', userinfo.sex)
			commit('setBirthday', userinfo.birthday)
			commit('setAutograph', userinfo.autograph)
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

	async updatePhoto({ commit }, path) {
		const avatar = await updatePhoto(path)
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
	},

	async userSet({}, data) {
		await userSet(data)
	}
}

export default {
	state,
	getters,
	mutations,
	actions
}
