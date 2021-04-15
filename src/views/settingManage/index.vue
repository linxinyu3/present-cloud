<template>
  <div class="app-container">
    <div class="form-style">
      <el-form
        ref="experienceForm"
        :model="experienceForm"
        label-width="150px"
        style="width: 80%;margin: 0 20px;"
        v-loading="loading"
      >
        <el-form-item
          label="签到经验值："
          prop="settingSign.signExp"
          :rules="[
            { required: true, message: '签到经验值不能为空'},
            { type: 'number', message: '签到经验值必须为数字值'}
          ]"
        >
          <el-tooltip effect="dark" placement="top">
            <div slot="content">
              学生参与一次签到可获取的经验值
            </div>
            <el-input v-model.number="experienceForm.settingSign.signExp"></el-input>
          </el-tooltip>
        </el-form-item>
        <el-form-item
          label="签到距离KM："
          prop="settingSign.signDistance"
          :rules="[
            { required: true, message: '距离不能为空'},
            { type: 'number', message: '距离必须为整数值'}
          ]"
        >
          <el-tooltip effect="dark" placement="top">
            <div slot="content">
              默认0KM，表示不限定距离。
            </div>
            <el-input v-model.number="experienceForm.settingSign.signDistance"></el-input>
          </el-tooltip>
        </el-form-item>
        <el-row>
          <el-col :span="11">
            <el-form-item
              v-for="(level, index) in experienceForm.settingLevelList"
              :label="'出勤等级' + (index+1)"
              :key="level.key"
              :prop="'settingLevelList.' + index + '.lv'"
              :rules="[
                {required: true, message: '等级不能为空', trigger: 'blur'},
                {type: 'number', message: '等级必须为数字值'}]"
            >
              <el-input v-model.number="level.lv">
                <template slot="prepend">LV</template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="13">
            <el-form-item
              v-for="(attendance, index) in experienceForm.settingLevelList"
              :label="'出勤率' + (index+1)"
              :key="attendance.key"
              :prop="'settingLevelList.' + index+'.rightBorder'"
              :rules="{
                 required: true, message: '出勤率不能为空', trigger: 'blur'}"
            >
              <el-row :gutter="20">
                <el-col :span="18">
                  <el-row :gutter="20">
                    <el-col :span="11">
                      <el-input 
                      v-model="attendance.leftBorder" 
                      :disabled = "index == 0">
                        <template slot="append" style="padding:0 10px">%</template>
                      </el-input>
                    </el-col>
                    <el-col :span="1">-</el-col>
                    <el-col :span="11">
                      <el-input
                        v-model="attendance.rightBorder"
                      >
                        <template slot="append" style="padding:0 10px">%</template>
                      </el-input>
                    </el-col>
                  </el-row>
                </el-col>
                <el-col :span="1" style="margin-right:25px">
                  <i
                    class="el-icon-circle-plus"
                    @click="addLevelAndAttend()"
                    style="color:#409eff;font-size:27px;"
                    v-show="index+1==experienceForm.settingLevelList.length&&attendance.rightBorder!=''"
                  ></i>
                </el-col>
                <el-col :span="1">
                  <i
                    class="el-icon-remove"
                    @click.prevent="removeLevelAndAttend(attendance)"
                    style="color:red;font-size:27px"
                    v-show="index+1==experienceForm.settingLevelList.length && experienceForm.settingLevelList.length>1 "
                  ></i>
                </el-col>
              </el-row>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item style="text-align:center">
          <el-button type="primary" @click="onSubmit('experienceForm')" style="width:40%">保存</el-button>
          <el-button @click="resetForm('experienceForm')" style="width:40%">设置为默认值</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      experienceForm: {
        settingSign: {
            id: null,
            signExp: "",
            signDistance: 0
        },
        settingLevelList: [
          {
            id: null,
            lv: 1,
            leftBorder: 0,
            rightBorder: null
          }
        ],
      },
      experienceFormInit: {
        settingSign: {
            id: 1,
            signExp: 2,
            signDistance: 3
        },
        settingLevelList: [
          {
            id: 11,
            lv: 1,
            leftBorder: 0,
            rightBorder: 20
          },
          {
            id: 12,
            lv: 2,
            leftBorder: 21,
            rightBorder: 40
          },
          {
            id: 13,
            lv: 3,
            leftBorder: 41,
            rightBorder: 60
          },
          {
            id: 14,
            lv: 4,
            leftBorder: 61,
            rightBorder: 80
          },
          {
            id: 15,
            lv: 5,
            leftBorder: 81,
            rightBorder: 100
          },
        ],
      },
      loading: false,
    };
  },
  created() {
    this.getData();
  },
  methods: {
    getData() {
      this.loading = true;
      this.$axios.get("/setting/manage/").then(
        res => {
          if(res){
            console.log(res)
            this.experienceForm.settingSign = res.settingSign
            this.experienceForm.settingLevelList = res.settingLevelList;
          }
        },
        res => {
          this.$router.push({
            path: "/" + res
          });
        }
      );
      this.loading = false;
    },
    removeLevelAndAttend(attendItem) {
      var index1 = this.experienceForm.settingLevelList.indexOf(attendItem);
      if (index1 !== -1) {
        this.experienceForm.settingLevelList.splice(index1, 1);
      }
    },
    addLevelAndAttend() {
      this.experienceForm.settingLevelList.push({
        id: null,
        lv: null,
        leftBorder: null,
        rightBorder: null,
      });
    },
    onSubmit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.isContinuityNum()) {
            this.loading = true;
            var data = this.experienceForm;
            this.$axios.put("/setting/manage/", data).then(
              res => {
                if (res) {
                  // this.$alert("成功", "成功", {
                  //   confirmButtonText: "确定"
                  // });
                  this.getData();
                } else {
                  this.$alert(res.message, "失败", {
                    confirmButtonText: "确定"
                  });
                }
              },
            );
            this.loading = false;
          } else {
            this.$alert("设置的等级不连续", "失败", {
              confirmButtonText: "确定"
            });
          }
        } else {
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$confirm("确定要重置为默认值？", "重置为默认值", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
          
        })
        .then(() => {
          this.loading = true;
          this.$axios.put("/setting/manage/", this.experienceFormInit).then(
            res => {
              if (res) {
                this.getData();
              } else {
                this.$alert(res.message, "失败", {
                  confirmButtonText: "确定"
                });
              }
            })
        })
    },
    //判断等级是否是连续的
    isContinuityNum() {
      var num = [];
      for (var i in this.experienceForm.settingLevelList) {
        num.push(this.experienceForm.settingLevelList[i].lv);
      }
      let array = [];
      if (num instanceof Array) {
        array = [...num];
      } else {
        array = Array.from(num.toString()); //转换为数组
      }

      var i = array[0];
      var isContinuation = true;
      for (var e in array) {
        if (array[e] != i) {
          isContinuation = false;
          break;
        }
        i++;
      }
      return isContinuation;
    }
  }
};
</script>
<style>
.el-input-group__append {
  padding: 0 10px !important;
}
</style>