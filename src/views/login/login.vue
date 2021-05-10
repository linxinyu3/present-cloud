<template>
  <div class="login-container">
    <div class="login-form">
      <el-form>
        <div class="title-container">
          <img src="../../assets/cloud.png" style="width:250px;" />
        </div>
        <div>
          <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="密码登录" name="1"></el-tab-pane>
            <el-tab-pane label="验证码登录" name="2"></el-tab-pane>
          </el-tabs>
        </div>
      </el-form>
      <el-form
        v-show="activeName=='1'"
        autocomplete="on"
        :model="loginForm"
        :rules="loginRules"
        ref="loginForm"
        label-position="left"
      >
        <el-form-item prop="username">
          <el-input
            prefix-icon="el-icon-user-solid"
            name="username"
            type="text"
            v-model="loginForm.username"
            autocomplete="on"
            placeholder="请输入手机号/用户名"
          ></el-input>
        </el-form-item>

        <el-form-item prop="password">
          <el-input
            prefix-icon="el-icon-lock"
            name="password"
            :type="passwordType"
            v-model="loginForm.password"
            autocomplete="on"
            placeholder="请输入密码"
          >
            <i slot="suffix" @click="showPwd">
              <svg-icon icon-class="eye" />
            </i>
          </el-input>
        </el-form-item>
        <el-button
          type="primary"
          style="width:100%;margin-bottom:10px;"
          :loading="loading"
          @click="handleLogin"
        >登录</el-button>
        <el-link type="primary" style="float:left" @click="signup()">注册</el-link>
        <el-link type="primary" style="float:right" @click="forgetPass()">忘记密码</el-link>
      </el-form>
      <el-form
        v-show="activeName=='2'"
        autocomplete="on"
        :model="loginForm1"
        :rules="loginRules1"
        ref="loginForm1"
        label-position="left"
      >
        <el-form-item prop="username">
          <el-input
            prefix-icon="el-icon-user-solid"
            name="username"
            type="text"
            v-model="loginForm1.username"
            autocomplete="on"
            placeholder="请输入手机号"
          ></el-input>
        </el-form-item>
        <el-form-item prop="validCode">
          <el-row>
            <el-col :span="15">
              <el-input
                prefix-icon="el-icon-message"
                name="password"
                v-model="loginForm1.validCode"
                autocomplete="on"
                placeholder="请输入验证码"
              />
            </el-col>
            <el-col :span="8" :offset="1">
              <el-button
                type="primary"
                plain
                :disabled="isDisabled"
                @click="getValidCode()"
                id="dyMobileButton"
              >{{butName}}</el-button>
            </el-col>
          </el-row>
        </el-form-item>

        <el-button
          type="primary"
          style="width:100%;margin-bottom:10px;"
          :loading="loading"
          @click="handleLogin"
        >登录</el-button>
        <el-link type="primary" style="float:left" @click="signup">注册</el-link>
      </el-form>
    </div>
  </div>
</template>

