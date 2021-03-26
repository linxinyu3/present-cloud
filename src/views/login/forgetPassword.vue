<template>
  <div class="forget-container">
    <!-- <div class="login-form"> -->
    <!-- <el-row> -->
    <el-form
      class="demo-ruleForm"
      :model="ruleForm"
      :rules="resetRules"
      ref="ruleForm"
      label-position="left"
    >
      <div class="title-container">
        <img src="../../assets/cloud.png" style="width:250px" />
      </div>
        <el-form-item prop="phone">
        <el-input
          prefix-icon="el-icon-user-solid"
          name="phone"
          type="text"
          v-model="ruleForm.phone"
          autocomplete="on"
          placeholder="请输入手机号"
        ></el-input>
      </el-form-item>
      <el-form-item prop="message">
        <el-row>
          <el-col :span="15">
            <el-input
              prefix-icon="el-icon-message"
              name="password"
              v-model="ruleForm.message"
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
      <el-form-item prop="passChange">
        <el-input
          prefix-icon="el-icon-lock"
          type="password"
          v-model="ruleForm.passChange" 
          autocomplete="off"
          placeholder="请输入密码"
        ></el-input>
      </el-form-item>
      <el-form-item prop="checkPassChange">
        <el-input
          prefix-icon="el-icon-finished"
          type="password"
          v-model="ruleForm.checkPassChange"
          autocomplete="off"
          placeholder="请确认密码"
        ></el-input>
      </el-form-item>
      <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')" :loading="loading" style="width:100%">提交</el-button>
        </el-form-item>
      <el-link type="primary" style="float:right" @click="login">登录</el-link>
    </el-form>
    <!-- </el-row> -->
    <!-- </div> -->
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
        // if (this.loginForm.checkPass !== "") {
        //   this.$refs.loginForm.validateField("checkPass");
        // }
        if(!pattern.exec(value)){
           callback(new Error("6-16位，由数字、英文、符号三种类型构成，至少包含两种类型字符"));
        }
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.ruleForm.passChange) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };

    return {
      ruleForm: {
        phone: "",
        message: "",
        passChange: "",
        checkPassChange: "",
        age: ""
      },
      loading: false,
      butName: "获取验证码",
      isDisabled: false,
      validateCode: "",
      resetRules: {
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
        message: [{ required: true, trigger: "blur", message: "请输入验证码" }],
        passChange: [{ required: true, validator: validatePass, trigger: "blur" }],
        checkPassChange: [
          { required: true, validator: validatePass2, trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    login() {
      this.$router.push({ path: "/login" });
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (localStorage.getItem("validateCode") != this.ruleForm.message) {
            this.$alert("验证码错误，请重新输入", "重置密码失败", {
              confirmButtonText: "确定"
            });
          } else {
            this.loading = true;
            this.$router.push('/login')
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    getMessage() {
      var time = 60;
      this.$refs.ruleForm.validateField("phone", errMsg => {
        if (errMsg) {
        } else {
          //生成4位随机验证码，短信验证功能等后端实现后引入
          var Code =Math.floor(Math.random()*9000+1000*Math.random());
          alert(Code);
          localStorage.setItem("validateCode", Code);
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
  }
};
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #4a4949;

.forget-container {
  position: fixed;
  height: 100%;
  width: 100%;
  //   background-color: $bg;
  background-image: url("../../assets/bg.jpg");
  background-size: cover;
  background-repeat: no-repeat;
  .demo-ruleForm {
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
