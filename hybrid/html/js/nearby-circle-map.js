// request
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
			xmlhttp.send()
		} else {
			xmlhttp.open(option.method, option.url, true)
			xmlhttp.setRequestHeader('Content-type', 'application/json')
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

const baseUrl = 'https://www.circlechat.top'
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
				if (res?.code == 0) {
					resolve(res.data)
				} else {
					log.error(res?.msg)
					// reject(res)
				}
			})
			.catch((err) => {
				reject(err)
			})
	})
}

let lng, lat
let circleList = []
let circleType = 0
let circleId
let circleInfo = {}
let circleItem
let markers = []
let layer = new AMap.LabelsLayer({
	zooms: [3, 20],
	zIndex: 1000,
	allowCollision: true
})

// 创建地图
const map = new AMap.Map('container', {
	resizeEnable: true,
	zoom: '12.3'
})

// 获取定位
AMap.plugin('AMap.Geolocation', function () {
	const geolocation = new AMap.Geolocation({
		enableHighAccuracy: true, //是否使用高精度定位，默认:true
		timeout: 10000, //超过10秒后停止定位，默认：5s
		position: 'LB', //定位按钮的停靠位置
		buttonOffset: new AMap.Pixel(10, 20), //定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
		// zoomToAccuracy: true, //定位成功后是否自动调整地图视野到定位点
		showCircle: false // 不显示精度圈
	})

	// 添加定位工具
	map.addControl(geolocation)
	geolocation.getCurrentPosition(function (status, result) {
		if (status == 'complete') {
			locateSuccess(result)
		} else {
			locateError(result)
		}
	})
})

// 定位成功
const locateSuccess = (data) => {
	lng = data.position.lng
	lat = data.position.lat
	// 地图加载完成
	map.on('complete', async function () {
		// 显示顶部工具
		document.querySelector('.operate').removeAttribute('style')
		// 监听关闭按钮点击
		onClose()
		// 监听下拉按钮点击
		onPull()
		// 监听菜单点击
		onMenu()

		// 添加缩放工具
		AMap.plugin('AMap.ToolBar', function () {
			map.addControl(new AMap.ToolBar())
		})

		// 自定义范围圈
		const circle = new AMap.Circle({
			center: new AMap.LngLat(lng, lat), // 圆心位置
			radius: 5000, // 圆半径
			fillColor: false, // 圆形填充颜色
			strokeColor: '#0093FF', // 描边颜色
			strokeWeight: 1 // 描边宽度
		})
		map.add(circle)

		// 图层添加到地图
		map.add(layer)

		circleList = await getNearlyCircle(circleType)
		getLabelMarker(circleList)

		// 监听 marker 点击
		markers.forEach((i) => {
			i.on('click', async function (e) {
				const cId = e.target._originOpts.extData.circleId
				if (cId === circleId && circleItem) {
					map.remove(circleItem)
					circleItem = null
					return
				}
				circleId = cId
				circleInfo = await getCircleInfo(circleId)
				// const position = circleInfo.geographicalPosition.split(',')
				const position = e.target._originOpts.position
				// 移除圈
				if (circleItem) map.remove(circleItem)
				// 添加圈
				circleItem = new AMap.Circle({
					center: new AMap.LngLat(position[0], position[1]), // 圆心位置
					radius: circleInfo.radius, // 圆半径
					fillColor: '#1791fc', // 圆形填充颜色
					strokeColor: '#0093FF', // 描边颜色
					strokeWeight: 1 // 描边宽度
				})
				map.add(circleItem)

				// 添加 card
				const cardHtml = template('cardTemplate', circleInfo)
				document.getElementById('card').innerHTML = cardHtml
				// 修改头像
				document.querySelector('.avatar').style.backgroundImage =
					'url("' + circleInfo.img + '")'
			})
		})
	})
}

// 定位失败
const locateError = (e) => {
	log.error(e.info)
}

// 菜单切换
const isShow = (name) => {
	const el = document.querySelector(name)
	if (!el.style.display || el.style.display === 'none') {
		el.style.display = 'block'
	} else {
		el.style.display = 'none'
	}
}

const closeCard = () => {
	let oCard = document.getElementById('card')
	if (oCard.innerHTML) oCard.innerHTML = ''
}

const toCircleDetail = () => {
	uni.navigateTo({
		url:
			'/pages/components/circle-detail/circle-detail?info=' +
			JSON.stringify(circleInfo)
	})
}

const toCircleChat = (info) => {
	uni.redirectTo({
		url: '/pages/components/chat/chat?circleId=' + info.circleId
	})
}

const toJoinCircle = async () => {
	try {
		await joinCircle(circleInfo.circleId)
		log.success('加入成功')
		setTimeout(() => {
			toCircleChat(circleInfo)
		}, 500)
	} catch (error) {
		log.error(JSON.stringify(error))
	}
}

// 监听关闭按钮点击事件
const onClose = () => {
	const close = document.querySelector('.close')
	close.onclick = () => uni.navigateBack()
}

// 监听下拉按钮点击
const onPull = () => {
	const pull = document.querySelector('.pull')
	pull.onclick = () => isShow('.menu')
}

// 监听菜单的点击
const onMenu = () => {
	const typeList = document.querySelectorAll('#circleType li')
	typeList.forEach((item, index) => {
		item.onclick = async () => {
			if (index === circleType) return
			layer.remove(markers)
			circleType = index
			circleList = await getNearlyCircle(circleType)
			getLabelMarker(circleList)
		}
	})
}

function getNearlyCircle(type) {
	return $request('/circle/nearlyCircle', {
		params: {
			type
		}
	})
}

function getCircleInfo(circleId) {
	return $request('/circle/queryByCircleId', {
		params: {
			circleId
		}
	})
}

function joinCircle(circleId) {
	return $request('/circle/enterCircle', {
		method: 'POST',
		data: {
			circleId
		}
	})
}

function getLabelMarker(list) {
	const icon = {
		type: 'image',
		image: 'https://webapi.amap.com/theme/v1.3/markers/n/mark_b.png',
		size: [18, 27],
		anchor: 'bottom-center'
	}

	const textStyle = {
		fontSize: 10,
		fontWeight: 'normal',
		fillColor: '#22886f',
		strokeColor: '#fff',
		strokeWidth: 2,
		fold: true,
		padding: '5, 25'
	}

	const LabelsData = list.map((i) => {
		return {
			position: i.geographicalPosition.split(','),
			zooms: [11, 20],
			icon,
			text: {
				content: i.circleName,
				direction: 'right',
				offset: [-20, -5],
				style: textStyle
			},
			extData: {
				circleId: i.circleId
			}
		}
	})

	LabelsData.forEach((item) => {
		const labelMarker = new AMap.LabelMarker(item)
		markers.push(labelMarker)
	})
	layer.add(markers)
}
