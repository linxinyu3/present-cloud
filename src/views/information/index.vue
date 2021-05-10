<template>
  <div class="dashboard-editor-container">
    <el-button type="primary" style="width:100%;margin-bottom:20px;right:10%">个人信息</el-button>
    <el-form
      label-width="80px"
      :model="ruleForm"
      :rules="rules"
      v-loading="loading"
      ref="ruleForm"
    >
      <el-form-item label="电话号码:" prop="phone">
        <span style="float:left;font-size:17px">{{ruleForm.phone}}</span>
      </el-form-item>
      <el-form-item label="邮箱:" prop="email">
        <el-input v-model="ruleForm.email" placeholder="请输入邮箱"></el-input>
      </el-form-item>
      <el-form-item label="姓名:" prop="name">
        <el-input v-model="ruleForm.name" placeholder="请输入名称"></el-input>
      </el-form-item>
      <el-form-item label="工号:" prop="number">
        <el-input v-model="ruleForm.number" placeholder="请输入工号"></el-input>
      </el-form-item>
      <el-form-item label="性别:" prop="sexCode">
        <el-radio-group v-model="ruleForm.sexCode">
          <el-radio label="27">男</el-radio>
          <el-radio label="28">女</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="院校:" prop="school">
        <el-cascader
          style="width:280px"
          :placeholder="placeholder"
          ref="schoolCascader"
          expandTrigger="hover"
          :options="school"
          @change="handleChange">
        </el-cascader>
      </el-form-item>
      <el-form-item label="出生日期:">
        <el-date-picker
          value-format="yyyy-MM-dd"
          v-model="ruleForm.birthday"
          type="date"
          placeholder="选择日期"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="用户角色:">
        <el-tag type="success" v-if="ruleForm.roleId=='1'">管理员</el-tag>
        <el-tag type="success" v-if="ruleForm.roleId=='2'">教师</el-tag>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')" style="width:40%">提交</el-button>
        <el-button @click="resetForm('ruleForm')" style="width:40%">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>


<script>
export default {
  data() {
    var validateSchool = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请选择学校及学院"));
      } else {
        callback();
      }
    };
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
      } else if (value !== this.ruleForm2.pass) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      loading: true,
      ruleForm: {
      },
      ruleForm2: {
        oldPass: "",
        pass: "",
        checkPass: ""
      },
      rules: {
        name: [{ required: true, message: "请输入用户名", trigger: "blur" }],
        number: [{ required: true, message: "请输入工号", trigger: "blur" }],
        sexCode: [{ required: true, message: "请选择性别", trigger: "blur" }],
        email:[{type: "email", message: "请输入正确的邮箱", trigger: ["blur", "change"]}],
        school: [{ required: false, validator: validateSchool, trigger: "change" }],
      },
      rules2: {
        pass: [{ validator: validatePass, trigger: "blur" }],
        checkPass: [{ validator: validatePass2, trigger: "blur" }]
      },
      options: [],
      imageUrl: "",
      schoolId: "",
      departmentId: "",
      school: [],
      placeholder: "请选择院校"
    };
  },
  created() {
    this.gerUserInfo();
  },
  methods: {
    gerUserInfo(){
      this.showSchool();
      this.showUserInfo();
    },
    showUserInfo() {
      this.loading = true;
      this.$axios.get("/common/user/info").then(res => {
        if(res){
          this.ruleForm = res
          if(res.schoolId != null){
            this.placeholder = res.school.name + "/" + res.department.name
          }
          if(this.ruleForm.sexCode == null){
            this.ruleForm.sexCode = ''
          }
          this.ruleForm.sexCode = res.sexCode.toString()
        }
      });
      this.loading = false;
    },
    showSchool() {
      this.loading = true;
      this.$axios.get("/school/manage/tree").then(res => {
        if(res){
          this.school = res;
          for(var i in res){
            this.school[i].label = res[i].name;
            this.school[i].value = res[i].name;
            this.school[i].children = res[i].departments;
            for(var j in res[i].departments){
              this.school[i].children[j].label = res[i].departments[j].name;
              this.school[i].children[j].value = res[i].departments[j].name;
            }
          }
        }
      });
      this.loading = false;
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        this.loading = true;
        this.ruleForm.sexCode = parseInt(this.ruleForm.sexCode)
        this.ruleForm.createTime = null
        console.log(this.ruleForm)
        if (valid) {
          this.$axios.put("/common/user/edit", this.ruleForm).then(
            res => {
              if (res) {
                this.gerUserInfo();
              }else{
                this.gerUserInfo();
              }
            },
          );
          return false;
        }
      this.loading = false;
      });
    },
    resetForm(formName) {
      var temp = this.ruleForm.phone;
      this.$refs[formName].resetFields();
      this.ruleForm.phone = temp
      this.ruleForm.sexCode = "27"
      this.ruleForm.birthday = ""
      this.placeholder = "请选择"
    },
    handleAvatarSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw);
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    },
    handleChange(value) {
      if(value.length != 0){
        var node =this.$refs.schoolCascader.getCheckedNodes()[0]
        console.log(node)
        this.ruleForm.schoolId = node.parent.data.id
        this.ruleForm.departmentId = node.data.id
      }
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.dashboard-editor-container {
  margin-left: 10%;
  width: 80%;
  height: 100vh;
}
.form-style {
  background: #fff;
}
.form1 {
  border: 1px solid #c5c5c5;
  padding-left: 10%;
}
.form2 {
  border: 1px solid #c5c5c5;
  padding: 20px;
}
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 80px;
  height: 80px;
  line-height: 80px;
  text-align: center;
  border: 1px dashed;
}
.avatar {
  width: 80px;
  height: 80px;
  display: block;
  margin: 0 auto;
}
</style>
<style >
.el-upload {
  display: block !important;
  position: relative !important;
  margin-bottom: 20px;
}
</style>
