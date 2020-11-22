import {
	nearlyCircle,
	creatCircle,
	updateCirclePhoto,
	joinCircle,
	getMyJoinCircle,
	getCircleInfo,
	getCircleMember,
	updateCircleAvatar,
	updateCircleInfo,
	addCircleEffective,
	exitCircle,
	getIndexList
} from '@/api/circle.js'

const state = {
	circleList: [],
	circleAvatar:
		'https://ossweb-img.qq.com/images/lol/web201310/skin/big11010.jpg',
	myJoinCircle: [],
	circleInfo: {},
	circleMember: [],
	indexList: []
}

const getters = {
	circleAvatar: (state) => state.circleAvatar,
	circleInfo: (state) => state.circleInfo,
	circleMember: (state) => state.circleMember
}

const mutations = {
	setCircleList(state, circleList) {
		state.circleList = circleList
	},

	setCircleAvatar(state, circleAvatar) {
		state.circleAvatar = circleAvatar
	},

	setMyJoinCircle(state, myJoinCircle) {
		state.myJoinCircle = myJoinCircle
	},

	setCircleInfo(state, circleInfo) {
		state.circleInfo = circleInfo
	},

	setCircleMember(state, circleMember) {
		state.circleMember = circleMember
	},

	setIndexList(state, list) {
		state.indexList = list
	}
}

const actions = {
	async nearlyCircle({ commit }, type) {
		const circleList = await nearlyCircle(type)
		if (circleList) commit('setCircleList', circleList)
	},

	async creatCircle({ commit }, createInfo) {
		await creatCircle(createInfo)
	},

	async updateCirclePhoto({ commit }, avatarInfo) {
		const circleAvatar = await updateCirclePhoto(avatarInfo)
		if (circleAvatar) {
			commit('setCircleAvatar', circleAvatar)
		} else {
			uni.showToast({
				icon: 'none',
				title: '更换圈头像接口异常'
			})
		}
	},

	async joinCircle({}, circleId) {
		await joinCircle(circleId)
	},

	async getMyJoinCircle({ commit }) {
		const myJoinCircle = await getMyJoinCircle()
		if (myJoinCircle) commit('setMyJoinCircle', myJoinCircle)
	},

	async getCircleInfo({ commit }, circleId) {
		const circleInfo = await getCircleInfo(circleId)
		if (circleInfo) commit('setCircleInfo', circleInfo)
	},

	async getCircleMember({ commit }, circleId) {
		const circleMember = await getCircleMember(circleId)
		if (circleMember) commit('setCircleMember', circleMember)
	},

	async updateCircleAvatar({}, data) {
		await updateCircleAvatar(data)
	},

	async updateCircleInfo({}, circleInfo) {
		await updateCircleInfo(circleInfo)
	},

	async addCircleEffective({}, circleInfo) {
		await addCircleEffective(circleInfo)
	},

	async exitCircle({}, circleId) {
		await exitCircle(circleId)
	},

	async getIndexList({ commit }, circleId) {
		const list = await getIndexList(circleId)
		commit('setIndexList', list)
	}
}

export default {
	state,
	getters,
	mutations,
	actions
}
