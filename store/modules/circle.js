import { nearlyCircle, creatCircle, updateCirclePhoto } from '@/api/circle.js'

const state = {
	circleList: [],
	circleAvatar:
		'https://ossweb-img.qq.com/images/lol/web201310/skin/big11010.jpg'
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
	}
}

export default {
	state,
	getters,
	mutations,
	actions
}
