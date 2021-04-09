<template>
  <div>home</div>
</template>

<script>
import qs from "qs";
export default {
  // beforeRouteUpdate(to, from, next) {
  //   next();
  // },
  // beforeRouteUpdate(to, from, next) {
  //   console.log('hahaha')
  //   if(from.path == '/login'){
  //     console.log('hahaha')
  //   }
  //   next();
  // },
  created() {
    this.$axios.get('/menu/currentUser').then(res=>{
      if(res){
        var data = res[0]
        localStorage.setItem('menuList', JSON.stringify(data))
      }
      
    })
  },
  data() {
    return {
    }
  },
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>

</style>