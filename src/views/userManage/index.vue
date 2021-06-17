<template>
  <div class="app-container">
    <div class="form-style">
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item style="float:left">
          <el-button type="primary" size="small" @click="addData()" icon="el-icon-plus">新增</el-button>
        </el-form-item>
        <el-form-item style="float:right">
          <el-button type="primary" size="small" @click="resetData()">重置</el-button>
        </el-form-item>
        <el-form-item style="float:right">
          <el-button type="primary" size="small" @click="searchData()">查询</el-button>
        </el-form-item>
        <el-form-item label="状态：" style="float:right">
          <el-select v-model="formInline.state" placeholder="请选择状态" size="small">
            <el-option label="正常" value="0"></el-option>
            <el-option label="禁用" value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="用户名：" style="float:right">
          <el-input placeholder="请输入用户名" size="small" v-model="formInline.username"></el-input>
        </el-form-item>
      </el-form>
      <el-table
        :data="list"
        v-loading="listLoading"
        element-loading-text="Loading"
        fit
        highlight-current-row
        ref="multipleTable"
        tooltip-effect="dark"
        style="width: 100%"
        :header-cell-style="{background:'#eef1f6',color:'#606266'}"
   
      >
        <el-table-column label="序号" type="index" width="50" align="center">
          <template slot-scope="scope">
            <span>{{(page - 1) * pageSize + scope.$index + 1}}</span>
          </template>
        </el-table-column>
        <el-table-column label="用户名" min-width="80" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.name}}</span>
          </template>
        </el-table-column>
        <el-table-column label="性别" min-width="50" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.sexCode=='27'">男</span>
            <span v-if="scope.row.sexCode=='28'">女</span>
          </template>
        </el-table-column>
        <el-table-column  label="角色" min-width="100" align="center" :sortable="true" :sort-method="sortByDate">
          <template slot-scope="scope">
            <span v-if="scope.row.roleId=='1'">管理员</span>
            <span v-if="scope.row.roleId=='2'">教师</span>
            <span v-if="scope.row.roleId=='3'">学生</span>
          </template>
        </el-table-column>
        <el-table-column label="状态" min-width="50" align="center">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" content="点击改变角色状态" placement="top-start">
              <el-button
                :type="btnState(scope.row.enabled)"
                plain
                @click="changeState(scope.row)"
                size="small"
              >{{filterState(scope.row.enabled)}}
              </el-button>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作" min-width="150">
          <template slot-scope="scope">
            <div>
              <el-link type="primary" @click="editData(scope.row)">编辑</el-link>
              <el-divider direction="vertical"></el-divider>
              <el-link type="danger" @click="resetPass(scope.row)">修改密码</el-link>
              <el-divider direction="vertical"></el-divider>
              <el-link type="danger" @click="deleteRowData(scope.row)">删除</el-link>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        background
        @current-change="handleCurrentChange"
        layout="total, prev, pager, next"
        :total="totalNum"
        v-if="totalNum!=0"
        :page-size="pageSize"
      ></el-pagination>
    </div>
    <el-dialog :title="title" :visible.sync="dialogFormVisible">
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="ruleForm.phone" placeholder="请输入手机号码"></el-input>
        </el-form-item>
        <el-form-item label="用户名" prop="name">
          <el-input v-model="ruleForm.name" placeholder="请输入用户名称"></el-input>
        </el-form-item>
        <!-- <el-form-item label="密码" prop="password" v-if="this.title == '新增用户'">
          <el-input type="password" v-model="ruleForm.password" placeholder="请输入密码" ></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="checkPass" v-if="this.title == '新增用户'" >
          <el-input type="password" v-model="ruleForm.checkPass" placeholder="请再次输入密码" ></el-input>
        </el-form-item> -->
        <el-form-item label="性别">
          <el-radio v-model="ruleForm.sexCode" label="27">男</el-radio>
          <el-radio v-model="ruleForm.sexCode" label="28">女</el-radio>
        </el-form-item>
        <el-form-item label="状态">
          <el-radio v-model="ruleForm.enabled" :label="true">正常</el-radio>
          <el-radio v-model="ruleForm.enabled" :label="false">禁用</el-radio>
        </el-form-item>
        <el-form-item label="角色" prop="roleId">
          <el-radio v-model="ruleForm.roleId" label="1" >管理员</el-radio>
          <el-radio v-model="ruleForm.roleId" label="2" >老师</el-radio>
          <el-radio v-model="ruleForm.roleId" label="3" >学生</el-radio>
          <!-- <el-tooltip class="item" effect="dark" content="您没有设置管理员角色的权限" placement="top-start">
            <el-radio v-model="ruleForm.roleId" label="1" disabled>管理员</el-radio>
          </el-tooltip> -->
        </el-form-item>
      </el-form>
      <span v-if="this.title == '新增用户'">密码初始化为系统参数中的默认密码</span>
      <div slot="footer" class="dialog-footer" style="text-align: center;margin-bottom:10px">
        <el-button type="primary" @click="submitForm('ruleForm')" style="width:180px">提交</el-button>
        <el-button @click="resetForm('ruleForm')" style="width:180px">取消</el-button>
      </div>
      <!-- <div
        slot="footer"
        class="dialog-footer"
        style="text-align: center;color: #5d5b5b;font-size:14px"
        v-if="title=='新增用户'"
      >
       <span>新增用户密码初始化为系统参数中的默认密码</span>
      </div> -->
    </el-dialog>
        <el-dialog title="修改密码" :visible.sync="dialogFormVisible2">
      <el-form
        :model="passwordForm"
        :rules="passwordRule"
        ref="passwordForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="密码" prop="password">
          <el-input type="password" v-model="passwordForm.password" placeholder="请输入密码" ></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="checkPass">
          <el-input type="password" v-model="passwordForm.checkPass" placeholder="请再次输入密码" ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" style="text-align: center;margin-bottom:10px">
        <el-button type="primary" @click="submitPasswordForm('passwordForm')" style="width:180px">提交</el-button>
        <el-button @click="resetPasswordForm('passwordForm')" style="width:180px">取消</el-button>
      </div>
      <div
        slot="footer"
        class="dialog-footer"
        style="text-align: center;color: #5d5b5b;font-size:14px"
      >
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    // var validatePass = (rule, value, callback) => {
    //   if (/^1[34578]\d{9}$/.test(value) == false) {
    //     callback(new Error("手机号格式错误"));
    //   } else {
    //     callback();
    //   }
    // };
    var validatePass2 = (rule, value, callback) => {
      var pattern=/^(?!^[0-9]+$)(?!^[A-z]+$)(?!^[^A-z0-9]+$)^[^\s\u4e00-\u9fa5]{6,16}$/
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        if(!pattern.exec(value)){
           callback(new Error("6-16位，由数字、英文、符号三种类型构成，至少包含两种类型"));
        }
        callback();
      }
    }; 
    var validatePass3 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.ruleForm.password) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    var validatePass4 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.passwordForm.password) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      list: [],
      AllData: [],
      listLoading: true,
      dialogFormVisible: false,
      dialogFormVisible2: false,
      ruleForm: {
        phone: "",
        name: "",
        password: "",
        checkPass: "",
        sexCode: "27",
        roleId: "2",
        enabled: true,
      },
      passwordForm:{
        id: "",
        password: "",
        checkPass: "",
      },
      temp:{},
      roleAu: false,
      rules: {
        phone: [{ required: true, message: "请输入手机号", trigger: "blur" }],
        name: [{ required: true, message: "请输入用户名称", trigger: "blur" }],
        // password: [{ required: true, validator: validatePass2,trigger: "blur"}],
        // checkPass: [{ required: true, validator: validatePass3, trigger: "blur" }],
        roleId: [{ required: true, message: "请选择角色", trigger: "change" }],
        enabled:[{ required: true, message: "请选择用户状态", trigger: "change" }],
      },
      passwordRule:{
        password: [{ required: true, validator: validatePass2,trigger: "blur"}],
        checkPass: [{ required: true, validator: validatePass4, trigger: "blur" }],
      },
      totalNum: 0,
      title: "新增用户",
      pageSize: 10,
      formInline: {
        username: "",
      },
      page: 1
    };
  },
  mounted() {
  },
  created() {
    this.showUserInfo(this.page);
  },
  methods: {
    sortByDate(obj1, obj2) {
      let val1 = obj1.roleId
      let val2 = obj2.roleId
      return val1 - val2
    },
    filterState(enabled) {
      if (enabled == "1") {
        return "正常";
      } else {
        return "禁用";
      }
    },
    btnState(enabled) {
      if (enabled == "1") {
        return "primary";
      } else {
        return "danger";
      }
    },
    changeState(row) {
      var data ={
        id: row.id,
        enabled: !row.enabled
      }
      this.listLoading = true;
      this.$axios.put("/user/manage/", data).then(
        res => {
          if (res) {
            this.showUserInfo(this.page);
          }
          this.listLoading = false;
        },
        res => {
          this.$router.push({
            path: "/" + res
          });
        }
      );
    },
    resetPass(row) {
      //重置密码
      // if(row.roleId == '1'){
      //    this.$alert("抱歉，您没有修改管理员密码权限，请联系管理员", {
      //     confirmButtonText: "确定"
      //   });
      //   return;
      // }
      this.dialogFormVisible2 = true;
      this.passwordForm.id = row.id;
    },
    searchData() {
      this.list = [];
      this.listLoading = true;
      if (this.formInline.username == "") {
        this.showUserInfo(this.page);
      } else {
        this.page = 1;
        this.$axios
          .get(
            "/user/manage/?currentPage=" +
              this.page +
              "&search=" +
              this.formInline.username
          )
          .then(
            res => {
              if(res){
                this.listLoading = false;
                this.totalNum = res.total;
                if (this.totalNum != 0) {
                  this.list = res.data;
                }
              }
            },
          );
      }
    },
    showUserInfo(page) {
      this.list = [];
      this.listLoading = true;
      this.page = page;
      //获取用户信息
      var data = {
        page: this.page
      };
      this.$axios.get("/user/manage/?currentPage=" + this.page)
        .then(
          res => {
            this.listLoading = false;            
            if(res){
              this.totalNum = res.total;
              if (this.totalNum != 0) {
                this.list = res.data;
            }
            }
          }
        );
    },
    reset() {
      this.ruleForm.phone = null;
      this.ruleForm.name = null;
      this.ruleForm.password = null;
      this.ruleForm.checkPass = null;
      this.ruleForm.sexCode = '27';
      this.ruleForm.roleId = '1';
      this.ruleForm.enabled = true
    },
    addData() {
      this.reset();
      this.dialogFormVisible = true;
      this.title = "新增用户";
    },
    deleteRowData(row) {
      if(row.roleId != 1 || row.roleId != 2){
        this.$confirm("您确定要删除该用户吗？", "删除", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            this.listLoading = true;
            var that = this;
            this.$axios.delete("/user/manage/"  + row.id).then(
              res => {
                if (res) {
                  this.page = 1;
                  that.showUserInfo(this.page);
                } else {
                  this.$alert( "失败", {
                    confirmButtonText: "确定"
                  });
                  that.showUserInfo(this.page);
                }
                this.listLoading = false;
              },
            )
          })
          .catch(()=>{})
          
          this.listLoading = false;
      }else{
        this.$alert("抱歉，您没有删除管理员账户的权限")
      }
    
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.dialogFormVisible = false;
          if (this.title == "新增用户") {
            var data = {
              phone: this.ruleForm.phone,
              name: this.ruleForm.name,
              username: this.ruleForm.name,
              sexCode: this.ruleForm.sexCode,
              enabled: this.ruleForm.enabled,
              roleId: this.ruleForm.roleId,
            };
            this.listLoading = true;
            this.$axios.post("/user/manage/", data).then(
              res => {
                if (res) {
                  this.showUserInfo(this.page);
                } else {
                  this.$alert(res.data.respCode, "失败", {
                    confirmButtonText: "确定"
                  });
                  this.showUserInfo(this.page);
                }
              },
              this.listLoading = false,
            );
          } else {
            //修改信息
            var data = {
              id: this.ruleForm.id,
              phone: this.ruleForm.phone,
              name: this.ruleForm.name,
              sexCode: this.ruleForm.sexCode,
              roleId: this.ruleForm.roleId,
              enabled: this.ruleForm.enabled
            };
            this.listLoading = true;
            this.$axios.put("/user/manage/", data).then(
              res => {
                if (res) {
                  this.showUserInfo(this.page);
                }
              },
              res => {
                this.$router.push({
                  path: "/" + res
                });
              }
            );
            this.listLoading = false;
          }
        }
      });
    },
    resetForm(formName) {
      this.dialogFormVisible = false;
      this.$refs[formName].resetFields();
      this.reset();
      this.showUserInfo(this.page);
    },
    submitPasswordForm(formName){
       this.$refs[formName].validate(valid => {
        if (valid) {
          var data = {
            id: this.passwordForm.id,
            newPassword: this.passwordForm.password
          }
          this.$axios.post('/user/manage/changepassword/',data).then(res=>{
            this.dialogFormVisible2 = false;
          })
        }
      });
    },
    resetPasswordForm(formName) {
      this.dialogFormVisible2 = false;
      this.$refs[formName].resetFields();
      this.passwordForm.id = null;
      this.passwordForm.password = null;
      this.passwordForm.checkPass = null;
      // this.showUserInfo(this.page);
    },
    handleCurrentChange(val) {
      this.page = val;
      this.showUserInfo(this.page);
    },
    resetData() {
      this.formInline.username = "";
      this.page = 1;
      this.showUserInfo(this.page);
    },
    editData(row) {
      // if(row.roleId.toString() == '1'){
      //   this.$alert("抱歉，您没有修改管理员的权限")
      //   return;
      // }
      this.ruleForm.id = row.id;
      this.ruleForm.phone = row.phone;
      this.ruleForm.name = row.name;
      this.ruleForm.enabled = row.enabled;
      this.ruleForm.sexCode = row.sexCode.toString();
      this.ruleForm.roleId = row.roleId.toString();
      this.title = "修改用户信息";
      this.dialogFormVisible = true;
    },
  }
};
</script>
<style scoped>
.el-pagination {
  text-align: center !important;
  margin: 20px 0 !important;
}
</style>
<style>
.el-table__header {
  width: auto !important;
}
.el-table__body {
  width: auto !important;
}
.app-container {
  background-color: #f0f2f5;
  min-height: 100vh;
  height: 100%;
}
.form-style {
  background: #fff;
  padding: 20px;
  min-height: 85vh;
}
</style>