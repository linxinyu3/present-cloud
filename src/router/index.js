import Vue from 'vue'
import Router from 'vue-router'
import login from '../views/login/login.vue'
import signup from '../views/login/signup.vue'
import forgetPassword from '@/views/login/forgetPassword'
import home from '../views/home/index.vue'
import information from '../views/information/index.vue'
import layout from '../layout/layout.vue' 
import form from '../views/form/index.vue'

Vue.use(Router)

export const router = new Router({
  // mode:'history',
  routes: [
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
        requireAuth: true
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
            requireAuth: true
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
    {
      path: '/',
      name: 'form',
      redirect: '/form',
      component: layout,
      alwaysShow: true,
      meta: {
        title: 'form',
        icon: 'el-icon-tickets',
        roles: ['admin', 'editor'] // you can set roles in root nav
      },
      children: [{
        path: '/form',
        component: form,
        name: 'form',
        meta: {
          title: '基础表单模板',
          roles: ['admin', 'editor'] // you can set roles in root nav
        },
      }]
    },
    {
      path: '/error',
      component: layout,
      redirect: 'noRedirect',
      name: 'ErrorPages',
      // hidden: true,
      meta: {
        title: 'Error Pages',
        icon: 'el-icon-warning-outline',
      },
      children: [
        {
          path: '403',
          component: () => import('../views/errorPage/403'),
          name: 'Page403',
          meta: { title: '403', noCache: true }
        },
        {
          path: '404',
          component: () => import('../views/errorPage/404'),
          name: 'Page404',
          meta: { title: '404', noCache: true }
        },
        {
          path: '500',
          component: () => import('../views/errorPage/500'),
          name: 'Page500',
          meta: { title: '500', noCache: true }
        },
      ]
    },
  ]
})

router.beforeEach((to, from, next) => {
  if (to.meta.requireAuth) {  // 判断该路由是否需要登录权限
    if (localStorage.Authorization) {  // 获取当前的token是否存在
      console.log("token存在");
      routerGo();
      next();
    } else {
      console.log("token不存在");
      next({
        path: '/login', // 将跳转的路由path作为参数，登录成功后跳转到该路由
        query: {redirect: to.fullPath}
      })
    }
  }
  else { // 如果不需要权限校验，直接进入路由界面
    next();
  }
});

function routerGo() {
  
  var menuList = JSON.parse(localStorage.getItem('menuList'));
  menuList =  menuList.children
  console.log(menuList[0])
  if (menuList != null) {
    for (var i = 0; i < menuList.length; i++) {
      // 创建路由配置
      const url = menuList[i].url
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
          component: () => import ('../views/' + menuList[i].component),
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