<script>
import qs from "qs";
export default {
  data() {
    return {
      loginForm: {
        username: "",
        password: ""
      },
      loginForm1: {
        username: "",
        validCode: ""
      },
      loginRules: {
        username: [{ required: true, trigger: "blur", message: "请输入手机号/邮箱" }],
        password: [{ required: true, trigger: "blur", message: "请输入密码" }]
      },
      loginRules1: {
        username: [
          { required: true, trigger: "blur", message: "请输入手机号" },
          {
            validator: function(rule, value, callback) {
              if (/^1[34578]\d{9}$/.test(value) == false) {
                callback(new Error("手机号格式错误"));
              } else {
                callback();
              }
            },
            trigger: ["blur"]
          }
        ],
        validCode: [{ required: true, trigger: "blur", message: "请输入验证码" }]
      },
      passwordType: "password",
      loading: false,
      activeName: "1",
      butName: "获取验证码",
      isDisabled: false
    };
  },
  created(){
    this.confirmAutoLogin();
  },
  methods: {
    handleClick(tab, event) {},
    //7天内登录不需要重新登录
    confirmAutoLogin() {
      var isLogin = JSON.parse(localStorage.getItem("isLogin")); //获取缓存看是否登录过
      var time = localStorage.getItem("loginTime");
      var nowTime = new Date().getTime();
      if (
        isLogin === true &&
        nowTime <= time + 86400000
      ) {
        this.$router.push("/home");
      }
    },
    getValidCode() {
      var time = 60;
      this.$refs.loginForm1.validateField("username", errMsg => {
        if (errMsg) {
        } else {
          this.$axios.get('/loginCaptcha?phone=' + this.loginForm1.username).then(res =>{
            if(res){
              console.log(res)
            }
          })
          //倒计时
          let timer = setInterval(() => {
            if (time == 0) {
              clearInterval(timer);
              this.isDisabled = false;
              this.butName = "获取验证码";
            } else {
              this.butName = time + "秒后重试";
              this.isDisabled = true;
              time--;
            }
          }, 1000);
        }
      });
    },
    showPwd() {
      if (this.passwordType === "password") {
        this.passwordType = "";
      } else {
        this.passwordType = "password";
      }
    },
    handleLogin() {
      if (this.activeName == "1") { 
        //密码登录
        this.$refs.loginForm.validate(valid => {
          if (valid) {
            this.loading = true;
            var data = {
              usernameOrPhone: this.loginForm.username,
              password: this.loginForm.password,
            };
            this.$axios.post('/manage/loginByPassword',data).then(res=>{  
              console.log(res);    
              if(res){
                console.log(res);  
                this.loading = false;
                var date = new Date();
                //存储登录信息
                localStorage.setItem("account", this.loginForm.username);
                localStorage.setItem("loginTime", date.getTime()); //登录时间
                localStorage.setItem("Authorization", res.obj.tokenHead + res.obj.token);
                localStorage.setItem("isLogin", true);
                this.$axios.get('/menu/currentUser').then(res=>{
                  var data = res[0]
                  localStorage.setItem('menuList', JSON.stringify(data))
                  this.$router.push("/home");
                })    
              }else{
                localStorage.removeItem('menuList');
              }
              this.loading = false;
            })
          }
        });
      } else {
        //验证码登录
        this.$refs.loginForm1.validate(valid => {
          if (valid) {
            var data = {
              usernameOrPhone : this.loginForm1.username,
              code: this.loginForm1.validCode
            }
            this.loading = true; 
            this.$axios.post('/manage/loginByCode',data).then(res=>{
              console.log(res)
              if (res) {
                this.loading = false;
                console.log(res)
                var date = new Date();
                //存储登录信息
                localStorage.setItem("account", this.loginForm1.username);
                localStorage.setItem("loginTime", date.getTime()); //登录时间
                localStorage.setItem("Authorization", res.obj.tokenHead + res.obj.token);
                localStorage.setItem("isLogin", true);
                this.$axios.get('/menu/currentUser').then(res=>{
                  var data = res[0]
                  localStorage.setItem('menuList', JSON.stringify(data))
                  this.$router.push("/home");  
                })       
              }else{
                localStorage.removeItem('menuList');
              }
              this.loading = false;          
            })
          }
        });
      }
    },
    signup() {
      this.$router.push("/signup");
    },
    forgetPass() {
      this.$router.push("/forgetPassword");
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #4a4949;

.login-container {
  position: fixed;
  height: 100%;
  width: 100%;
  // background-color: $bg;
  background-image: url("../../assets/bg.jpg");
  background-size: cover;
  background-repeat: no-repeat;
  .login-form {
    position: absolute;
    left: 0;
    right: 0;
    width: 400px;
    padding: 35px 35px 15px 35px;
    margin: 120px auto;
    background-color: #f8f8f9;
  }
  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
}
</style>
