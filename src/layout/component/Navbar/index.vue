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
          <span @click="editpassword()" style="display:block;">修改密码</span>
        </el-dropdown-item>
        <el-dropdown-item divided>
          <span @click="logout()" style="display:block;">退出登录</span>
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
    <el-dialog
      title="修改密码"
      :visible.sync="dialogVisible"
      width="width">
      <div></div>
      <div slot="footer">
      <el-form
        :model="ruleForm"
        status-icon
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
        style="width:90%"
      >
        <el-form-item label="原密码" required>
          <el-input type=password v-model="ruleForm.oldPass"></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="pass" required>
          <el-input type=password v-model="ruleForm.pass"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="checkPass" required>
          <el-input type=password v-model="ruleForm.checkPass"></el-input>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')" style="width:40%">提交</el-button>
          <el-button @click="resetForm('ruleForm')" style="width:40%">取消</el-button>
        </el-form-item>
      </el-form>
      </div>
    </el-dialog>
  </el-menu>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  data(){
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
      } else if (value !== this.ruleForm.pass) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return{
      dialogVisible: false,
      ruleForm: {
        oldPass: "",
        pass: "",
        checkPass: ""
      },
      rules: {
        Oldpass: [{required: true, validator: validatePass, trigger: "blur" }],
        pass: [{required: true, validator: validatePass, trigger: "blur" }],
        checkPass: [{required: true, validator: validatePass2, trigger: "blur" }]
      },
      id: ''
    }
  },
  computed: {
    ...mapGetters(["sidebar", "avatar"])
  },
  methods: {
    editpassword(){
      this.dialogVisible = true;
      this.$axios.get('/common/user/info').then(res =>{
        if(res){
          this.id = res.id
        }
      })
    },
    logout() {
      this.$router.push({ path: "/login" });
      localStorage.removeItem('Authorization');
      localStorage.removeItem('isLogin');
      localStorage.removeItem('menuList');
      location.reload(); 
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          var data = {
            id: this.id,
            newPassword: this.ruleForm.pass,
            oldPassword: this.ruleForm.oldPass
          };
          var that = this
          this.$axios.post("/common/user/pwd", data).then(
            res => {
              if (res) {
                this.$alert("修改密码成功，即将跳转至登录页");
                setTimeout(function(){
            　　  that.logout()
            　　 },1500);
              } else {
                this.$alert(res.data.respCode, "失败", {
                  confirmButtonText: "确定"
                });
              }
            },
          );
        } else {
          this.$alert("有必填项未填写或者填写错误", "警告", {
            confirmButtonText: "确定"
          });
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.ruleForm.oldPass = "";
      this.dialogVisible = false;
    },
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

