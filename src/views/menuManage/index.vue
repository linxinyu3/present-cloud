<template>
  <div class="app-container">
    <div class="form-style">
      <el-form  class="demo-form-inline">
        <el-form-item style="float:left">
          <el-button type="primary" size="small" @click="addData()" icon="el-icon-plus">新增菜单</el-button>
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
        <el-table-column label="菜单名称" min-width="70" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.name}}</span>
          </template>
        </el-table-column>
        <el-table-column label="图标" min-width="50" align="center">
          <template slot-scope="scope">
            <i :class="scope.row.iconCls"></i>
          </template>
        </el-table-column>
        <el-table-column label="菜单排序" min-width="50" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.sequence}}</span>
          </template>
        </el-table-column>
        <el-table-column label="是否启用" min-width="70" align="center">
          <template slot-scope="scope">
            <i class="el-icon-check" v-if="scope.row.enabled== true" style="color:green"></i>
            <i class="el-icon-close" v-if="scope.row.enabled== false" style="color:red"></i>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作" min-width="80">
          <template slot-scope="scope">
            <div>
              <el-button @click.native.prevent="moveRow(scope.$index, scope.row, 'up')" type="text"> 上移 </el-button>
              <el-divider direction="vertical"></el-divider>
              <el-button @click.native.prevent="moveRow(scope.$index, scope.row, 'down')" type="text"> 下移 </el-button>
              <el-divider direction="vertical"></el-divider>
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
        :model="menuForm"
        :rules="menus"
        ref="menuForm"
        label-width="150px"
        class="demo-menuForm"
      >
        <el-form-item label="菜单名称" prop="name">
          <el-input v-model="menuForm.name"></el-input>
        </el-form-item>
        <el-form-item label="图标">
          <el-input v-model="menuForm.iconCls"></el-input>
        </el-form-item>
        <el-form-item>
          <span>图标名：https://element.eleme.cn/#/zh-CN/component/icon</span>
        </el-form-item>
        <el-form-item label="菜单状态">
          <el-radio v-model="menuForm.enabled" :label="true">启用</el-radio>
          <el-radio v-model="menuForm.enabled" :label="false">禁止</el-radio>
        </el-form-item>
        <!-- <el-form-item label="显示排序" prop="sequence">
          <el-input v-model="menuForm.sequence" disabled></el-input>
        </el-form-item> -->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm('menuForm')">提交</el-button>
        <el-button @click="resetForm('menuForm')">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      list: [],
      tableList: [
        {
          label: "菜单名称",
          prop: "name"
        },
        {
          label: "图标",
          prop: "iconCls"
        },
        {
          label: "排序",
          prop: "sequence"
        },
        {
          label: "是否启用",
          prop: "enabled"
        },
      ],
      AllData: [],
      listLoading: false,
      dialogFormVisible: false,
      menuForm: {
        name: "",
        iconCls: "",
        enabled: true,
        sequence: "",
      },
      menus: {
        name: [{ required: true, message: "请输入", trigger: "blur" }],
        sequence: [{ required: true, message: "请输入", trigger: "blur" }],
      },
      totalNum: 0,
      title: "新增菜单",
      pageSize: 10,
      page: 1,
    };
  },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: "success",
        draft: "gray",
        deleted: "danger"
      };
      return statusMap[status];
    }
  },
  created() {
    this.showMenuData(this.page);
  },
  methods: {
    moveRow(index, e, type) {
      if (type === 'up') {
        if (index <= 0) {
          this.$message({
            message: '已经是第一条，上移失败',
            type: 'warning'
          });
        }else{
          // 在上一项插入该项
          this.list.splice(index - 1, 0, (this.list[index]))
          // 删除后一项
          this.list.splice(index + 1, 1)
        }
      } else if (type === 'down') {
        if (index === (this.list.length - 1)) {
          this.$message({
                    message: '已经是最后一条，下移失败',
                    type: 'warning'
                });
        }else{
          // 在下一项插入该项
          this.list.splice(index + 2, 0, (this.list[index]))
          // 删除前一项
          this.list.splice(index, 1)
        }
      }
      var count = 1
      var data = []
      for(var i in this.list){
        this.list[i].sequence = count++
        data.push({
          id: this.list[i].id,
          sequence: this.list[i].sequence
        })
      }
      this.$axios.put("/menu/manage/seq", data).then( res =>{
        if(res){
          // this.showMenuData()
          location.reload()
        }
      })
    },
    reset() {
      this.menuForm.name = "";
      this.menuForm.iconCls = "";
      this.menuForm.enabled = true;
      this.menuForm.sequence = "";
    },
    addData() {
      this.reset();
      this.dialogFormVisible = true;
      this.title = "新增菜单";
      var max = 0;
      for(var i in this.list){
        if(max <= this.list[i].sequence){
          max = this.list[i].sequence + 1
        }
      }
      this.menuForm.sequence = max
    },
    deleteUser(row) {
      var id = row.id;
      this.$confirm("确定要删除该菜单？", "删除菜单", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$axios.delete("/menu/manage/?id=" + id).then(res => {
            if (res) {
              location.reload();
              this.showMenuData(this.page);
            }
          });
        })
        .catch(() => {});
    },
    editData(row) {
      this.menuForm = row;
      this.title = "编辑菜单";
      this.dialogFormVisible = true;
    },
    showMenuData(page) {
      this.list = [];
      // this.listLoading = true;
      this.page = page;
      var data = {
        page: this.page
      };
      this.$axios.get("/menu/manage/").then(res => {
        this.listLoading = false;
        if(res){
          this.list = res
        }
      });  
    },
    submitForm(formName) {
      var data = {
        id: this.menuForm.id,
        name: this.menuForm.name,
        iconCls: this.menuForm.iconCls,
        enabled: this.menuForm.enabled,
        sequence: this.menuForm.sequence,
      };
      var addData = {
        name: this.menuForm.name,
        iconCls: this.menuForm.iconCls,
        enabled: this.menuForm.enabled,
        sequence: this.menuForm.sequence,
      };
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.dialogFormVisible = false;
          if (this.title == "新增菜单") {
            this.$axios.post("/menu/manage/", addData).then(res => {
              if (res) {
                location.reload();
                this.showMenuData(this.page);
              }
              this.$refs[formName].resetFields();
            });
          } else {
            console.log(data)
            this.$axios.put("/menu/manage/", data).then(res => {
              if (res) {
                location.reload();
                this.showMenuData(this.page);
              } else {
                this.showMenuData(this.page);
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
      this.showMenuData(this.page);
    },
    handleCurrentChange(val) {
      this.page = val;
      this.showMenuData(this.page);
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
