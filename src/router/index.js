import Vue from 'vue'
import Router from 'vue-router'
import login from '../views/login/login.vue'
import signup from '../views/login/signup.vue'
import forgetPassword from '@/views/login/forgetPassword'
import home from '../views/home/index.vue'
import information from '../views/information/index.vue'
import layout from '../layout/layout.vue' 
import pageone from '../views/pageone/index.vue'
import schoolManage from '../views/schoolManage/index.vue'
import form from '../views/form/index.vue'
Vue.use(Router)

export const router = new Router({
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
      redirect: '/information',
      name: 'information',
      isShow: true,
      children: [{
        path: 'information',
        component: information,
        name: 'information',
        meta: { title: '个人信息', icon: 'el-icon-user', noCache: false }

      }]
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
        roles: ['admin', 'editor'] // you can set roles in root nav
      },
      children: [
        {
          path: '/home',
          component: home,
          name: 'home',
          meta: {
            title: '主页',
            icon: 'el-icon-s-home',
            roles: ['admin'] // or you can only set roles in sub nav
          }
        },
        
      ]
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
      path: '/',
      component: layout,
      alwaysShow: true,
      redirect: '/pageone',
      name: 'pageone',
      meta: {
        title: '导航一',
        icon: 'el-icon-guide',
        roles: ['admin', 'editor'] // you can set roles in root nav
      },
      children: [
        {
          path: '/pageone',
          component: pageone,
          name: 'pageone',
          meta: {
            title: '页面一',
            icon: 'el-icon-education',
            roles: ['admin'] // or you can only set roles in sub nav
          }
        },
        
      ]
    },
  ]
})

export default router