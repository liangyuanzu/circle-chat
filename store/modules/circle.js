import {
	nearlyCircle,
	nearlyCircleByPage,
	creatCircle,
	updateCirclePhoto,
	joinCircle,
	getMyJoinCircle,
	getMyCreateCircle,
	getCircleInfo,
	getCircleMember,
	updateCircleAvatar,
	updateCircleInfo,
	addCircleEffective,
	exitCircle,
	getIndexList,
	getUsersInCircle,
	urgentMsg,
	getUrgent,
	setFound,
	updateUrgent
} from '@/api/circle.js'

const state = {
	circleList: [
		{
			type: 0,
			offset: 1,
			list: []
		},
		{
			type: 1,
			offset: 1,
			list: []
		},
		{
			type: 2,
			offset: 1,
			list: []
		},
		{
			type: 3,
			offset: 1,
			list: []
		}
	],
	circleAvatar:
		'https://ossweb-img.qq.com/images/lol/web201310/skin/big11010.jpg',
	myJoinCircle: [],
	myCreateCircle: [],
	circleInfo: {},
	circleMember: [],
	indexList: [],
	usersInCircleList: [],
	urgent: {} // 紧急圈寻人寻物启事
}

const getters = {
	circleAvatar: (state) => state.circleAvatar,
	circleInfo: (state) => state.circleInfo,
	circleMember: (state) => state.circleMember,
	dataList: (state) => state.circleList.map((i) => i.list),
	urgent: (state) => state.urgent
}

const mutations = {
	setCircleList(state, { type, offset, index, list }) {
		state.circleList.forEach((i) => {
			if (i.type === type) {
				if (i.offset < offset || (offset === 1 && i.list.length === 0)) {
					i.offset = offset
					i.list = [...i.list, ...list]
				} else {
					i.list.splice(index, 1)
				}
			}
		})
	},

	resetCircleList(state) {
		state.circleList.forEach((i) => {
			i.offset = 1
			i.list = []
		})
	},

	setCircleAvatar(state, circleAvatar) {
		state.circleAvatar = circleAvatar
	},

	setMyJoinCircle(state, myJoinCircle) {
		state.myJoinCircle = myJoinCircle
	},

	setMyCreateCircle(state, myCreateCircle) {
		state.myCreateCircle = myCreateCircle
	},

	setCircleInfo(state, circleInfo) {
		state.circleInfo = circleInfo
	},

	setCircleMember(state, circleMember) {
		state.circleMember = circleMember
	},

	setIndexList(state, list) {
		state.indexList = list
	},

	setUsersInCircleList(state, list) {
		state.usersInCircleList = [...state.usersInCircleList, ...list]
	},

	resetUsersInCircleList(state) {
		state.usersInCircleList = []
	},

	setUrgent(state, info) {
		state.urgent = info
	}
}

const actions = {
	async nearlyCircle({ commit }, type) {
		const circleList = await nearlyCircle(type)
		if (circleList) commit('setCircleList', circleList)
	},

	async nearlyCircleByPage({ commit }, pageInfo) {
		const list = await nearlyCircleByPage(pageInfo)
		if (list.length > 0) commit('setCircleList', { ...pageInfo, list })
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

	async getMyCreateCircle({ commit }) {
		const myCreateCircle = await getMyCreateCircle()
		if (myCreateCircle) commit('setMyCreateCircle', myCreateCircle)
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
	},

	async getUsersInCircleList({ commit }, info) {
		const list = await getUsersInCircle(info)
		if (list.length > 0) commit('setUsersInCircleList', list)
	},

	async urgentMsg({}, info) {
		await urgentMsg(info)
	},

	async getUrgent({ commit }, circleId) {
		const info = await getUrgent(circleId)
		if (info) {
			commit('setUrgent', info)
		} else {
			commit('setUrgent', {})
		}
	},

	async setFound({}, found) {
		await setFound(found)
	},

	async updateUrgent({}, info) {
		await updateUrgent(info)
	}
}

export default {
	state,
	getters,
	mutations,
	actions
}
