import { queryMyFocus, queryFocusSb, addFocus, delFocus } from '@/api/focus.js'

const state = {
	myFocus: [],
	focusMy: [],
	focusStatus: ''
}

const getters = {
	myFocus: (state) => state.myFocus,
	focusMy: (state) => state.focusMy,
	focusList: (state) => {
		return [state.myFocus, state.focusMy]
	},
	focusStatus: (state) => state.focusStatus
}

const mutations = {
	setMyFocus(state, list) {
		state.myFocus = list
	},
	setFocusMy(state, list) {
		state.focusMy = list
	},
	setFocusStatus(state, focusStatus) {
		state.focusStatus = focusStatus
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

	async getFocusStatus({ commit }, id) {
		const status = await queryFocusSb(id)
		commit('setFocusStatus', status)
	},

	async addFocus({}, userId) {
		await addFocus(userId)
	},

	async cancelFocus({}, userId) {
		await delFocus(userId)
	}
}

export default {
	state,
	getters,
	mutations,
	actions
}
