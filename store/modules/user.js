import {
	login,
	sendRegisterEmail,
	register,
	sendForgetPasswordEmail,
	updatePassword,
	logout,
	updatePhoto,
	queryUserMsg
} from '@/api/user.js'
import { setToken, removeToken } from '@/helpers/token.js'

const state = {
	username: '',
	email: '',
	avatar: 'https://ossweb-img.qq.com/images/lol/web201310/skin/big11010.jpg',
	userId: '',
	age: '',
	sex: '',
	birthday: '',
	autograph: ''
}

const getters = {
	username: (state) => state.username,
	email: (state) => state.email,
	avatar: (state) => state.avatar,
	userId: (state) => state.userId,
	age: (state) => state.age,
	sex: (state) => state.sex,
	birthday: (state) => state.birthday,
	autograph: (state) => state.autograph
}

const mutations = {
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
	async login({ commit }, userInfo) {
		const { token } = await login(userInfo)
		if (token) {
			setToken(token)
		} else {
			uni.showToast({
				icon: 'none',
				title: '登录接口异常'
			})
		}
	},

	async logout({ commit }, email) {
		await logout(email)
		removeToken()
	},

	async sendRegisterEmail({ commit }, email) {
		await sendRegisterEmail(email)
	},

	async register({ commit }, regInfo) {
		await register(regInfo)
	},

	async sendForgetPasswordEmail({ commit }, email) {
		await sendForgetPasswordEmail(email)
	},

	async updatePassword({ commit }, resetInfo) {
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
