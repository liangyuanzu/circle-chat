import Request from '@/utils/luch-request/index.js'
import { getToken } from '@/helpers/token.js'
import { baseUrl } from '../config/config'

const http = new Request()

http.setConfig((config) => {
	config.baseURL = baseUrl
	return config
})

http.interceptors.request.use(
	(config) => {
		config.header = {
			...config.header,
			token: getToken(),
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
					error.msg = `连接错误${error.statusCode}`
			}
		} else {
			error.msg = '连接到服务器失败'
		}

		uni.showToast({
			icon: 'none',
			title: error.msg,
		})
		return Promise.reject(error)
	}
)

const $request = (url, Options) => {
	return new Promise((resolve, reject) => {
		http
			.request({
				method: Options.method || 'GET',
				data: Options.data, // post 传参
				params: Options.params, // get 传参
				url,
				header: Options.header,
				...Options,
			})
			.then((res) => {
				// if (res.data.code === 0) {
				if (res.data.code == 200) {
					resolve(res.data.data)
				} else {
					reject(res.data)
					uni.showToast({
						icon: 'none',
						title: res.data.msg,
					})
				}
			})
			.catch((err) => {
				reject(err)
			})
	})
}

export default $request
