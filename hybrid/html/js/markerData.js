// 设置一个图标对象
const icon = {
	// 图标类型，现阶段只支持 image 类型
	type: 'image',
	// 图片 url
	image:
		'https://a.amap.com/jsapi_demos/static/demo-center/marker/express2.png',
	// 图片尺寸
	size: [64, 30],
	// 图片相对 position 的锚点，默认为 bottom-center
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

const LabelsData = [
	{
		position: [115.032062, 27.111823],
		zooms: [11, 20],
		icon,
		text: {
			content: '丰巢快递柜-花家地北里',
			direction: 'right',
			offset: [-20, -5],
			style: textStyle
		}
	},
	{
		position: [114.985403, 27.114911],
		zooms: [11, 20],
		icon,
		text: {
			content: '丰巢快递柜-中环南路11号院',
			direction: 'right',
			offset: [-20, -5],
			style: textStyle
		}
	},
	{
		position: [115.046514, 27.073037],
		zooms: [11, 20],
		icon,
		text: {
			content: 'E栈快递柜-夏都家园',
			direction: 'right',
			offset: [-20, -5],
			style: textStyle
		}
	}
]
