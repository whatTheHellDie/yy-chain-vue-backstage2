<template>
  <aside class="site-sidebar" :class="'site-sidebar--' + sidebarLayoutSkin">
    <div class="site-sidebar__inner">
      <el-menu
        :default-active="menuActiveName || 'home'"
        :collapse="sidebarFold"
        :collapseTransition="false"
        class="site-sidebar__menu">
        <el-menu-item index="home" @click="$router.push({ name: 'home' })">
          <icon-svg name="shouye" class="site-sidebar__menu-icon"></icon-svg>
          <span slot="title">首页</span>
        </el-menu-item>
         <el-submenu index="system">

          <template slot="title">
            <icon-svg name="system" class="site-sidebar__menu-icon"></icon-svg>
            <span>系统管理</span>
          </template>
          <el-menu-item index="system-user" @click="$router.push({ name: 'system-user' })">
            <span slot="title">用户管理</span>
          </el-menu-item>
          <el-menu-item index="system-role" @click="$router.push({ name: 'system-role' })">
            <span slot="title">角色管理</span>
          </el-menu-item>
           <el-menu-item index="system-menu" @click="$router.push({ name: 'system-menu' })">
            <span slot="title">菜单管理</span>
          </el-menu-item>
        </el-submenu>

         <el-submenu index="setup">
          <template slot="title">
            <icon-svg name="setup" class="site-sidebar__menu-icon"></icon-svg>
            <span>体系管理</span>
          </template>
          <el-menu-item index="setup-member" @click="$router.push({ name: 'setup-member' })">
            <span slot="title">会员管理</span>
          </el-menu-item>
          <el-menu-item index="setup-identity" @click="$router.push({ name: 'setup-identity' })">
            <span slot="title">身份管理</span>
          </el-menu-item>
        </el-submenu>

        <el-submenu index="business">
          <template slot="title">
            <icon-svg name="business" class="site-sidebar__menu-icon"></icon-svg>
            <span>业务管理</span>
          </template>
          <el-menu-item index="business-authentication" @click="$router.push({ name: 'business-authentication' })">
            <span slot="title">实名认证管理</span>
          </el-menu-item>
          <el-menu-item index="business-chargeCoinManagement" @click="$router.push({ name: 'business-chargeCoinManagement' })">
            <span slot="title">充币订单管理</span>
          </el-menu-item>
          <el-menu-item index="business-withdrawalOrder" @click="$router.push({ name: 'business-withdrawalOrder' })">
            <span slot="title">提币订单管理</span>
          </el-menu-item>
          <el-menu-item index="business-order_manage" @click="$router.push({ name: 'business-order_manage' })">
            <span slot="title">订单管理</span>
          </el-menu-item>
        </el-submenu>
        <sub-menu
          v-for="menu in menuList"
          :key="menu.menuId"
          :menu="menu"
          :dynamicMenuRoutes="dynamicMenuRoutes">
        </sub-menu>
      </el-menu>
    </div>
  </aside>
</template>

<script>
  import SubMenu from './main-sidebar-sub-menu'
  import { isURL } from '@/utils/validate'
  export default {
    data () {
      return {
        dynamicMenuRoutes: []
      }
    },
    components: {
      SubMenu
    },
    computed: {
      sidebarLayoutSkin: {
        get () { return this.$store.state.common.sidebarLayoutSkin }
      },
      sidebarFold: {
        get () { return this.$store.state.common.sidebarFold }
      },
      menuList: {
        get () { return this.$store.state.common.menuList },
        set (val) { this.$store.commit('common/updateMenuList', val) }
      },
      menuActiveName: {
        get () { return this.$store.state.common.menuActiveName },
        set (val) { this.$store.commit('common/updateMenuActiveName', val) }
      },
      mainTabs: {
        get () { return this.$store.state.common.mainTabs },
        set (val) { this.$store.commit('common/updateMainTabs', val) }
      },
      mainTabsActiveName: {
        get () { return this.$store.state.common.mainTabsActiveName },
        set (val) { this.$store.commit('common/updateMainTabsActiveName', val) }
      }
    },
    watch: {
      $route: 'routeHandle'
    },
    created () {
      this.menuList = JSON.parse(sessionStorage.getItem('menuList') || '[]')
      console.log(this.menuList)
      this.dynamicMenuRoutes = JSON.parse(sessionStorage.getItem('dynamicMenuRoutes') || '[]')
      this.routeHandle(this.$route)
    },
    methods: {
      // 路由操作
      routeHandle (route) {
        if (route.meta.isTab) {
          // tab选中, 不存在先添加
          var tab = this.mainTabs.filter(item => item.name === route.name)[0]
          if (!tab) {
            if (route.meta.isDynamic) {
              route = this.dynamicMenuRoutes.filter(item => item.name === route.name)[0]
              if (!route) {
                return console.error('未能找到可用标签页!')
              }
            }
            tab = {
              menuId: route.meta.menuId || route.name,
              name: route.name,
              title: route.meta.title,
              type: isURL(route.meta.iframeUrl) ? 'iframe' : 'module',
              iframeUrl: route.meta.iframeUrl || ''
            }
            this.mainTabs = this.mainTabs.concat(tab)
          }
          this.menuActiveName = tab.menuId + ''
          this.mainTabsActiveName = tab.name
        }
      }
    }
  }
</script>
