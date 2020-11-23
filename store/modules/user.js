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
	getUserInfo_baidu,
	logout_baidu,
	updatePosition
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
	async init({ dispatch }) {
		await dispatch('getUserInfo')
		await dispatch('getPosition')
		await dispatch('chat/getOldChatList', 0, { root: true })
		await dispatch('chat/createWebSocket', {}, { root: true })
	},

	async init_baidu({ commit, dispatch }) {
		const userinfo = localStore.get('userinfo')
		commit('setUserId', userinfo.userId)
		commit('setUsername', userinfo.username)
		commit('setAvatar', userinfo.img)
		commit('setSex', userinfo.sex)
		await dispatch('getPosition')
		await dispatch('chat/getOldChatList', 0, { root: true })
		await dispatch('chat/createWebSocket', {}, { root: true })
	},

	getPosition({ commit }) {
		// #ifndef MP-BAIDU
		uni.getLocation({
			type: 'gcj02',
			success: function (res) {
				commit('setPosition', {
					longitude: res.longitude,
					latitude: res.latitude
				})
				const position = res.longitude + ',' + res.latitude
				updatePosition({ position })
			},
			fail: () => {
				uni.showToast({
					title: '您已拒绝地理位置授权，请在设置中开启授权',
					icon: 'none'
				})
			}
		})
		// #endif

		// #ifdef MP-BAIDU
		uni.authorize({
			scope: 'scope.userLocation',
			success() {
				uni.getLocation({
					type: 'gcj02',
					success: function (res) {
						commit('setPosition', {
							longitude: res.longitude,
							latitude: res.latitude
						})
						const position = res.longitude + ',' + res.latitude
						updatePosition({ position })
					}
				})
			},
			fail() {
				uni.showToast({
					title: '您已拒绝地理位置授权，请开启授权',
					icon: 'none'
				})
				setTimeout(() => {
					uni.openSetting()
				}, 500)
			}
		})
		// #endif
	},

	async login({ dispatch }, userinfo) {
		const { sessionid } = await login(userinfo)
		localStore.set('sessionId', sessionid)
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

	async logout({ commit, dispatch }) {
		await logout()
		commit('setUsername', '')
		commit('setAvatar', '')
		commit('setSex', '')
		uni.clearStorageSync()
		uni.removeTabBarBadge({
			index: 0
		})
		dispatch('chat/close', {}, { root: true })
	},

	async logout_baidu({ commit, dispatch }) {
		await logout_baidu()
		commit('setUsername', '')
		commit('setAvatar', '')
		commit('setSex', '')
		uni.clearStorageSync()
		uni.removeTabBarBadge({
			index: 0
		})
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
		const { userId, sessionid } = await login_baidu(code)
		commit('setUserId', userId)
		localStore.set('sessionId', sessionid)
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
