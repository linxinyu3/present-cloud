<template>
  <div class="login-container">
    <el-form
      class="login-form"
      autocomplete="on"
      :model="signupForm"
      :rules="loginRules"
      ref="signupForm"
      label-position="left"
    >
      <div class="title-container">
        <img src="../../assets/cloud.png" style="width:250px" />
      </div>
      <el-form-item prop="phone">
        <el-input
          prefix-icon="el-icon-phone"
          name="phone"
          type="text"
          v-model="signupForm.phone"
          autocomplete="on"
          placeholder="请输入手机号"
        ></el-input>
      </el-form-item>
      <el-form-item prop="username">
        <el-input
          prefix-icon="el-icon-user-solid"
          name="username"
          type="text"
          v-model="signupForm.username"
          autocomplete="on"
          placeholder="请输入用户名"
        ></el-input>
      </el-form-item>
      <el-form-item prop="message">
        <el-row>
          <el-col :span="15">
            <el-input
              prefix-icon="el-icon-message"
              name="password"
              v-model="signupForm.message"
              autocomplete="on"
              placeholder="请输入验证码"
            />
          </el-col>
          <el-col :span="8" :offset="1">
            <el-button
              type="primary"
              plain
              :disabled="isDisabled"
              @click="getMessage()"
              id="dyMobileButton"
            >{{butName}}</el-button>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item prop="pass">
        <el-input
          prefix-icon="el-icon-lock"
          type="password"
          v-model="signupForm.pass"
          autocomplete="off"
          placeholder="请输入密码"
        ></el-input>
      </el-form-item>
      <el-form-item prop="checkPass">
        <el-input
          prefix-icon="el-icon-finished"
          type="password"
          v-model="signupForm.checkPass"
          autocomplete="off"
          placeholder="请确认密码"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-checkbox v-model="teacherRole" @change="changeRole()">我是教师</el-checkbox>
        <el-checkbox v-model="adminRole" @change="changeRole2()">我是管理员</el-checkbox>
      </el-form-item>
      <el-button
        type="primary"
        style="width:100%;margin-bottom:10px;"
        :loading="loading"
        @click="signup"
      >注册</el-button>
      <el-link type="primary" style="float:right" @click="login">已有账号，去登录</el-link>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    var validatePass = (rule, value, callback) => {
      var pattern=/^(?!^[0-9]+$)(?!^[A-z]+$)(?!^[^A-z0-9]+$)^[^\s\u4e00-\u9fa5]{6,16}$/
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        if(!pattern.exec(value)){
           callback(new Error("6-16位，由数字、英文、符号三种类型构成，至少包含两种类型字符"));
        }
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.signupForm.pass) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      signupForm: {
        phone: null,
        username: "",
        message: "",
        pass: "",
        checkPass: ""
      },
      loginRules: {
        phone: [
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
        username: [{ required: true, trigger: "blur", message: "请输入用户名" }],
        message: [{ required: true, trigger: "blur", message: "请输入验证码" }],
        pass: [{ required: true, validator: validatePass, trigger: "blur" }],
        checkPass: [
          { required: true, validator: validatePass2, trigger: "blur" }
        ]
      },
      loading: false,
      activeName: "1",
      butName: "获取验证码",
      isDisabled: false,
      validateCode: "",
      teacherRole: true,
      adminRole: false,
      roleId: 2
    };
  },
  methods: {
    getMessage() {
      var time = 60;
      this.$refs.signupForm.validateField("phone", errMsg => {
        if (errMsg) {
        } else {
          this.$axios.get('/registerCaptcha?phone=' + this.signupForm.phone).then(res =>{
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
    signup() {
      this.$refs.signupForm.validate(valid => {
        if (valid) {
          var data = {
            phone : this.signupForm.phone,
            username: this.signupForm.username,
            password: this.signupForm.pass,
            checkPassword: this.signupForm.checkPass,
            code: this.signupForm.message,
            roleId: this.roleId
          }
          this.$axios.post('/register', data).then(res =>{
            if(res){
              this.loading = true;
              this.login();
            }
          })
        } else {
          return false;
        }
      });
    },
    login() {
      this.$router.push("/login");
    },
    changeRole(){
      if(this.teacherRole){
        this.roleId = 2
        this.adminRole = false
      }else{
        this.roleId = 1
        this.adminRole = true
      }
    },
    changeRole2(){
      if(this.adminRole){
        this.roleId = 1
        this.teacherRole = false
      }else{
        this.roleId = 2
        this.teacherRole = true
      }
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
  //   background-color: $bg;
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
  .title-container {
    position: relative;
    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }
}
</style>
