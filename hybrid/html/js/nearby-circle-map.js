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

		// 创建 Marker 实例
		/*
		var markers = []
		var positions = [
			[116.353773, 40.001806],
			[116.356738, 39.998682],
			[116.3501, 39.998074]
		]

		for (var i = 0, marker; i < positions.length; i++) {
			marker = new AMap.Marker({
				map: map,
				position: positions[i],
				icon:
					'https://a.amap.com/jsapi_demos/static/demo-center/icons/poi-marker-default.png',
				offset: new AMap.Pixel(-13, -30),
				label: {
					//设置文本标注内容
					content: `<div class='lable'>
												<div class='info'>
													<p>圈名称</p>
													<p>人数：999</p>
												</div>
												<div class='range'>范围：100m</div>
												<div class='operation'>
													<button id='view_detail'>查看详情</button>
													<button id='join'>加入</button>
												</div>
											</div>`,
					direction: 'top' //设置文本标注方位
				}
			})
			markers.push(marker)

			// 监听 Marker 点击
			marker.on('click', function (ev) {
				const lable = ev.target.dom.querySelector('.amap-marker-label')
				if (!lable.style.display || lable.style.display === 'none') {
					// 排它
					const lables = document.querySelectorAll('.amap-marker-label')
					lables.forEach((lable) => (lable.style.display = 'none'))
					// 切换
					lable.style.display = 'block'
					// 显示范围圈
					const circle = new AMap.Circle({
						center: new AMap.LngLat(116.353773, 40.001806), // 圆心位置
						radius: 100, // 圆半径
						fillColor: false, // 圆形填充颜色
						strokeColor: '#0093FF', // 描边颜色
						strokeWeight: 1 // 描边宽度
					})
					map.add(circle)

					// 监听查看详情按钮点击
					const viewDetail = document.querySelector('#view_detail')
					viewDetail.onclick = (e) => {
						e.stopPropagation()
						console.log('点击')
					}
				} else {
					lable.style.display = 'none'
				}
			})
		}
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
			})
		})
	})
}

// 定位失败
const locateError = (e) => {
	alert(e.info)
}

// 显示 / 隐藏
const isShow = (name) => {
	const el = document.querySelector(name)
	if (!el.style.display || el.style.display === 'none') {
		el.style.display = 'block'
	} else {
		el.style.display = 'none'
	}
}

// 监听 Marker 点击 (待定)
/*
	const onMarker = () => {
		const list = document.querySelectorAll('.amap-marker')
		const markers = []
		list.forEach(item => {
			if (item.querySelector('.amap-icon')) {
				markers.push(item)
			}
		})

		markers.forEach(item => {
			item.onclick = e => {
				console.log(e.target)
			}
		})
	}
	*/

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

function getLabelMarker(list) {
	const icon = {
		type: 'image',
		image:
			'https://a.amap.com/jsapi_demos/static/demo-center/marker/express2.png',
		size: [64, 30],
		anchor: 'center'
	}

	const textStyle = {
		fontSize: 12,
		fontWeight: 'normal',
		fillColor: '#22886f',
		strokeColor: '#fff',
		strokeWidth: 2,
		fold: true,
		padding: '2, 5'
	}

	/*
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
	*/
	const LabelsData = [
		{
			position: [115.032062, 27.111823],
			zooms: [12, 20],
			icon,
			text: {
				content: '丰巢快递柜-花家地北里',
				direction: 'right',
				offset: [-20, -5],
				style: textStyle
			},
			extData: {
				circleId: 100001
			}
		},
		{
			position: [114.985403, 27.114911],
			zooms: [12, 20],
			icon,
			text: {
				content: '丰巢快递柜-中环南路11号院',
				direction: 'right',
				offset: [-20, -5],
				style: textStyle
			},
			extData: {
				circleId: 100002
			}
		},
		{
			position: [115.046514, 27.073037],
			zooms: [12, 20],
			icon,
			text: {
				content: 'E栈快递柜-夏都家园',
				direction: 'right',
				offset: [-20, -5],
				style: textStyle
			},
			extData: {
				circleId: 100003
			}
		}
	]

	// 初始化 labelMarker
	LabelsData.forEach((item) => {
		const labelMarker = new AMap.LabelMarker(item)
		markers.push(labelMarker)
	})
	layer.add(markers)
}
