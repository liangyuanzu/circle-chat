import {
	queryMyFocus
} from '@/api/focus.js'

const state = {
	list: []
}

const getters = {
	list: (state) => state.list,
}

const mutations = {
	setList(state, list) {
		state.list = list;
	},
}

const actions = {
	async queryMyFocus({
		commit
	}, type) {
		const list = await queryMyFocus(type);
		commit("setList", list);
	}
}

export default {
	state,
	getters,
	mutations,
	actions
};
