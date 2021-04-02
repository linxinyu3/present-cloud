<template>
  <div style="padding:0;height:100%" >
  <el-container style="height:100%">
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
<style>

.el-aside {
    background-color:#304156;
    color: #333;
    text-align: left;
    line-height: 100vh;
 }
 .sidebar{
   top: 0;
   left: 0;
   bottom: 0;
   height: 100%;
   position: fixed;
 }
</style>