const obj2str = (data = {}) => {
	let res = []
	for (let key in data) {
		res.push(encodeURIComponent(key) + '=' + encodeURIComponent(data[key]))
	}
	return res.join('&')
}

const request = (option) => {
	return new Promise((resolve, reject) => {
		const str = obj2str(option.params)
		let xmlhttp, timer
		if (window.XMLHttpRequest) {
			// code for IE7+, Firefox, Chrome, Opera, Safari
			xmlhttp = new XMLHttpRequest()
		} else {
			// code for IE6, IE5
			xmlhttp = new ActiveXObject('Microsoft.XMLHTTP')
		}
		if (option.method.toLowerCase() === 'get') {
			xmlhttp.open(option.method, option.url + '?' + str, true)
			const sessionId = localStorage.getItem('sessionId')
			xmlhttp.setRequestHeader('sessionid', sessionId)
			xmlhttp.send()
		} else {
			xmlhttp.open(option.method, option.url, true)
			xmlhttp.setRequestHeader('Content-type', 'application/json')
			const sessionId = localStorage.getItem('sessionId')
			xmlhttp.setRequestHeader('sessionid', sessionId)
			xmlhttp.send(JSON.stringify(option.data))
		}

		xmlhttp.onreadystatechange = () => {
			if (xmlhttp.readyState === 4) {
				clearInterval(timer)
				if (
					(xmlhttp.status >= 200 && xmlhttp.status < 300) ||
					xmlhttp.status === 304
				) {
					resolve(xmlhttp)
				} else {
					reject(xmlhttp)
				}
			}
		}

		option.timeout = option.timeout || 3000
		timer = setInterval(() => {
			xmlhttp.abort()
			clearInterval(timer)
		}, option.timeout)
	})
}

const baseUrl = 'https://www.circlechat.top/api'
const $request = (url, Options) => {
	return new Promise((resolve, reject) => {
		request({
			method: Options.method || 'GET',
			data: Options.data, // post 传参
			params: Options.params, // get 传参
			url: baseUrl + url,
			header: Options.header,
			...Options
		})
			.then((xhr) => {
				const res = JSON.parse(xhr.responseText)
				if (res.code == 0) {
					resolve(res.data)
				} else {
					alert(res.msg)
					// log.error(res?.msg)
					// reject(res)
				}
			})
			.catch((err) => {
				reject(err)
			})
	})
}
