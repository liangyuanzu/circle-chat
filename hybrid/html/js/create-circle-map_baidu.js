// 获取位置信息
const position = {
  lng: +getQueryVariable('lng') || 116.403414,
  lat: +getQueryVariable('lat') || 39.924091
}

var map = new BMapGL.Map('container') // 创建Map实例,GL版命名空间为BMapGL(鼠标右键控制倾斜角度)
const point = new BMapGL.Point(position.lng, position.lat)
map.centerAndZoom(point, 15) // 初始化地图,设置中心点坐标和地图级别
map.enableScrollWheelZoom(true) // 开启鼠标滚轮缩放
map.disableDragging() // 禁止拖动地图

// 添加 marker
var centerIcon = new BMapGL.Icon(
  'https://huiyan.baidu.com/cms/images/DrawingManager/circenter.png',
  new BMapGL.Size(20, 20)
)
centerIcon.setImageSize(new BMapGL.Size(20, 20))
var centerMarker = new BMapGL.Marker(point)
centerMarker.setIcon(centerIcon)
centerMarker.disableDragging()
map.addOverlay(centerMarker)

var scaleCtrl = new BMapGL.ScaleControl() // 添加比例尺控件
map.addControl(scaleCtrl)
var zoomCtrl = new BMapGL.ZoomControl() // 添加缩放控件
map.addControl(zoomCtrl)

var styleOptions = {
  strokeColor: '#5E87DB', // 边线颜色
  fillColor: '#5E87DB', // 填充颜色。当参数为空时，圆形没有填充颜色
  strokeWeight: 2, // 边线宽度，以像素为单位
  strokeOpacity: 1, // 边线透明度，取值范围0-1
  fillOpacity: 0.2 // 填充透明度，取值范围0-1
}
var labelOptions = {
  borderRadius: '2px',
  background: '#FFFBCC',
  border: '1px solid #E1E1E1',
  color: '#703A04',
  fontSize: '12px',
  letterSpacing: '0',
  padding: '5px'
}

// 实例化鼠标绘制工具
var drawingManager = new BMapGLLib.DrawingManager(
  map,
  {
    isOpen: true, // 是否开启绘制模式
    enableCalculate: false, // 绘制是否进行测距测面
    enableSorption: true, // 是否开启边界吸附功能
    sorptiondistance: 20, // 边界吸附距离
    circleOptions: styleOptions, // 圆的样式
    labelOptions: labelOptions // label样式
  },
  position
)

// 设置绘制类型
drawingManager.setDrawingMode(BMAP_DRAWING_CIRCLE)

// 监听画圆完成事件
drawingManager.addEventListener('circlecomplete', ({ radius }) => {
  if (radius <= 10000) {
    uni.redirectTo({
      url: `/pages/components/create-circle/create-circle?radius=${radius.toFixed(0)}`
    })
  } else {
    alert('圈最大范围为10000米')
    uni.navigateBack()
  }
})

// 绑定拖拽地图事件
const oStart = document.getElementById('startDragging')
const oEnd = document.getElementById('endDragging')
oStart.onclick = () => map.enableDragging()
oEnd.onclick = () => map.disableDragging()

// 关闭按钮点击
const oClose = document.querySelector('.close')
oClose.onclick = () => uni.navigateBack()

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

// 跳转至极简模式
const oSimple = document.getElementById('simple')
oSimple.onclick = () => {
  uni.redirectTo({
    url: `/pages/components/create-circle/create-circle`
  })
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
