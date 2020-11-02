import {
	nearlyCircle,
	creatCircle,
	updateCirclePhoto,
	joinCircle,
	getMyJoinCircle
} from '@/api/circle.js'

const state = {
	circleList: [],
	circleAvatar:
		'https://ossweb-img.qq.com/images/lol/web201310/skin/big11010.jpg',
	myJoinCircle: []
}

const getters = {
	circleAvatar: (state) => state.circleAvatar
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

	async updateCirclePhoto({ commit }, imgSrc) {
		const circleAvatar = await updateCirclePhoto(imgSrc)
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
	}
}

export default {
	state,
	getters,
	mutations,
	actions
}
