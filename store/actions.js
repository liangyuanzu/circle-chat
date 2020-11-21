import { getSearch } from '@/api/common.js'

export default {
	async getSearchList({ commit }, keyword) {
		const searchList = await getSearch(keyword)
		commit('setSearchList', searchList)
	}
}
