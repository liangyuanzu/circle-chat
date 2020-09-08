import { login } from '@/api/user.js'
import { setToken, removeToken } from "@/helpers/token.js";

const state = {
	username: ''
};

const getters = {
	username: (state) => state.username
};

const mutations = {
	setUsername(state, username) {
    state.username = username;
  },
};

const actions = {
	async login({ commit }, userInfo) {
	  const { token, username } = await login(userInfo);
		if (token && username) {
			setToken(token)
			commit("setUsername", username);
		}else {
			uni.showToast({
				icon: 'none',
				title: '登录接口异常'
			});
		}
	},
};
export default { state, getters, mutations, actions };
