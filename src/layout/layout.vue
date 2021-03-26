<template>
  <div >
  <el-container style="height:100% ">
    <el-aside width="200px" >
      <sidebar></sidebar>
    </el-aside>
    <el-container style="height:90% ">
      <el-header>
        <navbar></navbar>
      </el-header>
      <el-main>
          <router-view/>
      </el-main>
    </el-container>
  </el-container>
  </div>
</template>
 
<script>
import navbar from './component/Navbar/index'
import sidebar from './component/Sidebar/index'
export default {
  name: 'layout',
  components:{
    navbar,
    sidebar,
  },
}
</script>
<style >
   .el-aside {
        /* background-color:#545c64; */
        color: #333;
        text-align: left;
        line-height: 100vh;
 }
</style>