import Vue from 'vue'
import App from './App'

// 引入 uview-ui
import uView from "uview-ui";
Vue.use(uView);

import cuCustom from './colorui/components/cu-custom.vue'
Vue.component('cu-custom',cuCustom)

import { http } from '@/common/service.js' 
Vue.prototype.$http = http

Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
    ...App
})
app.$mount()
