import {
	login,
	getUserInfo,
	sendRegisterEmail,
	register,
	sendForgetPasswordEmail,
	forgetPassword,
	logout,
	updatePhoto,
	updateMessage,
	queryUserMsg,
	userSet,
	login_baidu,
	getUserInfo_baidu,
	logout_baidu,
	updatePosition,
	getUserSetting,
	signIn
} from '@/api/user.js'
import localStore from '@/helpers/localStore.js'

const state = {
	userId: '',
	username: '',
	avatar: '',
	age: '',
	sex: '',
	birthday: '',
	myFocus: 0, // 关注
	myFans: 0, // 粉丝
	points: 0, // 积分
	timer: '', // 更新位置信息定时器
	autograph: '',
	personinfo: '',
	longitude: '', // 经度
	latitude: '', // 纬度
	setting: {},
	isInit: false // 是否已初始化
}

const getters = {
	userId: (state) => state.userId,
	username: (state) => state.username,
	avatar: (state) => state.avatar,
	age: (state) => state.age,
	sex: (state) => state.sex,
	birthday: (state) => state.birthday,
	autograph: (state) => state.autograph,
	myFocus: (state) => state.myFocus,
	myFans: (state) => state.myFans,
	points: (state) => state.points,
	personinfo: (state) => state.personinfo,
	position: (state) => {
		if (state.longitude && state.latitude) {
			return state.longitude + ',' + state.latitude
		}
		return ''
	},
	isInit: (state) => state.isInit
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
	setMyFocus(state, myFocus) {
		state.myFocus = myFocus
	},
	setMyFans(state, myFans) {
		state.myFans = myFans
	},
	setPoints(state, points) {
		state.points = points
	},
	setPersonInfo(state, personinfo) {
		state.personinfo = personinfo
	},
	setTimer(state, timer) {
		state.timer = timer
	},
	setPosition(state, { longitude, latitude }) {
		state.longitude = longitude
		state.latitude = latitude
	},
	setSetting(state, setting) {
		state.setting = setting
	},
	setIsInit(state, isInit) {
		state.isInit = isInit
	}
}

const actions = {
	async init({ dispatch }) {
		await dispatch('getUserInfo')
		await dispatch('getPosition')
		await dispatch('chat/init', {}, { root: true })
	},

	async init_baidu({ state: { timer }, commit, dispatch }) {
		const userinfo = localStore.get('userinfo')
		commit('setUserId', userinfo.userId)
		commit('setUsername', userinfo.username)
		commit('setAvatar', userinfo.img)
		commit('setSex', userinfo.sex)
		commit('setAutograph', userinfo.autograph)
		commit('setBirthday', userinfo.birthday)
		commit('setMyFocus', userinfo.myFocus)
		commit('setMyFans', userinfo.myFans)
		commit('setPoints', userinfo.points)
		dispatch('getPosition')
		timer && clearInterval(timer)
		commit(
			'setTimer',
			setInterval(() => dispatch('getPosition'), 300000)
		)
		await dispatch('chat/init', {}, { root: true })
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
					},
					fail: function () {
						uni.showToast({
							title: '位置信息获取失败，请开启定位',
							icon: 'none'
						})
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
		localStore.set('userinfo', userinfo)
		commit('setUserId', userinfo.userId)
		commit('setUsername', userinfo.username)
		commit('setAvatar', userinfo.img)
		commit('setAge', userinfo.age)
		commit('setSex', userinfo.sex)
		commit('setBirthday', userinfo.birthday)
		commit('setAutograph', userinfo.autograph)
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

	async logout_baidu({ state: { timer }, commit, dispatch }) {
		await logout_baidu()
		commit('setUsername', '')
		commit('setAvatar', '')
		commit('setSex', '')
		timer && clearInterval(timer)
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

	async forgetPassword({}, resetInfo) {
		await forgetPassword(resetInfo)
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
		// #ifndef MP-BAIDU
		dispatch('getUserInfo')
		// #endif
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

	async getUserInfo_baidu({ commit, dispatch }, data) {
		const userinfo = await getUserInfo_baidu(data)
		localStore.set('userinfo', userinfo)
		dispatch('init_baidu').then(() => {
			commit('setIsInit', true)
		})
	},

	async getUserSetting({ commit }) {
		const setting = await getUserSetting()
		commit('setSetting', setting)
	},

	async signIn({}) {
		await signIn()
	}
}

export default {
	state,
	getters,
	mutations,
	actions
}
