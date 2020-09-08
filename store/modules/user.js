import { login } from '@/api/user.js'
import { getToken, setToken, removeToken } from "@/helpers/token.js";

const state = {
	token: getToken()
};

const getters = {

};

const mutations = {
	setToken(state, token) {
	  state.token = token;
	  setToken(token);
	},
};

const actions = {
	async login({ commit }, userInfo) {
	  const { token } = await login(userInfo);
		if (token) {
			commit('setToken', token)
		}else {
			uni.showToast({
				icon: 'none',
				title: '登录接口异常'
			});
		}
	},
};
export default { state, getters, mutations, actions };
