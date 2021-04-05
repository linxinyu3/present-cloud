// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import './css/all.css'
import './icons'
import axios from 'axios'

Vue.prototype.$axios=axios;
// Vue.prototype.$http=axios;
Vue.use(ElementUI);
Vue.config.productionTip = false
/* eslint-disable no-new */

axios.defaults.timeout = 8000;
// http request 拦截器
axios.interceptors.request.use(
  config => {
    if (localStorage.Authorization) { //判断token是否存在
      config.headers.Authorization = localStorage.Authorization;  //将token设置成请求头
    }
    return config;
  },
  err => {
    return Promise.reject(err);
  }
);

// http response 拦截器
axios.interceptors.response.use(
  response => {
    if (response.status === 200) {
      if (response.data.respCode == "401") {
          localStorage.removeItem('Authorization');
          localStorage.removeItem('isLogin');
          router.replace('/login');
      }
      return response;
    } else {
        if (response.status == 401) {
            localStorage.removeItem('Authorization');
            localStorage.removeItem('isLogin');
            router.replace('/login');
        } else if (response.status != 500 && response.status != 403 && response.status != 404) {
            // 错误处理
            response.status = 'error'
        }
        return Promise.reject(response.status) // 必须返回
      }
  },
);

new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
