let lng, lat

// 创建地图
const map = new AMap.Map('container', {
	resizeEnable: true,
	zoom: '15'
})

// 获取定位
AMap.plugin('AMap.Geolocation', function () {
	const geolocation = new AMap.Geolocation({
		enableHighAccuracy: true, //是否使用高精度定位，默认:true
		timeout: 10000, //超过10秒后停止定位，默认：5s
		position: 'LB', //定位按钮的停靠位置
		buttonOffset: new AMap.Pixel(10, 20), //定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
		zoomToAccuracy: true, //定位成功后是否自动调整地图视野到定位点
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
		// 显示顶部提示信息
		document.querySelector('.info').removeAttribute('style')
		// 显示底部操作卡片
		document.querySelector('.input-card').removeAttribute('style')

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

		// 添加范围圈
		circleRange()
	})
}

// 定位失败
const locateError = (e) => log.info(e.info)

// 显示 / 隐藏
const isShow = (name) => {
	const el = document.querySelector(name)
	if (!el.style.display || el.style.display === 'none') {
		el.style.display = 'block'
	} else {
		el.style.display = 'none'
	}
}

// 监听关闭按钮点击事件
const onClose = () => {
	const close = document.querySelector('.close')
	close.onclick = (e) => {
		uni.navigateBack()
	}
}

// 监听下拉按钮点击
const onPull = () => {
	const pull = document.querySelector('.pull')
	pull.onclick = () => {
		isShow('.menu')
	}
}

// 监听菜单的点击
const onMenu = () => {
	const smple = document.querySelector('#smple')
	smple.onclick = (e) => {
		e.stopPropagation()
		const position = lng + ',' + lat
		uni.navigateTo({
			url: `/pages/components/create-circle/create-circle?position=${position}`
		})
	}
}

// 范围圈
const circleRange = () => {
	// 添加范围圈
	let circle = new AMap.Circle({
		center: [lng, lat],
		radius: 500, //半径
		borderWeight: 3,
		strokeColor: '#FF33FF',
		strokeOpacity: 1,
		strokeWeight: 6,
		fillOpacity: 0.4,
		strokeStyle: 'dashed',
		strokeDasharray: [10, 10],
		// 线样式还支持 'dashed'
		fillColor: '#1791fc',
		zIndex: 50
	})

	map.add(circle)
	// 缩放地图到合适的视野级别
	map.setFitView([circle])

	window.circleEditor = new AMap.CircleEditor(map, circle)

	circleEditor.on('move', function (event) {
		// log.info('触发事件：move')
	})

	circleEditor.on('adjust', function (event) {
		// log.info('触发事件：adjust')
	})

	circleEditor.on('end', function (event) {
		// log.info('触发事件： end')
		// event.target 即为编辑后的圆形对象
		const { center, radius } = event.target._opts
		if (radius <= 2000) {
			uni.navigateTo({
				url: `/pages/components/create-circle/create-circle?position=${center}&radius=${radius}`
			})
		} else {
			log.info('圈最大范围为2000米')
		}
	})
}
