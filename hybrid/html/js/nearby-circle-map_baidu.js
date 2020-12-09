// 获取位置信息
const position = {
	lng: +getQueryVariable('lng') || 116.397031,
	lat: +getQueryVariable('lat') || 39.917842
}
// 获取 sessionId
const sessionId = getQueryVariable('sessionId')
localStorage.setItem('sessionId', sessionId)

let markers = []
let markerPoints = []
let markerClusterer = null
let circleType = 0
let circleList = []
let circleInfo = {}

let map = new BMap.Map('allmap')
const point = new BMap.Point(position.lng, position.lat)
let centerPoint = null

new Promise((resolve, reject) => {
	// 坐标转换
	new BMap.Convertor().translate([point], 3, 5, (data) => {
		if (data.status === 0) {
			centerPoint = new BMap.Point(data.points[0].lng, data.points[0].lat)
			map.centerAndZoom(centerPoint, 15)
			map.enableScrollWheelZoom(true) // 开启鼠标滚轮缩放
			resolve()
		}
	})
}).then(() => {
	;(function () {
		// 添加定位 marker
		var centerIcon = new BMap.Icon(
			'https://huiyan.baidu.com/cms/images/DrawingManager/circenter.png',
			new BMap.Size(20, 20)
		)
		centerIcon.setImageSize(new BMap.Size(20, 20))
		var centerMarker = new BMap.Marker(centerPoint, { enableMassClear: false })
		centerMarker.setIcon(centerIcon)
		centerMarker.setZIndex(99999999)
		map.addOverlay(centerMarker)

		// 添加控件
		map.addControl(new BMap.ScaleControl()) // 添加比例尺控件
		map.addControl(new BMap.NavigationControl()) // 添加缩放控件

		// 添加 marker
		getNearlyCircle(circleType).then((res) => {
			getMarkers(res)
		})
	})()
})

// marker 点击
async function markerClick(point, cId) {
	const allOverlay = map.getOverlays() // 获取所有覆盖物
	const circle = allOverlay.filter(
		(i) =>
			i.point && i.Da && i.point.lng === point.lng && i.point.lat === point.lat
	)
	if (circle.length === 0) {
		circleInfo = await getCircleInfo(cId)
		map.clearOverlays()
		// 添加圈
		const circlePoint = new BMap.Point(point.lng, point.lat)
		const circleItem = new BMap.Circle(circlePoint, circleInfo.radius, {
			strokeColor: formatCircleColor(circleInfo.type),
			strokeWeight: 2,
			strokeOpacity: 0.5,
			fillColor: ''
		})
		map.addOverlay(circleItem)
		// 调整视角
		setCircleBestViewport(circlePoint, circleInfo.radius)

		// 添加卡片
		const cardHtml = template('cardTemplate', circleInfo)
		document.getElementById('card').innerHTML = cardHtml
		// 修改头像
		document.querySelector('.avatar').style.backgroundImage =
			'url("' + circleInfo.img + '")'

		// 给卡片注册事件
		cardOperate()()
	} else {
		map.clearOverlays()
		return
	}
}

// 格式化圈颜色
function formatCircleColor(type) {
	if (type === '交友圈') return 'blue'
	if (type === '固定圈') return 'orange'
	if (type === '紧急圈') return 'red'
}

// 关闭按钮点击
const oClose = document.querySelector('.close')
oClose.onclick = () => {
	uni.navigateBack()
}

// 下拉菜单点击
const oPull = document.querySelector('.pull')
oPull.onclick = () => {
	const el = document.querySelector('.menu')
	if (!el.style.display || el.style.display === 'none') {
		el.style.display = 'block'
	} else {
		el.style.display = 'none'
	}
}

// 监听菜单的点击
const typeList = document.querySelectorAll('#circleType li')
typeList.forEach((item, index) => {
	item.onclick = async () => {
		if (index === circleType) return

		// 清除覆盖物
		map.clearOverlays()
		markers.map((i) => {
			map.removeOverlay(i)
		})
		markers = []
		if (markerClusterer) markerClusterer.clearMarkers()

		circleType = index
		circleList = await getNearlyCircle(circleType)
		getMarkers(circleList)
	}
})

// 卡片相关操作
function cardOperate() {
	// 关闭卡片
	const closeCard = document.getElementById('closeCard')
	closeCard.onclick = () => {
		const oCard = document.getElementById('card')
		if (oCard.innerHTML) oCard.innerHTML = ''
	}

	// 跳转至详情页
	const toCircleDetail = document.getElementById('toCircleDetail')
	toCircleDetail.onclick = () => {
		uni.navigateTo({
			url:
				'/pages/components/circle-detail/circle-detail?circleId=' +
				circleInfo.circleId
		})
	}

	// 加入圈
	const toJoinCircle = document.getElementById('toJoinCircle')
	toJoinCircle.onclick = async () => {
		try {
			await joinCircle(circleInfo.circleId)
			alert('加入成功')
			setTimeout(() => {
				uni.redirectTo({
					url: '/pages/components/chat/chat?circleId=' + circleInfo.circleId
				})
			}, 500)
		} catch (error) {
			alert(JSON.stringify(error))
		}
	}
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

function getMarkers(list) {
	const markersData = list.map((i) => {
		return {
			position: i.geographicalPosition.split(','),
			circleId: i.circleId,
			circleName: i.circleName
		}
	})

	markersData.forEach((i) => {
		const point = new BMap.Point(i.position[0], i.position[1])
		// 坐标转换
		new BMap.Convertor().translate([point], 3, 5, (data) => {
			if (data.status === 0) {
				// 收集 marker 坐标
				const markerPoint = new BMap.Point(
					data.points[0].lng,
					data.points[0].lat
				)
				markerPoints.push(markerPoint)

				const marker = new BMap.Marker(data.points[0], {
					enableMassClear: false
				})
				const label = new BMap.Label(i.circleName, {
					offset: new BMap.Size(20, -10)
				})
				marker.setLabel(label)
				marker.addEventListener('click', function (e) {
					markerClick(e.target.point, i.circleId)
				})
				markers.push(marker)
				// 点聚合
				if (markerClusterer) markerClusterer.clearMarkers()
				markerClusterer = new BMapLib.MarkerClusterer(map, { markers })

				// 调整视野
				const view = map.getViewport(eval(markerPoints))
				map.centerAndZoom(centerPoint, view.zoom)
			}
		})
	})
}

/**
 * 设置圆覆盖物最佳视角
 * @param {Point} point 百度坐标点对象
 */
function setCircleBestViewport(point, radius) {
	let zoom = 20 //地图层级数（百度地图默认为19层，这里多加1层使下面通过直径的运算刚好可以得出地图对应的层级）
	let num = 20 //基数
	let diameter = radius * 2 //直径
	while (num < diameter) {
		num = num * 2
		zoom--
	}
	map.centerAndZoom(point, zoom + 2) //设置中心点和缩放层级，为了优化显示效果此处zoom多加2级
}

// 获取参数
function getQueryVariable(str) {
	const s = window.location.search
	let tmp = []
	let value = ''
	if (s) {
		tmp = s.substr(1).split('&')
	}
	for (const i of tmp) {
		if (i.substring(0, i.indexOf('=')) === str) {
			value = i.substr(i.indexOf('=') + 1)
			break
		}
	}
	return value
}
