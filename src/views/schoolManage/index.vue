<template>
  <div class="app-container">
    <div class="form-style">
      <el-form :inline="true" :model="searchForm" class="demo-form-inline">
        <el-form-item style="float:left;padding-left:10%;">
          <el-button type="primary" size="small" @click="addData()" icon="el-icon-plus">新增学校</el-button>
        </el-form-item>
        <el-form-item style="float:right;;padding-right:10%">
          <el-button type="primary" size="small" @click="resetData()">重置</el-button>
        </el-form-item>
        <el-form-item style="float:right">
          <el-button type="primary" size="small" @click="searchData()">查询</el-button>
        </el-form-item>
        <el-form-item label="搜索：" style="float:right">
          <el-input placeholder="按学校或学院名称" size="small" v-model="filterText"></el-input>
        </el-form-item>
      </el-form>
      <div>
        <div class="dashboard-editor-container">
          <el-button type="primary" style="width:100%;margin-bottom:20px;font-size:17px;" size="small">学校组织结构</el-button>
          <el-tree
            :data="data"
            node-key="id"
            default-expand-all
            :filter-node-method="filterNode"
            ref="tree"
            :expand-on-click-node="false">
            <span class="custom-tree-node" slot-scope="{ node, data }">
              <span>{{ node.label }}</span>
              <span>
                <el-button
                  v-if="data.schoolCode"
                  type="text"
                  style="font-size:16px;"
                  @click="append(node,data)">
                  + 新增学院
                </el-button>
                <el-button
                  type="text"
                  style="font-size:16px;"
                  @click="edit(node,data)">
                  编辑
                </el-button>
                <el-button
                  style="color:#F66C6C;font-size:16px"
                  type="text"
                  @click="remove(node, data)">
                  删除
                </el-button>
              </span>
            </span>
          </el-tree>
        </div>
        
      </div>
    </div>
    <el-dialog :title="title" :visible.sync="dialogFormVisible">
      <el-form :model="addForm" :rules="addRules" ref="addForm" v-if="title == '新增学校'">
        <el-form-item label="学校编号" :label-width="formLabelWidth" prop="schoolCode">
          <el-input v-model="addForm.schoolCode" autocomplete="off">
          </el-input>
        </el-form-item>
        <el-form-item label="学校名称" :label-width="formLabelWidth" prop="name">
          <el-input v-model="addForm.name" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <el-form :model="editForm" :rules="editRules" ref="editForm" v-if="title == '编辑学校信息'">
        <el-form-item label="学校编号" :label-width="formLabelWidth" prop="schoolCode">
          <el-input v-model="editForm.schoolCode" autocomplete="off" ></el-input>
        </el-form-item>
        <el-form-item label="学校名称" :label-width="formLabelWidth" prop="name">
          <el-input v-model="editForm.name" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" v-if="title == '新增学校'">
        <el-button @click="resetForm('addForm')">取 消</el-button>
        <el-button type="primary" @click="submitForm('addForm')">确 定</el-button>
      </div>
      <!-- <div slot="footer" class="dialog-footer" v-if="title == '编辑学校信息'">
        <el-button @click="resetForm('editForm')">取 消</el-button>
        <el-button type="primary" @click="submitForm('editForm')">确 定</el-button>
      </div> -->
    </el-dialog>

    <el-dialog :title="title" :visible.sync="dialogFormVisible2">
      <el-form :model="addDepartmentForm" :rules="addDepartmentRules" ref="addDepartmentForm" v-if="title == '新增学院'">
        <el-form-item label="学院名称" :label-width="formLabelWidth" prop="name">
          <el-input v-model="addDepartmentForm.name" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <el-form :model="editDepartmentForm" :rules="addDepartmentRules" ref="editDepartmentForm" v-else>
        <el-form-item label="学院名称" :label-width="formLabelWidth" prop="name">
          <el-input v-model="editDepartmentForm.name" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" v-if="title == '新增学院'">
        <el-button @click="resetDepartmentForm('addDepartmentForm')">取 消</el-button>
        <el-button type="primary" @click="submitDepartmentForm('addDepartmentForm')">确 定</el-button>
      </div>
      <div slot="footer" class="dialog-footer" v-else>
        <el-button @click="resetDepartmentForm('editDepartmentForm')">取 消</el-button>
        <el-button type="primary" @click="submitDepartmentForm('editDepartmentForm')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
      deep: true
    }
  },
  data() {
    var validatePass = (rule, value, callback) => {
      if (/^[^\s\u4e00-\u9fa5]$/.test(value) == false) {
        callback(new Error("必须为中文名"));
      } else {
        callback();
      }
    };   
    return {
      filterText: '',
      list: [],
      listLoading: false,
      dialogFormVisible: false,
      dialogFormVisible2: false,
      totalNum: 0,
      searchForm: {
        name: "",
        filterText: "",
      },
      data: [],
      id: 1,
      defaultProps: {
        children: "children",
        label: "label"
      },
      addForm: {
        name: "",
        schoolCode: ""
      },
      editForm: {
        name: "",
        schoolCode: "",
        id: ""
      },
      editRules: {
        name: [{ required: true, message: "请输入名称", validate: validatePass, trigger: "blur" }],
        schoolCode: [
          { required: true, message: "请输入编号", trigger: "blur" },
          { min: 5, max: 5, message: "请输入5个字符组成的学校代码", trigger: "blur" }
          ]
      },
      addDepartmentForm:{
        id: "",
        name: "",
        parentId: "",
      },
      editDepartmentForm: {
        name: "",
        id: "",
        parentId: "",
      },
      addRules: {
        name: [{ required: true, message: "请输入名称", validate: validatePass, trigger: "blur" }],
        schoolCode: [
          { required: true, message: "请输入学校代码", trigger: "blur" },
          { min: 5, max: 5, message: "请输入5个字符组成的学校代码", trigger: "blur" }
        ]
      },
      addDepartmentRules: {
        name: [{ required: true, message: "请输入学院名称", validate: validatePass, trigger: "blur" }],
      },
      formLabelWidth: "100px",
      title: "新增",
      isAdd: true,
      selectTree: "",
      selectTreeId: "0",
      isAddSchool: false
    };
  },
  created() {
    this.getAllData();
  },
  methods: {
    filterNode(value, data, node) {
        if (!value) return true
        let if_one = data.label.indexOf(value) !== -1
        let if_two = node.parent && node.parent.data && node.parent.data.label && (node.parent.data.label.indexOf(value) !== -1)
        let if_three = node.parent && node.parent.parent && node.parent.parent.data && node.parent.parent.data.label && (node.parent.parent.data.label.indexOf(value) !== -1)
        let result_one = false
        let result_two = false
        let result_three = false
        if(node.level === 1) {
          result_one = if_one
        }else if(node.level === 2) {
          result_two = if_one || if_two
        }else if(node.level === 3) {
          result_three = if_one || if_two || if_three
        }
          return result_one || result_two || result_three
      },
    append(node,data) {
      this.title = '新增学院'
      this.dialogFormVisible2 = true;
      this.addDepartmentForm.parentId = node.key
    },

    remove(node, data) {
      this.$confirm("确定要删除选择的院校？", "删除院校", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          if(node.parent.parent == null){
          var id = node.key
          this.$axios.delete('/school/manage/'+ id).then(res=>{
            if(res){
              this.getAllData();
            }
            })
          }else{
            var id = node.key
            this.$axios.delete('/school/manage/dept/'+ id).then(res=>{
              if(res){
                this.getAllData();
              }
            })
          }
          })
        .catch(() => {});
    },
    searchData() {
    },
    getAllData() {
      this.selectTree = "";
      this.selectTreeId = "0";
      this.list = [];
      this.filterText = ''
      this.$axios.get("/school/manage/tree").then(
        res => {
          if(res){
            this.data = res;
            for(var i in res){
              this.data[i].label = res[i].name;
              this.data[i].children = res[i].departments;
              for(var j in res[i].departments){
                this.data[i].children[j].label = res[i].departments[j].name;
              }
            }
            this.id = res[0].id;
          }
        },
      );
      
    },
    reset() {
      this.addForm.name = "";
      this.addForm.schoolCode = "";
    },
    addData() {
      this.resetForm(this.addForm);
      this.title = "新增学校";
      this.isAdd = true;
      if (this.selectTree != "") {
        this.isAddSchool = false;
      } else {
        this.isAddSchool = true;
      }

      this.dialogFormVisible = true;
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.dialogFormVisible = false;
          if (this.title == '新增学校') {
            this.$axios.post('/school/manage/',this.addForm).then(res=>{
              if(res){
                this.getAllData();
              }
            })
            this.resetForm(formName)
          } else {
            //修改信息
            var data = {
              name: this.editForm.name,
              id: this.editForm.id,
              schoolCode: this.editForm.schoolCode
            };
            this.$axios.put("/school/manage/", data).then(
              res => {
                if (res) {
                  this.getAllData();
                } else {
                  this.$alert(res, "失败", {
                    confirmButtonText: "确定"
                  });
                  this.getAllData();
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
      this.reset();
      this.$refs[formName].resetFields();
      this.getAllData();
    },
    submitDepartmentForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if(this.title == '新增学院'){
            var data = this.addDepartmentForm
            this.$axios.post('/school/manage/dept/',data).then(res=>{
              if(res){
                this.getAllData();
                this.$refs[formName].resetFields();
              }
            })
          }else{
            var data = this.editDepartmentForm
            this.$axios.put('/school/manage/dept/',data).then(res=>{
              if(res){
                this.getAllData();
              }
            })
          }
        this.dialogFormVisible = false;
        this.dialogFormVisible2 = false;
        }
      });
    },
    resetDepartmentForm(formName) {
      this.dialogFormVisible2 = false;
      this.addDepartmentForm.id = null;
      this.addDepartmentForm.name = null;
      this.addDepartmentForm.parentId = null;
      this.$refs[formName].resetFields();
      this.getAllData();
    },
    edit(node,data){
      if(node.parent.parent == null){
        this.title = '编辑学校信息';
        this.editForm.schoolCode = data.schoolCode;
        this.editForm.name = data.name
        this.editForm.id = data.id
        this.dialogFormVisible = true;
      }
      else{
        this.title = '编辑学院信息';
        this.dialogFormVisible2 = true;
        this.editDepartmentForm.name = data.name;
        this.editDepartmentForm.parentId = data.parentId;
        this.editDepartmentForm.id = data.id
      }
    },
    resetData() {
      this.filterText = ''
    },
  }
};
</script>
<style scoped>
.el-pagination {
  text-align: center !important;
  margin: 20px 0 !important;
}
.dashboard-editor-container {
  padding-left:10%;
  padding-right:10%;
  width: 80%;
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
.custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 17px;
    padding-right: 8px;
  }
</style>