import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'
import mutations from './mutations'
import actions from './actions'

Vue.use(Vuex)

const state = {
	searchList: [],
	imageUrl: '',
	uploadUrl: '' // 文件上传后返回的 url
}

const files = require.context('./modules', false, /\.js$/)
const modules = {}

files.keys().forEach((key) => {
	modules[key.replace(/(\.\/|\.js)/g, '')] = files(key).default
})
Object.keys(modules).forEach((key) => {
	modules[key]['namespaced'] = true
})

export default new Vuex.Store({
	state,

	getters,

	mutations,

	actions,

	modules
})
