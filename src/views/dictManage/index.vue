<template>
  <div class="app-container">
    <div class="form-style">
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item style="float:left">
          <el-button type="primary" size="small" @click="addData()" icon="el-icon-plus" >新增</el-button>
        </el-form-item>
        <el-form-item style="float:right">
          <el-button type="primary" size="small" @click="resetData()">重置</el-button>
        </el-form-item>
        <el-form-item style="float:right">
          <el-button type="primary" size="small" @click="searchData()">查询</el-button>
        </el-form-item>
        <el-form-item label="中文标识：" style="float:right">
          <el-input placeholder="请输入中文标识" size="small" v-model="formInline.tagZh"></el-input>
        </el-form-item>
        <el-form-item label="英文标识：" style="float:right">
          <el-input placeholder="请输入英文标识" size="small" v-model="formInline.tag"></el-input>
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
        @selection-change="handleSelectionChange"
        :header-cell-style="{background:'#eef1f6',color:'#606266'}"
      >
        <el-table-column label="序号" type="index" width="50" align="center">
          <template slot-scope="scope">
            <span>{{(page - 1) * pageSize + scope.$index + 1}}</span>
          </template>
        </el-table-column>
        <el-table-column label="英文标识" min-width="80" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.tag}}</span>
          </template>
        </el-table-column>
        <el-table-column label="中文标识" min-width="80" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.tagZh}}</span>
          </template>
        </el-table-column>
        <el-table-column label="描述" min-width="80" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.description}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作" min-width="150">
          <template slot-scope="scope">
            <div>
              <el-link type="primary" @click="editData(scope.row)">编辑</el-link>
              <el-divider direction="vertical"></el-divider>
              <el-link type="danger" @click="deleteRowData(scope.row)">删除</el-link>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        background
        @current-change="handleCurrentChange"
        :current-page.sync="page"
        :page-size="pageSize"
        layout="total, prev, pager, next"
        :total="totalNum">
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
        <el-form-item label="英文标识" prop="tag">
          <el-input v-model="ruleForm.tag" placeholder="请输入英文标识"></el-input>
        </el-form-item>
        <el-form-item label="中文标识" prop="tagZh">
          <el-input v-model="ruleForm.tagZh" placeholder="请输入中文标识"></el-input>
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input v-model="ruleForm.description" placeholder="请添加描述"></el-input>
        </el-form-item>
      </el-form>
      <el-divider></el-divider>
      <div class="form-style1" >
        <span style="font-size:23px">数据项</span>
        <el-table
          :data="tempList.dictInfoList"
          v-loading="listLoading"
          element-loading-text="Loading"
          fit
          highlight-current-row
          tooltip-effect="dark"
          style="width: 100%"
          :header-cell-style="{background:'#eef1f6',color:'#606266'}"
        >
          <el-table-column label="序号" type="index" width="50" align="center">
            <template slot-scope="scope">
              <span >{{scope.$index}}</span>
            </template>
          </el-table-column>
          <el-table-column label="顺序" min-width="100" align="center">
            <template slot-scope="scope">
              <span >{{scope.row.sequence}}</span>
            </template>
          </el-table-column>
          <el-table-column label="文本" min-width="100" align="center">
            <template slot-scope="scope">
              <span>{{scope.row.content}}</span>
            </template>
          </el-table-column>
          <el-table-column label="是否默认值" min-width="100" align="center">
            <template slot-scope="scope">
              <span v-if="!scope.row.isDefault">否</span>
              <span v-if="scope.row.isDefault">是</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" min-width="150" align="center">
            <template slot-scope="scope">
              <div >
                <i class="el-icon-edit" @click="editItem(scope.row)"></i>
                <i
                  class="el-icon-delete"
                  @click="deleteItem(scope.row)"
                  style="color:red;margin-left:20px"
                ></i>
              </div>
            </template>
          </el-table-column>
        </el-table>
        <el-button class="el-icon-circle-plus"  @click="addItem()" style="color:#409eff;font-size:23px;border:none">
          新增数据项
        </el-button>
      </div>
      <div slot="footer" class="dialog-footer" style="text-align: center;margin-bottom:10px">
        <el-button type="primary" @click="submitForm('ruleForm')" style="width:180px">提交</el-button>
        <el-button @click="resetForm('ruleForm')" style="width:180px">取消</el-button>
      </div>
      
      <div
        slot="footer"
        class="dialog-footer"
        style="text-align: center;color: #5d5b5b;font-size:14px"
        v-if="title=='新增数据字典'"
      >
      </div>
    </el-dialog>
    <el-dialog :title="title2" :visible.sync="dialogFormVisible2">
      <el-form
        :model="itemForm"
        :rules="itemFormRules"
        ref="itemForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="顺序" prop="sequence">
          <el-tooltip effect="dark" placement="top">
            <div slot="content">
              该数据项在该数据字典中的顺序，必须为数值
            </div>
            <el-input
              v-model.number="itemForm.sequence"
              placeholder="请输入顺序"
            ></el-input>
          </el-tooltip>
        </el-form-item>
        <el-form-item label="文本" prop="content">
          <el-tooltip effect="dark" placement="top">
            <div slot="content">
              数据项的值，例如“男”、“女”
            </div>
            <el-input v-model="itemForm.content" placeholder="请输入文本"></el-input>
          </el-tooltip>
        </el-form-item>
        <el-form-item label="默认值">
          <el-radio v-model="itemForm.isDefault" :label="true">是</el-radio>
          <el-radio v-model="itemForm.isDefault" :label="false">否</el-radio>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" style="text-align: center;margin-bottom:10px">
        <el-button type="primary" @click="submitItemForm('itemForm')" style="width:180px">提交</el-button>
        <el-button @click="resetItemForm('itemForm')" style="width:180px">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      list: [],
      tempList:{
        dict : {
        description: "",
        id: 0,
        tag: "",
        tagZh: ""
        },
        dictInfoList : [
        ]
      },
      listLoading: false,
      dialogFormVisible: false,
      ruleForm: {
        id:"",
        tag: "",
        tagZh: "",
        description: ""
      },
      dialogFormVisible2: false,
      itemForm: {
        sequence: "",
        content: "",
        isDefault: false
      },
      value: "",
      title: "新增数据字典",
      title2: "新增数据项",
      itemFormRules: {
        sequence: [
          { required: true, message: "请输入顺序", trigger: "blur" },
          { type: "number", message: "值必须为数字值" }
        ],
        content: [{ required: true, message: "请输入文本", trigger: "blur" }]
      },
      rules: {
        tag: [{ required: true, message: "请输入英文标识", trigger: "blur" }],
        tagZh: [{ required: true, message: "请输入中文标识", trigger: "blur" }],
        description: [{ required: true, message: "请添加描述", trigger: "blur" }]
      },
      totalNum: 0,
      pageSize: 10,
      formInline: {
        tag: "",
        tagZh: ""
      },
      page: 1,
      currentPage1: 1,
      edit: false
    };
  },
  created() {
    this.showUserInfo(this.page);
  },
  methods: {
    deleteRowData(row) {
      this.$confirm("您确定要删除该数据字典及其字典项吗？", "删除", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.listLoading = true;
          var that = this;
          this.$axios.delete("/dict/manage/"  + row.id).then(
            res => {
              if (res) {
                // this.$alert("数据字典删除成功", "成功", {
                //   confirmButtonText: "确定"
                // });
                that.showUserInfo(1);
              } else {
                this.$alert( "失败", {
                  confirmButtonText: "确定"
                });
                that.showUserInfo(this.page);
              }
              this.listLoading = false;
            },
          );
        })
        this.listLoading = false;
    },
    searchData() {
      this.listLoading = true;
      // this.page = 1;
      var data = {
        tag : this.formInline.tag,
        tagZh : this.formInline.tagZh
      }
      this.$axios.get('/dict/manage/?tag='+data.tag +'&tagZh='+ data.tagZh +'&currentPage=' + this.page).then(res=>{
        if(res){
          this.list = res.data;
          this.totalNum = res.total;
          this.listLoading = false;
          if(res.data.length < 1){
            this.$alert("请选择其他中文/英文标识","找不到所要查询的字典",  {
              confirmButtonText: "确定"
            });
          }
        }
      })
    },
    filterState(state) {
      if (state == "1") {
        return true;
      } else {
        return false;
      }
    },
    showUserInfo(page) {
      // this.totalNum = 1;
      this.listLoading = true;
      this.page = page;
      this.$axios.get('/dict/manage/?currentPage=' + this.page).then(res =>{
        console.log(res.data)
        this.list = res.data;
        //获取用户信息
        this.listLoading = false;
        this.totalNum = res.total;
        })
      
    },
    reset() {
      this.ruleForm.tag = "";
      this.ruleForm.tagZh = "";
      this.ruleForm.description = "";
      this.tempList.dictInfoList = []
    },
    resetItemForm(formName) {
      this.dialogFormVisible2 = false;
      this.$refs[formName].resetFields();
    },
    addData() {
        this.reset();
        this.dialogFormVisible = true;
        this.title = "新增数据字典";
        var data;
    },
    addItem() {
      //新增数据项
      if(this.ruleForm.tag == "" || this.ruleForm.tag == undefined){
        this.$alert("请先填写数据字典，再添加数据项","注意")
        return;
      }
      this.title2 = "新增数据项"
      this.itemForm.sequence = "";
      this.itemForm.content = "";
      this.itemForm.isDefault = false;
      this.dialogFormVisible2 = true;
      // this.title = "新增数据项";

    },
    editItem(row) {
      //修改数据项
      this.title2 = "修改数据项"
      this.listLoading = true;
      this.row = row;
      this.itemForm.sequence = parseInt(row.sequence);
      this.itemForm.content = row.content;
      this.itemForm.isDefault = row.isDefault;
      this.dialogFormVisible2 = true;
      this.index = row.index;
      this.edit = true;
      this.listLoading = false;
    },
    deleteItem(row) {
      this.row = row;
      this.$confirm("确定要删除该数据项？", "删除数据项", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "info"
        })
          .then(() => {
            for (var i in this.tempList.dictInfoList) {
              if (
                (this.tempList.dictInfoList[i].index == this.row.index &&
                  this.tempList.dictInfoList[i].index != null &&
                  this.tempList.dictInfoList[i].index != undefined &&
                  this.row.index != null &&
                  this.row.index != undefined) ||
                (this.tempList.dictInfoList[i].id == this.row.id &&
                  this.tempList.dictInfoList[i].id != null &&
                  this.tempList.dictInfoList[i].id != undefined &&
                  this.row.id != null &&
                  this.row.id != undefined)
              ) {
                this.tempList.dictInfoList.splice(i,1);
                break;
              }
            }
          })
    },
    submitForm(formName) {
      var that = this
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.title == "新增数据字典") {
            //新增字典
            this.tempList.dict = this.ruleForm;
            console.log(this.tempList);
            this.$axios.post('/dict/manage/',this.tempList).then(res=>{
              if(res){
                this.$alert("添加成功！")
                that.showUserInfo(this.page);
              }
            })
          } else {
            //修改字典
            this.tempList.dict = this.ruleForm;
            console.log('ceid');
            console.log(this.tempList)
            this.$axios.put('/dict/manage/',this.tempList).then(res=>{
              if(res){
                this.$alert('修改成功')
                that.showUserInfo(this.page);
              }
            })
          }
          this.dialogFormVisible = false;
        }
      else{
        console.log("修改无效")
      }
      });
    },
    submitItemForm(formName) {
      //提交数据项
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (!this.edit) {
            var index = this.tempList.dictInfoList.length;
            this.tempList.dictInfoList.push({
              sequence : this.itemForm.sequence,
              content: this.itemForm.content,
              isDefault : this.itemForm.isDefault,
              index: index,
              tag: this.ruleForm.tag
            })
          } else {
            this.tempList.dict = this.ruleForm;
            for (var i in this.tempList.dictInfoList) {
              if (
                (this.tempList.dictInfoList[i].index == this.row.index &&
                  this.tempList.dictInfoList[i].index != null &&
                  this.tempList.dictInfoList[i].index != undefined &&
                  this.row.index != null &&
                  this.row.index != undefined) ||
                (this.tempList.dictInfoList[i].id == this.row.id &&
                  this.tempList.dictInfoList[i].id != null &&
                  this.tempList.dictInfoList[i].id != undefined &&
                  this.row.id != null &&
                  this.row.id != undefined)
              ) {
                this.tempList.dictInfoList[i].sequence = this.itemForm.sequence;
                this.tempList.dictInfoList[i].content = this.itemForm.content;
                this.tempList.dictInfoList[i].isDefault = this.itemForm.isDefault;
                //数据项与数据字典绑定
                this.tempList.dictInfoList[i].tag = this.ruleForm.tag;
                break;
              }
            }
            this.edit = false;
          }
          this.dialogFormVisible2 = false;   
        }
      });
      // console.log(this.tempList);
    },
    resetForm(formName) {
      this.dialogFormVisible = false;
      this.$refs[formName].resetFields();
      this.reset();
      this.showUserInfo(this.page);
    },
    handleCurrentChange(val) {
      this.page = val;
      this.showUserInfo(this.page);
    },
    resetData() {
      this.formInline.tag = "";
      this.formInline.tagZh = "";
      this.page = 1;
      this.showUserInfo(this.page);
    },
    editData(row) {
      this.ruleForm = row;
      this.$axios.get('/dict/manage/info/'+this.ruleForm.tag).then(res=>{
        this.tempList.dictInfoList = res;
        this.tempList.dict = this.ruleForm;
      })
      this.title = "修改数据字典";
      this.dialogFormVisible = true;
    },
  },
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

  min-height: 85vh;
}
</style>