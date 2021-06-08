<template>
  <div class="app-container">
    <div class="form-style">
      <el-form  class="demo-form-inline">
        <el-form-item style="float:left">
          <el-button type="primary" size="small" @click="addData()" icon="el-icon-plus">新增</el-button>
        </el-form-item>
      </el-form>
      <el-table
        :data="list"
        v-loading="listLoading"
        element-loading-text="Loading"
        border
        fit
        highlight-current-row
        tooltip-effect="dark"
        style="width: 100%"
        row-key="id"
        :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
        :header-cell-style="{background:'#eef1f6',color:'#606266'}"
      >
        <el-table-column label="名称" min-width="70" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.name}}</span>
          </template>
        </el-table-column>
        <el-table-column label="关键字" min-width="50" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.keyword}}</span>
          </template>
        </el-table-column>
        <el-table-column label="值" min-width="50" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.value}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作" min-width="80">
          <template slot-scope="scope">
            <div>
              <el-link type="primary" @click="editData(scope.row)">编辑</el-link>
              <el-divider direction="vertical"></el-divider>
              <el-link type="danger" @click="deleteUser(scope.row)">删除</el-link>
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
        :model="settingForm"
        :rules="settingRule"
        ref="settingForm"
        label-width="150px"
      >
        <el-form-item label="名称" prop="name">
          <el-input v-model="settingForm.name"></el-input>
        </el-form-item>
        <el-form-item label="关键字" prop="keyword">
          <el-input v-model="settingForm.keyword" @blur="checkkeyword"></el-input>
        </el-form-item>
        <el-form-item label="值" prop="value">
          <el-input v-model="settingForm.value"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" style="text-align: center;margin-bottom:10px">
        <el-button type="primary" @click="submitForm('settingForm')" style="width:180px">提交</el-button>
        <el-button @click="resetForm('settingForm')" style="width:180px">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      list: [],
      listLoading: false,
      dialogFormVisible: false,
      settingForm: {
        id: "",
        name: "",
        keyword: "",
        value: ""
      },
      settingRule: {
        name: [{ required: true, message: "请输入名称", trigger: "blur" }],
        keyword: [{ required: true, message: "请输入关键字", trigger: "blur" }],
        value: [{ required: true, message: "请输入值", trigger: "blur" }],
      },
      totalNum: 0,
      title: "新增系统参数",
      pageSize: 10,
      page: 1,
    };
  },
  created() {
    this.showData(this.page);
  },
  methods: {
    checkkeyword(){
      this.$axios.get("/setting/manage/ckkwd/" + this.settingForm.keyword)
    },
    reset() {
      this.settingForm.id = null;
      this.settingForm.name = "";
      this.settingForm.keyword = "";
      this.settingForm.value = "";
    },
    addData() {
      this.reset();
      this.dialogFormVisible = true;
      this.title = "新增系统参数";
    },
    deleteUser(row) {
      this.$confirm("确定要删除该系统参数？", "删除系统参数", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$axios.delete("/setting/manage/" + row.id).then(res => {
            if (res) {
              this.showData(this.page);
            }
          });
        })
        // .catch(() => {});
    },
    editData(row) {
      this.settingForm = row;
      this.title = "编辑系统参数";
      this.dialogFormVisible = true;
    },
    showData(page) {
      this.list = [];
      this.listLoading = true;
      this.page = page;
      var data = {
        page: this.page
      };
      this.$axios.get("/setting/manage/").then(res => {
        this.listLoading = false;
        if(res){
          this.list = res
        }
      });  
    },
    submitForm(formName) {
      var data = {
        id: this.settingForm.id,
        name: this.settingForm.name,
        keyword: this.settingForm.keyword,
        value: this.settingForm.value,
      };
      var addData = {
        name: this.settingForm.name,
        keyword: this.settingForm.keyword,
        value: this.settingForm.value,
      };
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.dialogFormVisible = false;
          if (this.title == "新增系统参数") {
            this.$axios.post("/setting/manage/", addData).then(res => {
              if (res) {
                this.showData(this.page);
              } else {
                this.showData(this.page);
              }
              this.$refs[formName].resetFields();
            });
          } else {
            console.log(data)
            this.$axios.put("/setting/manage/", data).then(res => {
              if (res) {
                  this.listLoading = true;
                  this.showData(this.page);
              } else {
                this.showData(this.page);
              }
            });
          }
        }
      });
    },
    resetForm(formName) {
      this.dialogFormVisible = false;
      this.$refs[formName].resetFields();
      this.reset();
      this.showData(this.page);
    },
    handleCurrentChange(val) {
      this.page = val;
      this.showData(this.page);
    },
  }
};
</script>
<style scoped>
.el-pagination {
  text-align: center !important;
  margin: 20px 0 !important;
}
.app-container {
  background-color: #f0f2f5;
  min-height: 100vh;
  height: 100%;
}
.form-style {
  background: #fff;
  padding: 20px;
}
</style>
<style>
.el-table__header {
  width: auto !important;
}
.el-table__body {
  width: auto !important;
}
</style>
