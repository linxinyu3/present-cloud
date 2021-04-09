// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import ElementUI from 'element-ui'
import Message from 'element-ui'
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
  (success) => {
    // 200接受数据成功，如果错误  包含错误码和错误消息  如果成功也直接打印成功的信息  就不用在页面逻辑里面打印成功or失败信息了
    if (success.status && success.status == 200) {
      // 如果是500 401 403消息  就直接弹出提示后端提供的消息 然后直接return 就啥数据也不返回
      if (
        success.data.code == 500 ||
        success.data.code == 401 ||
        success.data.code == 403
      ) {
        Message.error({ message: success.data.message })
        return
      }
      // 如果有消息就直接打印成功的消息
      if (success.data.message) {
        Message.success({ message: success.data.message })
      }
    }
    // 直接返回数据
    return success.data
  },
  (error) => {
    if (error.response.statusCode == 504 || error.response.statusCode == 404) {
      Message.error({ message: '服务器被吃了o(╯□╰)o' })
    } else if (error.response.statusCode == 403) {
      Message.error({ message: '权限不足，请联系管理员' })
    } else if (error.response.statusCode == 401) {
      Message.error({ message: '尚未登录，请登录' })
      localStorage.removeItem('Authorization');
      localStorage.removeItem('isLogin');
      router.replace('/login');
    } else {
      if (error.response.data.message) {
        Message.error({ message: error.response.data.message })
      } else {
        Message.error({ message: '未知错误' })
      }
    }
    return
  }
)
// axios.interceptors.response.use(
//   response => {
//     if (response.status === 200) {
//       if (response.data.respCode == "401") {
//           localStorage.removeItem('Authorization');
//           localStorage.removeItem('isLogin');
//           router.replace('/login');
//       }
//       return response;
//     } else {
//         if (response.status == 401) {
//             localStorage.removeItem('Authorization');
//             localStorage.removeItem('isLogin');
//             router.replace('/login');
//         } else if (response.status != 500 && response.status != 403 && response.status != 404) {
//             // 错误处理
//             response.status = 'error'
//         }
//         return Promise.reject(response.status) // 必须返回
//       }
//   },
// );

new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
