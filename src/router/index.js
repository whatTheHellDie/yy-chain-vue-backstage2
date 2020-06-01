/**
 * 全站路由配置
 *
 * 建议:
 * 1. 代码中路由统一使用name属性跳转(不使用path属性)
 */
import Vue from 'vue'
import Router from 'vue-router'
import http from '@/utils/httpRequest'
import { isURL } from '@/utils/validate'
import { clearLoginInfo } from '@/utils'

Vue.use(Router)

// 开发环境不使用懒加载, 因为懒加载页面太多的话会造成webpack热更新太慢, 所以只有生产环境使用懒加载
const _import = require('./import-' + process.env.NODE_ENV)
// 全局路由(无需嵌套上左右整体布局)
const globalRoutes = [
  { path: '/404', component: _import('common/404'), name: '404', meta: { title: '404未找到' } },
  { path: '/login', component: _import('common/login'), name: 'login', meta: { title: '登录' } }
]

// 主入口路由(需嵌套上左右整体布局)
const mainRoutes = {
  path: '/',
  component: _import('main'),
  name: 'main',
  redirect: { name: 'home' },
  meta: { title: '主入口整体布局' },
  children: [
    // 通过meta对象设置路由展示方式
    // 1. isTab: 是否通过tab展示内容, true: 是, false: 否
    // 2. iframeUrl: 是否通过iframe嵌套展示内容, '以http[s]://开头': 是, '': 否
    // 提示: 如需要通过iframe嵌套展示内容, 但不通过tab打开, 请自行创建组件使用iframe处理!
    { path: '/home', component: _import('common/home'), name: 'home', meta: { title: '首页' } },
    { path: '/theme', component: _import('common/theme'), name: 'theme', meta: { title: '主题' } },
    //系统
       { path: '/system-user', component: _import('system/user'), name: 'system-user', meta: { title: '用户管理', isTab: true } },
       { path: '/system-role', component: _import('system/role'), name: 'system-role', meta: { title: '角色管理', isTab: true } },
       { path: '/system-menu', component: _import('system/menu'), name: 'system-menu', meta: { title: '菜单管理', isTab: true } },

    //体系
    { path: '/setup-member', component: _import('setup/member'), name: 'setup-member', meta: { title: '会员管理', isTab: true } },
    { path: '/setup-identity', component: _import('setup/identity'), name: 'setup-identity', meta: { title: '身份管理', isTab: true } },
    //业务管理
    { path: '/business-authentication', component: _import('business/authentication'), name: 'business-authentication', meta: { title: '实名认证管理', isTab: true } },
    { path: '/business-chargeCoinManagement', component: _import('business/chargeCoinManagement'), name: 'business-chargeCoinManagement', meta: { title: '充币订单管理', isTab: true } },
    { path: '/business-withdrawalOrder', component: _import('business/withdrawalOrder'), name: 'business-withdrawalOrder', meta: { title: '提币订单管理', isTab: true } },
    { path: '/business-order_manage', component: _import('business/order_manage'), name: 'business-order_manage', meta: { title: '订单管理', isTab: true } },


  ],
  beforeEnter (to, from, next) {
    let token = Vue.cookie.get('yy-chain-bs-token')
    if (!token || !/\S/.test(token)) {
      clearLoginInfo()
      next({ name: 'login' })
    }
    next()
  }
}

