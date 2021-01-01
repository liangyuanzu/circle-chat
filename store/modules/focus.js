import { queryMyFocus, queryFocusSb, addFocus, delFocus } from '@/api/focus.js'
import localStore from '@/helpers/localStore.js'

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
	async getFocusList({ commit, dispatch }, type) {
		const list = await queryMyFocus(type)
		if (type === 1) {
			commit('setMyFocus', list)
			dispatch('count', { type: 'myFocus', num: list.length })
		} else if (type === 2) {
			commit('setFocusMy', list)
			dispatch('count', { type: 'myFans', num: list.length })
		}
	},

	async getFocusStatus({ commit }, id) {
		const status = await queryFocusSb(id)
		commit('setFocusStatus', status)
	},

	addFocus({ rootGetters, dispatch }, userId) {
		addFocus(userId).then(() => {
			let myFocus = rootGetters['user/myFocus']
			++myFocus
			dispatch('count', { type: 'myFocus', num: myFocus })
		})
	},

	cancelFocus({ rootGetters, dispatch }, userId) {
		delFocus(userId).then(() => {
			let myFocus = rootGetters['user/myFocus']
			--myFocus
			dispatch('count', { type: 'myFocus', num: myFocus })
		})
	},

	count({ commit }, { type, num }) {
		if (type === 'myFocus') {
			commit('user/setMyFocus', num, { root: true })
		} else if (type === 'myFans') {
			commit('user/setMyFans', num, { root: true })
		}
		let userinfo = localStore.get('userinfo')
		userinfo[type] = num
		localStore.set('userinfo', userinfo)
	}
}

export default {
	state,
	getters,
	mutations,
	actions
}
