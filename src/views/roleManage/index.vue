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
            <el-option label="禁用" value="0"></el-option>
            <el-option label="启用" value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="角色名称：" style="float:right">
          <el-input placeholder="请输入角色名称" size="small" v-model="formInline.role"></el-input>
        </el-form-item>
      </el-form>

      <el-table
        :data="list"
        v-loading="listLoading"
        element-loading-text="Loading"
        fit
        highlight-current-row
        tooltip-effect="dark"
        style="width: 100%"
        :header-cell-style="{background:'#eef1f6',color:'#606266'}"
      >
        <el-table-column label="角色英文名" min-width="80" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.name}}</span>
          </template>
        </el-table-column>
        <el-table-column label="角色中文名" min-width="80" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.nameZh}}</span>
          </template>
        </el-table-column>
        <el-table-column label="角色状态" min-width="50" align="center">
          <template slot-scope="scope">
            <el-button
              :type="btnState(scope.row.state)"
              plain
              @click="changeState(scope.row)"
              size="small"
            >{{filterState(scope.row.state)}}</el-button>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作" min-width="100">
          <template slot-scope="scope">
            <div>
              <el-link type="primary" @click="editData(scope.row)">修改名称</el-link>
              <el-divider direction="vertical"></el-divider>
              <el-link type="primary" @click="permissioncheck(scope.row)">查看权限</el-link>
              <el-divider direction="vertical"></el-divider>
              <el-link type="primary" @click="permissionAssign(scope.row)">分配权限</el-link>
              <el-divider direction="vertical"></el-divider>
              <el-link type="danger" @click="deleteData(scope.row)">删除</el-link>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog :title="title" :visible.sync="dialogFormVisible">
      <el-form
        :model="roleForm"
        :rules="rules"
        ref="roleForm"
        label-width="100px"
        class="demo-roleForm"
      >
        <el-form-item label="角色英文名" prop="name">
          <el-input v-model="roleForm.name"></el-input>
        </el-form-item>
        <el-form-item label="角色中文名" prop="nameZh">
          <el-input v-model="roleForm.nameZh"></el-input>
        </el-form-item>
        <el-form-item label="角色状态" v-if="title=='编辑角色'">
          <el-radio v-model="roleForm.state" label="0">禁用</el-radio>
          <el-radio v-model="roleForm.state" label="1">启用</el-radio>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" style="text-align: center;margin-bottom:10px">
        <el-button type="primary" @click="submitForm('roleForm')" style="width:180px">确定</el-button>
        <el-button @click="resetForm('roleForm')" style="width:180px">取消</el-button>
      </div>
      <div
        slot="footer"
        class="dialog-footer"
        style="text-align: center;color: #5d5b5b;font-size:14px"
        v-if="title=='新增角色'"
      >
      </div>
    </el-dialog>

    <el-dialog :title="title" :visible.sync="dialogFormVisible2" @close='resetmenuForm'>
      <el-form
        :model="menuForm"
        ref="menuForm"
        label-width="100px"
        class="demo-roleForm"
      >
        <el-checkbox-group v-model="checkList" style="zoom: 150%;">
          <el-checkbox v-for="menu in menus" :label="menu.id" :key="menu.id">{{menu.name}}</el-checkbox>
        </el-checkbox-group>
      </el-form>
      <div slot="footer" class="dialog-footer" style="text-align: center;margin-bottom:10px">
        <el-button type="primary" @click="submitmenuForm()" style="width:180px" v-if="searchFlag==false">确定</el-button>
        <el-button @click="resetmenuForm()" style="width:180px"  v-if="searchFlag==true">关闭</el-button>
        <el-button @click="resetmenuForm()" style="width:180px" v-if="searchFlag==false">取消</el-button>
      </div>
      <div
        slot="footer"
        class="dialog-footer"
        style="text-align: center;color: #5d5b5b;font-size:14px"
        v-if="title=='新增角色'"
      >
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      list: [],
      checkList: [],
      menus:[],
      AllData: [],
      listLoading: false,
      dialogFormVisible: false,
      dialogFormVisible2: false,
      permissionId: null,
      searchFlag: false,
      roleForm: {
        name: "",
        nameZh: "",
        state: "1",
      },
      menuForm:{
        id: null,
        name: ""
      },
      rules: {
        name: [{ required: true, message: "请输入角色英文名", trigger: "blur" }],
        nameZh: [{ required: true, message: "请输入角色中文名", trigger: "blur" }]
      },
      totalNum: 1,
      title: "新增角色",
      pageSize: 10,
      formInline: {
        role: "",
        state: ""
      },
      page: 1
    };
  },
  created() {
    this.showRoleInfo();
    this.getMenus();
  },
  methods: {
    addData() {
      //添加新角色
      this.reset();
      this.dialogFormVisible = true;
      this.title = "新增角色";
    },
    searchData() {
      //搜索
      this.list = [];
      this.listLoading = true;
      this.page = 1;
      var data = {
        page: this.page,
        nameZh: this.formInline.role,
        state: this.formInline.state
      };
      this.$axios
        .get(
          "/api/role?page=" +
            data.page +
            "&nameZh=" +
            data.nameZh +
            "&state=" +
            data.state
        )
        .then(res => {
          this.listLoading = false;
          this.totalNum = res.data.total;
          if (this.totalNum != 0) {
            delete res.data[0];
            this.list = res.data.records;
          }
        });
    },
    resetData() {
      this.formInline.role = "";
      this.formInline.state = "";
      this.showRoleInfo(this.page);
    },
    reset() {
      this.roleForm.nameZh = "";
      this.roleForm.note = "";
    },
    btnState(state) {
      if (state == "1") {
        return "primary";
      } else {
        return "danger";
      }
    },
    filterState(state) {
      if (state == "1") {
        return "启用";
      } else {
        return "禁用";
      }
    },
    changeState(row) {
      this.$http
        .patch("/api/role?id=" + row.id + "&state=" + row.state)
        .then(res => {
          if (res.data.respCode == "1") {
            this.$alert("状态修改成功", "成功", {
              confirmButtonText: "确定"
            });
            if (row.state == "1") {
              row.state = "0";
              row.statenameZh = "禁用";
              row.type = "0";
            } else {
              row.state = "1";
              row.statenameZh = "启用";
              row.type = "1";
            }
          } else {
            this.$alert(res.data.respCode, "失败", {
              confirmButtonText: "确定"
            });
          }
        });
    },
    editData(row) {
      this.roleForm = row;
      this.dialogFormVisible = true;
      this.title = "编辑角色";
    },
    deleteData(row) {
      console.log(row.id)
      this.$confirm("确定要删除该角色？", "删除角色", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$axios.delete("/role/manage/" + row.id).then(res => {
            if (res) {
              this.showRoleInfo(this.page);
            }
          });
        })
        .catch(() => {});
    },

    submitForm(formnameZh) {
      var data = {
        id: this.roleForm.id,
        nameZh: this.roleForm.nameZh,
        state: this.roleForm.state
      };
      var addData = {
        name: this.roleForm.name,
        nameZh: this.roleForm.nameZh
      };
      this.$refs[formnameZh].validate(valid => {
        if (valid) {
          this.dialogFormVisible = false;
          if (this.title == "新增角色") {
            this.$axios.post("/role/manage/", addData).then(res => {
              if (res) {
                this.showRoleInfo(this.page);
              } else {
                this.showRoleInfo(this.page);
              }
              this.$refs[formnameZh].resetFields();
            });
          } else {
            this.$$axios.put("//role/manage/", data).then(res => {
              if (res) {
                this.showRoleInfo(this.page);
              } else {
                this.showRoleInfo(this.page);
              }
              this.$refs[formnameZh].resetFields();
            });
          }
        }
      });
    },
    submitmenuForm(){
      var data = {
        rid: this.permissionId,
        ids: this.checkList
      }
      this.$axios.put('/role/manage/menus',data).then(res => {
        if(res){
          this.dialogFormVisible2 = false;
          location.reload()
        }
      })
    },
    resetForm(formnameZh) {
      this.dialogFormVisible = false;
      this.$refs[formnameZh].resetFields();
      this.reset();
      this.showRoleInfo(this.page);
    },
    resetmenuForm() {
      this.dialogFormVisible2 = false;
      this.checkList = [];
    },
    showRoleInfo(page) {
      this.list = [];
      this.listLoading = true;
      this.page = 1;
      var nameZh = "";
      var state = "";
      //获取角色信息
      var data = {
        nameZh: nameZh,
        state: state
      };
      this.$axios.get("/role/manage/")
        .then(res => {
          if(res){
            this.listLoading = false;
            this.list = res
          }
          
        });
    },
    getMenus(){
      var data ={
        id: null,
        name: ""
      }
      this.$axios.get("/menu/manage/").then(res => {
        if(res){
          this.menus = res
        }
      })
    },
    handleCurrentChange(val) {
      // console.log(val);
      //根据页数显示页面上的数据。
      this.list = [];
      var mapsize = Object.keys(this.AllData).length;

      if (mapsize - (val - 1) * this.pageSize < this.pageSize) {
        for (var i = (val - 1) * this.pageSize + 1; i <= mapsize; i++) {
          this.list.push(this.AllData[i]);
        }
      } else {
        for (
          var i = (val - 1) * this.pageSize + 1;
          i <= val * this.pageSize;
          i++
        ) {
          this.list.push(this.AllData[i]);
        }
      }
    },
    permissioncheck(row){
      this.searchFlag = true;
      this.title = "查看" + row.nameZh + "角色权限"
      this.$axios.get('/role/manage/menus/' + row.id).then(res => {
        if(res){
          for(var i in res){
            this.checkList.push(res[i].id)
          }
        }
      })
      this.dialogFormVisible2 = true;
    },
    permissionAssign(row) {
      this.searchFlag = false
      this.checkList = []
      this.title = "正在为"+ row.nameZh + "角色分配权限"
      this.permissionId = row.id
      this.$axios.get('/role/manage/menus/' + row.id).then(res => {
        if(res){
          for(var i in res){
            this.checkList.push(res[i].id)
          }
        }
      })
      this.dialogFormVisible2 = true;
    }
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
