import Request from '@/utils/luch-request/index.js'
import { baseUrl, tokenName } from '@/config/config.js'
import localStore from '@/helpers/localStore.js'

function refreshToken() {
	return http.post('/user/refreshToken').then((res) => res.data)
}

const http = new Request()

http.setConfig((config) => {
	config.baseURL = baseUrl
	return config
})

http.setToken = (token) => {
	http.header.token = token
	localStore.set(tokenName, token)
}

http.interceptors.request.use(
	(config) => {
		const token = localStore.get(tokenName)
		token && (config.header.token = token)
		return config
	},
	(error) => {
		return Promise.reject(error)
	}
)

// 是否正在刷新的标记
let isRefreshing = false
// 重试队列，每一项将是一个待执行的函数形式
let requests = []

http.interceptors.response.use(
	(response) => {
		const { code } = response.data
		if (code == 401) {
			const config = response.config
			if (!isRefreshing) {
				isRefreshing = true
				return refreshToken()
					.then((res) => {
						const { token } = res.data
						http.setToken(token)
						config.token = token
						config.baseURL = baseUrl
						// 已经刷新了token，将所有队列中的请求进行重试
						requests.forEach((cb) => cb(token))
						requests = []
						return http.setConfig(config)
					})
					.catch((err) => {
						console.error('refreshToken error =>', err)
						uni.reLaunch({
							url: '/pages/login/login'
						})
					})
					.finally(() => {
						isRefreshing = false
					})
			} else {
				// 正在刷新token，将返回一个未执行resolve的promise
				return new Promise((resolve) => {
					// 将resolve放进队列，用一个函数形式来保存，等token刷新后直接执行
					requests.push((token) => {
						config.baseURL = baseUrl
						config.header.token = token
						resolve(http.setConfig(config))
					})
				})
			}
		}
		return response
	},
	(error) => {
		if (error && error.statusCode) {
			switch (error.statusCode) {
				case 403:
					error.msg = '拒绝访问'
					break
				case 404:
					error.msg = '请求错误,未找到该资源'
					break
				case 500:
					error.msg = error.response.data.msg
					break
				default:
					error.msg = `连接错误 ${error.statusCode}`
			}
		} else {
			error.msg = '连接到服务器失败'
		}

		uni.showToast({
			icon: 'none',
			title: error.msg
		})
		return Promise.reject(error)
	}
)

const $request = (url, Options) => {
	return new Promise((resolve, reject) => {
		http
			.middleware({
				method: Options.method || 'GET',
				data: Options.data, // post 传参
				params: Options.params, // get 传参
				url,
				header: Options.header,
				...Options
			})
			.then((res) => {
				if (res.data.code == 0) {
					resolve(res.data.data)
				} else {
					uni.showToast({
						icon: 'none',
						title: res.data.msg
					})
					reject(res.data)
				}
			})
			.catch((err) => {
				reject(err)
			})
	})
}

export default $request
