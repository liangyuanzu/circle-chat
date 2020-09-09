import {
	login,
	sendRegisterEmail,
	register,
	sendForgetPasswordEmail,
	updatePassword,
	logout
} from '@/api/user.js'
import {
	setToken,
	removeToken
} from "@/helpers/token.js";

const state = {
	username: '',
	email: ''
};

const getters = {
	username: (state) => state.username,
	email: (state) => state.email
};

const mutations = {
	setUsername(state, username) {
		state.username = username;
	},
	setEmail(state, email) {
		state.email = email;
	},
};

const actions = {
	async login({
		commit
	}, userInfo) {
		const {
			token,
			username,
			email
		} = await login(userInfo);
		if (token && username && email) {
			setToken(token)
			commit("setUsername", username);
			commit("setEmail", email);
		} else {
			uni.showToast({
				icon: 'none',
				title: '登录接口异常'
			});
		}
	},

	async logout({
		commit
	}, email) {
		await logout(email);
		removeToken()
	},

	async sendRegisterEmail({
		commit
	}, email) {
		await sendRegisterEmail(email)
	},

	async register({
		commit
	}, regInfo) {
		await register(regInfo);
	},

	async sendForgetPasswordEmail({
		commit
	}, email) {
		await sendForgetPasswordEmail(email)
	},

	async updatePassword({
		commit
	}, resetInfo) {
		await updatePassword(resetInfo);
	},
};

export default {
	state,
	getters,
	mutations,
	actions
};
