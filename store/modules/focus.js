import { queryMyFocus, addFocus, delFocus } from '@/api/focus.js'

const state = {
	myFocus: [],
	focusMy: []
}

const getters = {
	myFocus: (state) => state.myFocus,
	focusMy: (state) => state.focusMy,
	focusList: (state) => {
		return [state.myFocus, state.focusMy]
	}
}

const mutations = {
	setMyFocus(state, list) {
		state.myFocus = list
	},
	setFocusMy(state, list) {
		state.focusMy = list
	}
}

const actions = {
	async getFocusList({ commit }, type) {
		const list = await queryMyFocus(type)
		if (type === 1) {
			commit('setMyFocus', list)
		} else if (type === 2) {
			commit('setFocusMy', list)
		}
	},

	async addFocus({ commit }, userId) {
		await addFocus(userId)
	},

	async delFocus({ commit }, userId) {
		await delFocus(userId)
	}
}

export default {
	state,
	getters,
	mutations,
	actions
}
