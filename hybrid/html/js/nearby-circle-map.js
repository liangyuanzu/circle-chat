let lng, lat

// 创建地图
const map = new AMap.Map('container', {
	resizeEnable: true,
	zoom: '12'
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
	map.on('complete', function () {
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

		var markers = []
		var layer = new AMap.LabelsLayer({
			zooms: [3, 20],
			zIndex: 1000,
			allowCollision: true
		})

		layer.add(markers)
		// 图层添加到地图
		map.add(layer)

		// 初始化 labelMarker
		LabelsData.forEach((item, index) => {
			item.extData = {
				index
			}
			const labelMarker = new AMap.LabelMarker(item)
			markers.push(labelMarker)
		})
		// 将 marker 添加到图层
		layer.add(markers)

		map.setFitView(null, false, [100, 100, 10, 10])
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
		item.onclick = () => {
			console.log(index)
		}
	})
}

// $request('/circle/nearlyCircle', {
// 	params: {
// 		type: 0
// 	}
// }).then((res) => {
// 	alert(JSON.stringify(res))
// })
