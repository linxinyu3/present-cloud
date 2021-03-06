import Vue from 'vue'
import Router from 'vue-router'
import login from '../views/login/login.vue'
import signup from '../views/login/signup.vue'
import forgetPassword from '@/views/login/forgetPassword'
import home from '../views/home/index.vue'
import information from '../views/information/index.vue'
import layout from '../layout/layout.vue' 
import form from '../views/form/index.vue'
import errorpage403 from '../views/errorPage/403.vue'
import errorpage404 from '../views/errorPage/404.vue'
import errorpage500 from '../views/errorPage/500.vue'
import axios from 'axios'
Vue.use(Router)

export const router = new Router({
  mode:'hash',
  routes: [
    { path: '/', redirect: '/login', hidden: true },
    {
      path: '/login',
      name: 'login',
      component: login,
      hidden: true
    },
    {
      path: '/signup',
      name: 'signup',
      component: signup,
      hidden: true
    },
    {
      path: '/forgetPassword',
      name: 'forgetPassword',
      component: forgetPassword,
      hidden: true
    },
    {
      path: '/',
      component: layout,
      isShow: true,
      redirect: '/home',
      name: 'home',
      meta: {
        title: '主页',
        icon: 'el-icon-s-home',
        roles: ['admin', 'editor'], // you can set roles in root nav
        // requireAuth: true
      },
      children: [
        {
          path: '/home',
          component: home,
          name: 'home',
          meta: {
            title: '主页',
            icon: 'el-icon-s-home',
            roles: ['admin'], // or you can only set roles in sub nav
            // requireAuth: true
          }
        },
      ]
    },
    {
      path: '/',
      component: layout,
      redirect: '/information',
      name: 'information',
      isShow: true,
      children: [{
        path: 'information',
        component: information,
        name: 'information',
        meta: { 
          title: '个人信息', 
          icon: 'el-icon-user', 
          noCache: false,
          // requireAuth: true,  // 该路由项需要权限校验
      }
      }]
    },
  ]
})
var flag = true
router.beforeEach((to, from, next) => {
  if(to.path == '/login' || to.path == '/signup' || to.path == '/forgetPassword'){
    next();
    return;
  }
  if(from.path == '/login' && to.path == '/home'){
    flag = false;
    routerGoHome();
    next()
  }
  if(flag){
    flag = false;
    routerGo();
    next(to.path);
  }
  else{
    next();
  }
});

function menuListInit(){
    //初始化菜单
    var data = [{
      icon: '',
      name: '',
      roles: '',
      url: '',
      children: [{
        name: '',
        url: ''
      }, {
        name: '',
        url: ''
      }]
    }]
    if (localStorage.getItem('menuList') == null || localStorage.getItem('menuList') == undefined) {
      localStorage.setItem('menuList', JSON.stringify(data))
    }
}

function routerGo() {
  menuListInit();
  axios.get('/menu/currentUser').then(res=>{
    if(res){
      var data = res[0];
      localStorage.setItem('menuList', JSON.stringify(data));
      var menuList = JSON.parse(localStorage.getItem('menuList'));
      menuList =  menuList.children
      if (menuList != null) {
        for (var i = 0; i < menuList.length; i++) {
          // 创建路由配置
          const Component = menuList[i].component
          var route = {
            path: '/',
            component: layout,
            redirect: '',
            name: menuList[i].name,
            meta: {
              title: menuList[i].name,
              icon: menuList[i].iconCls,
              requireAuth: menuList[i].requireAuth
            },
            children: [{
              path: menuList[i].path,
              component: () =>
                            import('../views/' + Component + '/index.vue'),
              name: menuList[i].name,
              meta: {
                title: menuList[i].name,
                icon: menuList[i].iconCls,
                requireAuth: menuList[i].requireAuth
              },
            }]
          }
          router.options.routes.push(route)
        }
      }
      router.addRoutes(router.options.routes)
    }
  })    
}
function routerGoHome() {
  menuListInit();
  axios.get('/menu/currentUser').then(res=>{
    if(res){
      var data = res[0];
      localStorage.setItem('menuList', JSON.stringify(data));
    }
  })    
  var menuList = JSON.parse(localStorage.getItem('menuList'));
  menuList =  menuList.children
  if (menuList != null) {
    for (var i = 0; i < menuList.length; i++) {
      // 创建路由配置
      const Component = menuList[i].component
      var route = {
        path: '/',
        component: layout,
        redirect: '',
        name: menuList[i].name,
        meta: {
          title: menuList[i].name,
          icon: menuList[i].iconCls,
          requireAuth: menuList[i].requireAuth
        },
        children: [{
          path: menuList[i].path,
          component: () =>
                        import('../views/' + Component + '/index.vue'),
          name: menuList[i].name,
          meta: {
            title: menuList[i].name,
            icon: menuList[i].iconCls,
            requireAuth: menuList[i].requireAuth
          },
        }]
      }
      router.options.routes.push(route)
    }
  }
  router.addRoutes(router.options.routes)
}
export default router