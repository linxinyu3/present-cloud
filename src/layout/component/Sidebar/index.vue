<template>
  <el-scrollbar wrapClass="scrollbar-wrapper">
    <el-menu
      mode="vertical"
      :show-timeout="200"
      :default-active="$route.path"
      :collapse="isCollapse"
      background-color="#304156"
      text-color="#bfcbd9"
      active-text-color="#409EFF"
    >
      <el-menu-item index="10" v-show="!isCollapse">
        <img src="../../../assets/cloudMenu.png" style="width:70px;margin-left:40px" />
        <!-- <span slot="title">Dcloud</span> -->
        <!-- <span>到云</span> -->
      </el-menu-item>
      <el-menu-item index="10" v-show="isCollapse">
        <img src="../../../assets/cloudMenu.png" style="width:35px;margin-left:-20px" />
      </el-menu-item>
      <sidebar-item v-for="route in routes" :key="route.name" :item="route" :base-path="route.path"></sidebar-item>
    </el-menu>
  </el-scrollbar>
</template>

<script>
import { mapGetters } from "vuex";
import SidebarItem from "./SidebarItem";

export default {
  components: { SidebarItem },
  computed: {
    ...mapGetters(["sidebar", "permission_routers"]),
    routes() {
   //  this.routerGo;
      return this.$router.options.routes;
    },
    isCollapse() {
      return !this.sidebar.opened;
    },
  }
};
</script>
<style>
  .sidebar-item{
    text-align: left;
  }
</style>