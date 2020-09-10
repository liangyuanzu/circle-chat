import {
	login,
	sendRegisterEmail,
	register,
	sendForgetPasswordEmail,
	updatePassword,
	logout,
	updatePhoto
} from '@/api/user.js'
import {
	setToken,
	removeToken
} from "@/helpers/token.js";

const state = {
	username: '',
	email: '',
	avatar: 'https://ossweb-img.qq.com/images/lol/web201310/skin/big11010.jpg'
};

const getters = {
	username: (state) => state.username,
	email: (state) => state.email,
	avatar: (state) => state.avatar
};

const mutations = {
	setUsername(state, username) {
		state.username = username;
	},
	setEmail(state, email) {
		state.email = email;
	},
	setAvatar(state, avatar) {
		state.avatar = avatar;
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

	async updatePhoto({
		commit
	}, imgSrc) {
		const avatar = await updatePhoto(imgSrc);
		if (avatar) {
			commit("setAvatar", avatar);
		} else {
			uni.showToast({
				icon: 'none',
				title: '更换用户头像接口异常'
			});
		}
	},
};

export default {
	state,
	getters,
	mutations,
	actions
};
