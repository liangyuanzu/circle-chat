# circle-chat（圈聊）

用 uni-app 开发的一款跨平台附近聊天交友产品，目前百度小程序已结项。与其他附近交友产品的不同点在于产品创新的三种圈类型--“交友圈”、“固定圈”、“紧急圈”，交友圈用于日常聊天交友，固定圈用于商家入驻，紧急圈用于发布紧急事务。

## 技术栈

uni-app(vue + vuex) + ColorUI + uViewUI  
基于 websocket 协议

## 项目结构

```
- api		// 项目接口
- colorui	// 样式库
- components
    - custom-xxx	// 自定义组件
    - uni-xxx		// 官方组件
    - xxx			// 其他组件
- config	// 配置文件
- helpers	// 自定义工具库
- hybrid	// 混合开发(本项目中用于引入地图 jsapi)
- pages
    - circle		// 附近的圈页面
    - components	// 其他页面
    - login			// 登录页面
    - me			// "我的" 页面
    - msg			// 消息页面
- static	// 静态文件
- store		// vuex 数据中心
- utils		// 插件库
- uview-ui	// 样式库
```

## 安装

需要先安装 Hbuilder X(必须)，并安装 sass/scss 插件。运行到微信端需安装微信开发者工具，运行到百度小程序则需要安装百度开发者工具。

## 运行

本项目没有使用命令行来运行项目，可直接在 Hbuilder X 菜单栏中点击需要运行的平台。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/bc6c2e1b30144d31881b6bac95c5eff6~tplv-k3u1fbpfcp-watermark.image)

## 项目截图

### 百度小程序

<img src="https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1baa2776535e46a8b54c2e81d7d17cd0~tplv-k3u1fbpfcp-watermark.image" width="30%" style="margin-right: 10px"/>

<img src="https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3fc725f59e8e4250b71cad491517e2e8~tplv-k3u1fbpfcp-watermark.image" width="30%" style="margin-right: 10px"/>

<img src="https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f47d31fb3d21426085289885162e1ec4~tplv-k3u1fbpfcp-watermark.image" width="30%" style="margin-right: 10px"/>

## 功能列表

- 登录/注册/忘记密码
- 个人信息
- 关注/取消关注
- 加入圈/退出圈/搜索圈/创建圈...
- 单聊/群聊
- 发送文本/图片/语音/表情
- 智能机器人
- 心跳&重连机制
- 查看附近的圈
- 更新圈信息(圈头像/公告/圈简介...)
- 地图模式
- 圈相册(固定圈)
- 寻人/寻物启示(紧急圈)

## 待开发

多端兼容（h5 + app + 微信小程序）

## License

MIT
