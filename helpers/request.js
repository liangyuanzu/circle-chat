import Request from '@/utils/luch-request/index.js'
import { baseUrl, accessTokenName, refreshTokenName } from '@/config/config.js'
import localStore from '@/helpers/localStore.js'
import { refresh } from '@/api/user.js'

const http = new Request()

http.setConfig((config) => {
	config.baseURL = baseUrl
	return config
})

http.interceptors.request.use(
	(config) => {
		const token = localStore.get(accessTokenName)
		if (token) {
			config.header.token = token
		}
		return config
	},
	(error) => {
		return Promise.reject(error)
	}
)

http.interceptors.response.use(
	(response) => {
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

function refreshToken() {
	const { accessToken, refreshToken } = refresh(
		localStore.get(refreshTokenName)
	)
	if (accessToken && refreshToken) {
		localStore.set(accessTokenName, accessToken)
		localStore.set(refreshTokenName, refreshToken)
	} else {
		uni.showToast({
			icon: 'none',
			title: '刷新token接口异常'
		})
	}
}

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
					if (res.data.msg == 'token失效，请重新登录。') {
						refreshToken()
						return
					}
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
