import { creatCircle, updateCirclePhoto, nearlyCircle } from '@/api/circle.js'

const state = {
	circleAvatar:
		'https://ossweb-img.qq.com/images/lol/web201310/skin/big11010.jpg',
	circleList: []
}

const getters = {
	circleAvatar: (state) => state.circleAvatar,
	circleList: (state) => state.circleList
}

const mutations = {
	setCircleAvatar(state, circleAvatar) {
		state.circleAvatar = circleAvatar
	},

	setCircleList(state, circleList) {
		state.circleList = circleList
	}
}

const actions = {
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

	async nearlyCircle({ commit }, type) {
		const circleList = await nearlyCircle(type)
		if (circleList) {
			console.log('已调用')
			commit('setCircleList', circleList)
		} else {
			uni.showToast({
				icon: 'none',
				title: '附近的圈接口异常'
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
