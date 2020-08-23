import Vue from 'vue'
import App from './App'
import uView from "uview-ui";
import cuCustom from './colorui/components/cu-custom.vue'
import { http } from '@/common/service.js'
import store from './store'

Vue.use(uView);
Vue.component('cu-custom',cuCustom)
Vue.prototype.$http = http
Vue.prototype.$store = store

Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
	...App
})
app.$mount()
