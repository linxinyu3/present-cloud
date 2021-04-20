<template>
  <el-menu class="navbar" mode="horizontal">
    <p class="title-image">到云后台管理系统</p>
    <!-- <img src="../../../assets/title.png" class="title-image" /> -->
    <el-dropdown class="avatar-container" trigger="click">
      <div class="avatar-wrapper">
        <img class="user-avatar" src="../../../assets/userImg.jpg" />
        <i class="el-icon-caret-bottom"></i>
      </div>
      <el-dropdown-menu class="user-dropdown" slot="dropdown">
        <router-link class="inlineBlock" to="/information">
          <el-dropdown-item>个人信息</el-dropdown-item>
        </router-link>
        <el-dropdown-item divided>
          <span @click="logout()" style="display:block;">退出登录</span>
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </el-menu>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  computed: {
    ...mapGetters(["sidebar", "avatar"])
  },
  methods: {
    logout() {
      this.$router.push({ path: "/login" });
      localStorage.removeItem('Authorization');
      localStorage.removeItem('isLogin');
      localStorage.removeItem('menuList');
      location.reload(); 
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.navbar {
  height: 50px;
  line-height: 50px;
  border-radius: 0px !important;
  .screenfull {
    position: absolute;
    right: 90px;
    top: 16px;
    color: red;
  }
  .avatar-container {
    height: 50px;
    display: inline-block;
    position: absolute;
    right: 35px;
    .avatar-wrapper {
      cursor: pointer;
      margin-top: 5px;
      position: relative;
      .user-avatar {
        width: 40px;
        height: 40px;
        border-radius: 10px;
      }
      .el-icon-caret-bottom {
        position: absolute;
        right: -20px;
        top: 25px;
        font-size: 12px;
      }
    }
  }
  .title-image {
    margin-top: 0px;
    right: 37%;
    position: absolute;
    font-size: 35px;
    font-family: cursive;
    // height: 100px;
  }
}
</style>

