import {
	creatCircle
} from '@/api/circle.js'

const state = {

};

const getters = {

};

const mutations = {

};

const actions = {
	async creatCircle({
		commit
	}, createInfo) {
		await creatCircle(createInfo);
	},
};

export default {
	state,
	getters,
	mutations,
	actions
};
