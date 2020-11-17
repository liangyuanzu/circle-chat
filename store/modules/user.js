import {
	login,
	getUserInfo,
	sendRegisterEmail,
	register,
	sendForgetPasswordEmail,
	updatePassword,
	logout,
	updatePhoto,
	updateMessage,
	queryUserMsg,
	userSet,
	login_baidu,
	getUserInfo_baidu
} from '@/api/user.js'
import localStore from '@/helpers/localStore.js'

const state = {
	userId: '',
	username: '',
	avatar: '',
	age: '',
	sex: '',
	birthday: '',
	autograph: '',
	personinfo: '',
	longitude: '', // 经度
	latitude: '' // 纬度
}

const getters = {
	userId: (state) => state.userId,
	username: (state) => state.username,
	avatar: (state) => state.avatar,
	age: (state) => state.age,
	sex: (state) => state.sex,
	birthday: (state) => state.birthday,
	autograph: (state) => state.autograph,
	personinfo: (state) => state.personinfo,
	position: (state) => state.longitude + ',' + state.latitude
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
	},
	setPersonInfo(state, personinfo) {
		state.personinfo = personinfo
	},
	setPosition(state, { longitude, latitude }) {
		state.longitude = longitude
		state.latitude = latitude
	}
}

const actions = {
	init({ dispatch }) {
		dispatch('getUserInfo')
		dispatch('getPosition')
		dispatch('chat/open', {}, { root: true })
	},

	init_baidu({ commit, dispatch }) {
		const userinfo = localStore.get('userinfo')
		commit('setUsername', userinfo.username)
		commit('setAvatar', userinfo.img)
		commit('setSex', userinfo.sex)
		dispatch('getPosition')
		dispatch('chat/open', {}, { root: true })
	},

	getPosition({ commit }) {
		uni.getLocation({
			type: 'gcj02',
			success: function (res) {
				commit('setPosition', {
					longitude: res.longitude,
					latitude: res.latitude
				})
			}
		})
	},

	async login({ dispatch }, userinfo) {
		// await login(userinfo)
		const { accessToken } = await login(userinfo)
		uni.setStorageSync('token', accessToken)
		dispatch('init')
	},

	async getUserInfo({ commit }) {
		const userinfo = await getUserInfo()
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
		uni.clearStorageSync()
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

	async updateMessage({ dispatch }, userinfo) {
		await updateMessage(userinfo)
		dispatch('getUserInfo')
	},

	async getPersonInfo({ commit }, userId) {
		const personinfo = await queryUserMsg(userId)
		if (Object.keys(personinfo)) {
			commit('setPersonInfo', personinfo)
		} else {
			uni.showToast({
				icon: 'none',
				title: '获取用户信息接口异常'
			})
		}
	},

	async userSet({}, data) {
		await userSet(data)
	},

	async login_baidu({ commit }, code) {
		const userId = await login_baidu(code)
		commit('setUserId', userId)
	},

	async getUserInfo_baidu({ dispatch }, data) {
		const userinfo = await getUserInfo_baidu(data)
		localStore.set('userinfo', userinfo)
		dispatch('init_baidu')
	}
}

export default {
	state,
	getters,
	mutations,
	actions
}
