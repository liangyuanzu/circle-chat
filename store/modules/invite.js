import { inviteUsers, getInviteList, agreeInvite, delInvite } from '@/api/invite.js'

const state = {
	inviteList: []
}

const getters = {}

const mutations = {
	setInviteList(state, list) {
		state.inviteList = list
	}
}

const actions = {
	async inviteUsers({}, data) {
		await inviteUsers(data)
	},

	async getInviteList({ commit }) {
		const list = await getInviteList()
		commit('setInviteList', list)
	},

	async agreeInvite({}, data) {
		await agreeInvite(data)
	},

	async delInvite({}, data) {
		await delInvite(data)
	}
}

export default {
	state,
	getters,
	mutations,
	actions
}
