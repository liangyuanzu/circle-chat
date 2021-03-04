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
		/*
		const circle = new AMap.Circle({
			center: new AMap.LngLat(lng, lat), // 圆心位置
			radius: 5000, // 圆半径
			fillColor: false, // 圆形填充颜色
			strokeColor: '#0093FF', // 描边颜色
			strokeWeight: 1 // 描边宽度
		})
		map.add(circle)
		 */

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

				// 给卡片注册事件
				cardOperate()
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
	if (!circleInfo.inCircle) {
		const toJoinCircle = document.getElementById('toJoinCircle')
		toJoinCircle.onclick = async () => {
			try {
				await joinCircle(circleInfo.circleId)
				log.success(e.info)
				setTimeout(() => {
					uni.redirectTo({
						url:
							'/pages/components/chat/chat?circleInfo=' +
							encodeURIComponent(JSON.stringify(circleInfo))
					})
				}, 500)
			} catch (error) {
				log.info(JSON.stringify(error))
			}
		}
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
