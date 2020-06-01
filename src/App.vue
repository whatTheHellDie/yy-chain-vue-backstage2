<template>
  <transition name="fade">
    <router-view></router-view>
  </transition>
</template>

<script>
  export default {
    watch:{
      '$route' (to, from) {
        // 对路由变化作出响应...
        if(!this.$cookie.get('yy-chain-bs-token')&&from.path=='/login'){
          history.go(1)
        }
      }
    }
  }
</script>
