<template>
  <div class="background">
      <h1 class="title">欢迎使用到云!</h1>
      <el-divider></el-divider>
    </div>
</template>

<script>
import qs from "qs";
export default {
  data() {
    return {
      tableData: [
        {
          name: "林新宇",
          sno: "200327066"
        },
        {
          name: "林兴",
          sno: "200327067"
        },
        {
          name: "林智明",
          sno: "200327069"
        },
        {
          name: "孙首男",
          sno: "200327079"
        },
      ]
    };
  },
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .background{
    background:url("../../assets/home.png");
    width: 90%;
    height: 100%;
    position:fixed;
    margin-top: -35px;/*上边距*/
    margin-bottom: 0px;
    margin-right: 0px;
    margin-left: -21px;/*左边距*/
    background-size:100% 100%;
    }
  .title {
    text-align: center;
    /* font-size: 32px; */
    color: #181818;
    font-family: -webkit-pictograph;
  }
  h3 {
    color: #181818;
  }
  .des {
    padding: 20px 10px;
    color: #00ffff;
  }
</style>