
// #ifndef VUE3
import Vue from 'vue'
import App from './App'
import uView from './uview-ui'

//####    全局配置   ######
const msg = (title, icon='none', duration=1500, mask=false)=>{
	//统一提示方便全局修改
	if(Boolean(title) === false){
		return;
	}
	uni.showToast({
		title,
		duration,
		mask,
		icon
	});
}


Vue.use(uView)
Vue.config.productionTip = false
Vue.prototype.$api = {msg};

App.mpType = 'app'

const app = new Vue({
    ...App
})
app.$mount()
// #endif

// #ifdef VUE3
import { createSSRApp } from 'vue'
import App from './App.vue'
export function createApp() {
  const app = createSSRApp(App)
  return {
    app
  }
}
// #endif