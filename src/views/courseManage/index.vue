<template>
  <div class="app-container">
    <div class="form-style">
      <el-form :inline="true" :model="searchForm" class="demo-form-inline">
        <el-form-item style="float:left">
          <el-button type="primary" size="small" @click="addData()" icon="el-icon-plus">新增</el-button>
        </el-form-item>
        <el-form-item style="float:right">
          <el-button type="primary" size="small" @click="resetData()">重置</el-button>
        </el-form-item>
        <el-form-item style="float:right">
          <el-button type="primary" size="small" @click="searchData()">查询</el-button>
        </el-form-item>
        <el-form-item label="名称：" style="float:right">
          <el-input placeholder="请输入名称" size="small" v-model="searchForm.name"></el-input>
        </el-form-item>
      </el-form>
      <div>
        <el-table
          :data="list"
          v-loading="listLoading"
          element-loading-text="Loading"
          fit
          highlight-current-row
          tooltip-effect="dark"
          :header-cell-style="{background:'#eef1f6',color:'#606266'}"
        >
          <el-table-column label="序号" type="index" width="50" align="center">
            <template slot-scope="scope">
              <span>{{(page - 1) * pageSize + scope.$index + 1}}</span>
            </template>
          </el-table-column>
          <el-table-column label="课程名" min-width="100" align="center">
            <template slot-scope="scope">
              <span>{{scope.row.name}}</span>
            </template>
          </el-table-column>
          <el-table-column label="课程号" min-width="100" align="center" sortable prop="courseCode">
            <template slot-scope="scope">
              <span>{{scope.row.courseCode}}</span>
            </template>
          </el-table-column>
          <el-table-column label="课程类别" min-width="100" align="center">
            <template slot-scope="scope">
              <span>{{scope.row.type}}</span>
            </template>
          </el-table-column>
          <el-table-column label="课程介绍" min-width="100" align="center">
            <template slot-scope="scope">
              <span>{{scope.row.description}}</span>
            </template>
          </el-table-column>
          <el-table-column label="创建时间" min-width="150" align="center" sortable prop="createTime">
            <template slot-scope="scope">
              <span>{{(scope.row.createTime)}}</span>
            </template>
          </el-table-column>
          <el-table-column label="创建人员" min-width="100" align="center">
            <template slot-scope="scope">
              <span>{{scope.row.creater.name}}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="操作" min-width="100">
            <template slot-scope="scope">
              <div>
                <el-link type="primary" @click="editData(scope.row)">编辑</el-link>
                <el-divider direction="vertical"></el-divider>
                <el-link type="danger" @click="deleteData(scope.row)">删除</el-link>
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
    </div>
    <el-dialog :title="title" :visible.sync="dialogFormVisible">
      <el-form :model="addForm" :rules="addRules" ref="addForm" >
        <el-form-item label="课程名" :label-width="formLabelWidth" prop="name">
          <el-input v-model="addForm.name" placeholder="输入课程名" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="课程类别" :label-width="formLabelWidth" prop="type">
          <el-select v-model="addForm.type" placeholder="请选择课程类别">
            <el-option label="必修" value="29"></el-option>
            <el-option label="选修" value="30"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="课程介绍" :label-width="formLabelWidth" prop="description">
          <el-input v-model="addForm.description"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" >
        <el-button @click="resetForm('addForm')">取 消</el-button>
        <el-button type="primary" @click="submitForm('addForm')">确 定</el-button>
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
      totalNum: 0,
      pageSize: 10,
      searchForm: {
        name: ""
      },
      page: 1,
      data: [],
      id: 1,
      editRules: {
        name: [{ required: true, message: "请输入课程名", trigger: "blur" }],
        type: [{ required: true, message: "请选择课程类别", trigger: "blur" }]
      },
      addForm: {
        id: "",
        courseCode:"",
        name: "",
        type: "",
        description: ""
      },
      addRules: {
        name: [{ required: true, message: "请输入课程名", trigger: "blur" }],
        type: [{ required: true, message: "请选择课程类别", trigger: "blur" }]
      },
      formLabelWidth: "100px",
      title: "新增课程",
      selectTree: "",
      selectTreeId: "0",
      id: ''
    };
  },
  created() {
    this.getAllData(this.page);
  },
  methods: {
    deleteData(row) {
      console.log(row)
      this.$confirm("确定要删除选择的课程？", "删除课程", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$axios.delete("/course/manage/" + row.id).then(
            res => {
              if (res) {
                this.page = 1;
                this.getAllData(this.page);
              } else {
               this.page = 1;
                this.getAllData(this.page);
              }
            },
           
          );
        this.listLoading = false;
        })
        .catch(() => {});
    },
    searchData() {
      this.list = [];
      this.listLoading = true;
      this.page = 1;
      this.$axios
        .get("/course/manage/?search=" + this.searchForm.name + "&page=" + this.page).then(res => {
            this.list = res.data;
            this.listLoading = false;
            this.totalNum = res.total;
          },
        );
    },
    getAllData(page) {
      this.listLoading = true;
      this.page = page;
      this.$axios.get("/course/manage/?currentPage=" + this.page).then(res => {
        if(res){
          this.list = res.data;
          for(var i in res.data){
            this.list[i].createTime = this.list[i].createTime.split('T')[0]
          }
          this.totalNum = res.total;
        }
      });
      this.listLoading = false;
    },
    reset() {
      this.addForm.name = null;
      this.addForm.type = null;
      this.addForm.courseCode = null;
      this.addForm.description = null;
    },
    addData() {
      this.reset();
      this.title = "新增课程";
      this.dialogFormVisible = true;
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.dialogFormVisible = false;
          this.$axios.get('/common/user/info').then(res =>{
            if(res){
              this.id = res.id
            }
          })
          if (this.title == '新增课程') {
            //获取当前用户id
            var data = {
              createrId: this.id,
              name: this.addForm.name,
              typeCode: this.addForm.type ,
              description: this.addForm.description
            };
            this.$axios.post("/course/manage/", data).then(
              res => {
                if (res) {
                  this.getAllData(this.page);
                } else {
                  this.getAllData(this.page);
                }
                this.listLoading = false;
              },
            );
          } else {
            //修改信息
            if(this.addForm.type == "必修"){
              this.addForm.type = 29
            }
            if(this.addForm.type == "选修"){
              this.addForm.type = 30
            }
            var data = {
              id: this.addForm.id,
              courseCode: this.addForm.courseCode,
              name: this.addForm.name,
              typeCode: this.addForm.type,
              description: this.addForm.description,
              // enabled: true
            };
            this.$axios.put("/course/manage/", data).then(
              res => {
                if (res) {
                  this.getAllData(this.page);
                } else {
                  this.getAllData(this.page);
                }
                this.listLoading = false;
              },
            );
          }
        }
      });
    },
    resetForm(formName) {
      this.dialogFormVisible = false;
      this.$refs[formName].resetFields();
      this.reset();
      this.getAllData(this.page);
    },
    handleCurrentChange(val) {
      this.page = val;
      this.getAllData(this.page);
    },
    resetData() {
      this.searchForm.name = "";
      this.page = 1;
      this.getAllData(this.page);
    },
    editData(row) {
      this.title = "编辑课程信息";
      this.addForm.id = row.id;
      this.addForm.name = row.name;
      this.addForm.type = row.type
      this.addForm.courseCode = row.courseCode;
      this.addForm.description = row.description;
      this.dialogFormVisible = true;
    }
  }
};
</script>
<style scoped>
.el-pagination {
  text-align: center !important;
  margin: 20px 0 !important;
}
.dashboard-editor-container {
  float: left;
  width: 20%;
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