const router = new Router({
  mode: 'history',
  scrollBehavior: () => ({ y: 0 }),
  isAddDynamicMenuRoutes: false, // 是否已经添加动态(菜单)路由
  routes: globalRoutes.concat(mainRoutes)
})
var navDataList = [
  {
    'menuId': 1,
    'parentId': 0,
    'parentName': null,
    'name': '系统例子',
    'url': null,
    'perms': null,
    'type': 0,
    'icon': 'system',
    'orderNum': 0,
    'open': null,
    'list': [
      {
        'menuId': 2,
        'parentId': 1,
        'parentName': null,
        'name': '首页',
        'url': 'common/home',
        'perms': null,
        'type': 1,
        'orderNum': 1,
        'open': null,
        'list': null
      },
      {
        'menuId': 3,
        'parentId': 1,
        'parentName': null,
        'name': '布局设置',
        'url': 'common/theme',
        'perms': null,
        'type': 1,
        'icon': 'role',
        'orderNum': 2,
        'open': null,
        'list': null
      },
      {
        'menuId': 4,
        'parentId': 1,
        'parentName': null,
        'name': '菜单管理',
        'url': 'business/order_manage',
        'perms': null,
        'type': 1,
        'icon': 'menu',
        'orderNum': 3,
        'open': null,
        'list': null
      },
      {
        'menuId': 5,
        'parentId': 1,
        'parentName': null,
        'name': 'SQL监控',
        'url': 'http://www.baidu.com',
        'perms': null,
        'type': 1,
        'icon': 'sql',
        'orderNum': 4,
        'open': null,
        'list': null
      },
      {
        'menuId': 6,
        'parentId': 1,
        'parentName': null,
        'name': '定时任务',
        'url': 'job/schedule',
        'perms': null,
        'type': 1,
        'icon': 'job',
        'orderNum': 5,
        'open': null,
        'list': null
      },
      {
        'menuId': 27,
        'parentId': 1,
        'parentName': null,
        'name': '参数管理',
        'url': 'sys/config',
        'perms': 'sys:config:list,sys:config:info,sys:config:save,sys:config:update,sys:config:delete',
        'type': 1,
        'icon': 'config',
        'orderNum': 6,
        'open': null,
        'list': null
      },
      {
        'menuId': 30,
        'parentId': 1,
        'parentName': null,
        'name': '文件上传',
        'url': 'oss/oss',
        'perms': 'sys:oss:all',
        'type': 1,
        'icon': 'oss',
        'orderNum': 6,
        'open': null,
        'list': null
      },
      {
        'menuId': 29,
        'parentId': 1,
        'parentName': null,
        'name': '系统日志',
        'url': 'sys/log',
        'perms': 'sys:log:list',
        'type': 1,
        'icon': 'log',
        'orderNum': 7,
        'open': null,
        'list': null
      }
    ]
  }
]
router.beforeEach((to, from, next) => {
  // 添加动态(菜单)路由
  // 1. 已经添加 or 全局路由, 直接访问
  // 2. 获取菜单列表, 添加并保存本地存储
  // if (router.options.isAddDynamicMenuRoutes || fnCurrentRouteType(to, globalRoutes) === 'global') {
  //   next()
  // } else {
  //   http({
  //     url: http.adornUrl('/sys/menu/nav'),
  //     method: 'get',
  //     params: http.adornParams()
  //   }).then(({data}) => {
  //     if (data && data.code === 0) {
  //       fnAddDynamicMenuRoutes(data.menuList)
  //       router.options.isAddDynamicMenuRoutes = true
  //       sessionStorage.setItem('menuList', JSON.stringify(data.menuList || '[]'))
  //       sessionStorage.setItem('permissions', JSON.stringify(data.permissions || '[]'))
  //       next({ ...to, replace: true })
  //     } else {
  //       sessionStorage.setItem('menuList', '[]')
  //       sessionStorage.setItem('permissions', '[]')
  //       next()
  //     }
  //   }).catch((e) => {
  //     console.log(`%c${e} 请求菜单列表和权限失败，跳转至登录页！！`, 'color:blue')
  //     router.push({ name: 'login' })
  //   })
  // }
  
     if (router.options.isAddDynamicMenuRoutes || fnCurrentRouteType(to, globalRoutes) === 'global') {
       next()
     } else {

      //  fnAddDynamicMenuRoutes(navDataList)
      //  console.log('没有动态路由')
      //  router.options.isAddDynamicMenuRoutes = true
      //  sessionStorage.setItem('menuList', JSON.stringify(navDataList))
      //  next({ ...to, replace: true })
      //  url: this.$http.adornUrl('/bs/menu/tree'),
    http({
      url: http.adornUrl('/bs/menu/tree'),
      method: 'get',
      params: http.adornParams()
    }).then(({data}) => {
      console.log(data.data)
      if (data && data.code === "0000") {
        fnAddDynamicMenuRoutes(data.data)
        router.options.isAddDynamicMenuRoutes = true
        sessionStorage.setItem('menuList', JSON.stringify(data.data || '[]'))
        next({ ...to, replace: true })
      } else {
        sessionStorage.setItem('menuList', '[]')
        next()
      }
    }).catch((e) => {
      console.log(`%c${e} 请求菜单列表和权限失败，跳转至登录页！！`, 'color:blue')
      router.push({ name: 'login' })
    })
     }
})

/**
 * 判断当前路由类型, global: 全局路由, main: 主入口路由
 * @param {*} route 当前路由
 */
function fnCurrentRouteType (route, globalRoutes = []) {
  var temp = []
  for (var i = 0; i < globalRoutes.length; i++) {
    if (route.path === globalRoutes[i].path) {
      return 'global'
    } else if (globalRoutes[i].children && globalRoutes[i].children.length >= 1) {
      temp = temp.concat(globalRoutes[i].children)
    }
  }
  return temp.length >= 1 ? fnCurrentRouteType(route, temp) : 'main'
}

/**
 * 添加动态(菜单)路由
 * @param {*} menuList 菜单列表
 * @param {*} routes 递归创建的动态(菜单)路由
 */
function fnAddDynamicMenuRoutes (menuList = [], routes = []) {
  var temp = []
  for (var i = 0; i < menuList.length; i++) {
    if (menuList[i].children && menuList[i].children.length >= 1) {
      temp = temp.concat(menuList[i].children)
    } else if (menuList[i].url && /\S/.test(menuList[i].url)) {
      menuList[i].url = menuList[i].url.replace(/^\//, '')
      var route = {
        path: menuList[i].url.replace('/', '-'),
        component: null,
        name: menuList[i].url.replace('/', '-'),
        meta: {
          menuId: menuList[i].id,
          title: menuList[i].label,
          isDynamic: true,
          isTab: true,
          iframeUrl: ''
        }
      }
      // url以http[s]://开头, 通过iframe展示
      if (isURL(menuList[i].url)) {
        route['path'] = `i-${menuList[i].id}`
        route['name'] = `i-${menuList[i].id}`
        route['meta']['iframeUrl'] = menuList[i].url
      } else {
        try {
          var url=menuList[i].url
          route['component'] = _import(url) || null
        } catch (e) {}
      }
      routes.push(route)
    }
  }
  if (temp.length >= 1) {
    fnAddDynamicMenuRoutes(temp, routes)
  } else {
    mainRoutes.name = 'main-dynamic'
    mainRoutes.children = routes
    router.addRoutes([
      mainRoutes,
      { path: '*', redirect: { name: '404' } }
    ])
    sessionStorage.setItem('dynamicMenuRoutes', JSON.stringify(mainRoutes.children || '[]'))
    console.log('\n')
    console.log('%c!<-------------------- 动态(菜单)路由 s -------------------->', 'color:blue')
    console.log(mainRoutes.children)
    console.log('%c!<-------------------- 动态(菜单)路由 e -------------------->', 'color:blue')
  }
}

export default router
