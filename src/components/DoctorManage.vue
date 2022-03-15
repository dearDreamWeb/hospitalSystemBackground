<template>
  <div>
    <div class="container">
      <div class="handle-box">
        <el-input
          v-model="name"
          placeholder="用户名"
          class="handle-input mr10"
        ></el-input>
        <el-button type="primary" icon="el-icon-search" @click="handleSearch"
          >搜索</el-button
        >
        <el-button type="primary" icon="el-icon-plus" @click="addDoctorHandle"
          >新增医生</el-button
        >
      </div>
      <el-table
        :data="tableData"
        border
        class="table"
        ref="multipleTable"
        header-cell-class-name="table-header"
      >
        <el-table-column
          prop="id"
          label="ID"
          width="55"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="name"
          width="80"
          label="医生名字"
        ></el-table-column>
        <el-table-column
          prop="section"
          width="80"
          label="科室"
        ></el-table-column>
        <el-table-column
          prop="outpatientId"
          width="150"
          label="门诊"
        ></el-table-column>
        <el-table-column
          prop="technicalId"
          width="50"
          label="职称"
        ></el-table-column>
        <el-table-column
          prop="workAge"
          width="50"
          label="工龄"
        ></el-table-column>
        <el-table-column prop="age" width="50" label="年龄"></el-table-column>
        <el-table-column prop="sex" width="50" label="性别"></el-table-column>
        <el-table-column prop="adept" width="50" label="简介"></el-table-column>

        <el-table-column width="150" label="头像(查看大图)" align="center">
          <template #default="scope">
            <el-image
              class="table-td-thumb"
              :src="scope.row.avatarUrl"
              :preview-src-list="[scope.row.avatarUrl]"
            >
            </el-image>
          </template>
        </el-table-column>
        <el-table-column
          prop="phone"
          width="120"
          label="手机号码"
        ></el-table-column>
        <el-table-column
          prop="date"
          width="120"
          label="注册时间"
        ></el-table-column>
        <el-table-column label="操作" width="180" align="center" fixed="right">
          <template #default="scope">
            <el-button
              type="text"
              icon="el-icon-edit"
              @click="handleEdit(scope.$index, scope.row)"
              >编辑
            </el-button>
            <el-button
              type="text"
              icon="el-icon-delete"
              class="red"
              @click="handleDelete(scope.$index, scope.row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination
          background
          layout="total, prev, pager, next"
          :current-page="query.page"
          :page-size="query.pageSize"
          :total="pageTotal"
          @current-change="handlePageChange"
        ></el-pagination>
      </div>
    </div>

    <!-- 编辑弹出框 -->
    <el-dialog title="编辑" v-model="editVisible" width="30%">
      <el-form ref="ruleFormRef" :model="form" label-width="70px">
        <el-form-item label="用户名" prop="name">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="form.phone"></el-input>
        </el-form-item>
        <el-form-item label="工龄" prop="workAge">
          <el-input v-model="form.workAge"></el-input>
        </el-form-item>
        <el-form-item label="年龄" prop="age">
          <el-input v-model="form.age"></el-input>
        </el-form-item>
        <el-form-item label="性别" prop="sex">
          <el-radio-group v-model="form.sex">
            <el-radio label="男" value="男"></el-radio>
            <el-radio label="女" value="女"></el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="擅长" prop="adept">
          <el-input v-model="form.adept"></el-input>
        </el-form-item>
        <el-form-item label="科室" prop="section">
          <el-select
            v-model="form.section"
            @change="sectionChange"
            placeholder="选择科室"
          >
            <el-option
              v-for="item in allSections"
              :key="item.id"
              :label="item.section"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="门诊" prop="outpatientId">
          <el-select v-model="form.outpatientId" placeholder="选择门诊">
            <el-option
              v-for="item in allOutpatient"
              :key="item.id"
              :label="item.outpatientName"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="头像" prop="avatarUrl" class="form-avatar">
          <AvatarUpload :imageUrl="form.avatarUrl || ''" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="editVisible = false">取 消</el-button>
          <el-button type="primary" @click="saveEdit">确 定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { ref, reactive, onMounted } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import {
  addDoctor,
  deleteDoctor,
  updateDoctor,
  getDoctor,
  getSection,
  getOutpatient,
} from "../api/index";
import AvatarUpload from "../components/AvatarUpload.vue";

export default {
  name: "doctorManage",
  components: { AvatarUpload },
  setup() {
    const query = reactive({
      page: 1,
      pageSize: 10,
    });
    const name = reactive("");
    const tableData = ref([]);
    const pageTotal = ref(0);
    const ruleFormRef = ref();
    const modelStatus = ref(0); // 0: 编辑医生 1：新增医生
    const allSections = ref([]); // 全部科室
    const allOutpatient = ref([]); // 全部门诊
    // 表格编辑时弹窗和保存
    const editVisible = ref(false);
    let form = ref({});

    onMounted(() => {
      getData();
      getSectionHandle();
    });

    // 获取表格数据
    const getData = async () => {
      const res = await getDoctor({ name, ...query });
      if (res.success) {
        tableData.value = res.data.items;
      }
    };

    // 获取科室
    const getSectionHandle = async () => {
      const res = await getSection();
      if (res.success) {
        allSections.value = res.data.items;
      }
    };

    // 查询操作
    const handleSearch = () => {
      query.page = 1;
      getData();
    };

    // 新增医生
    const addDoctorHandle = () => {
      modelStatus.value = 1;
      editVisible.value = true;
      form.value = {};
    };

    // 分页导航
    const handlePageChange = (val) => {
      query.page = val;
    };

    // 删除操作
    const handleDelete = (index) => {
      // 二次确认删除
      ElMessageBox.confirm("确定要删除吗？", "提示", {
        type: "warning",
      })
        .then(() => {
          ElMessage.success("删除成功");
          tableData.value.splice(index, 1);
        })
        .catch(() => {});
    };

    // 选择科室
    const sectionChange = async (id) => {
      const res = await getOutpatient({ sectionId: id });
      if (res.success) {
        if (res.data.items.length) {
          allOutpatient.value = res.data.items;
        } else {
          ElMessage.info("该科室没有门诊");
        }
      }
    };

    const handleEdit = (index, row) => {
      modelStatus.value = 0;
      editVisible.value = true;
    };

    const saveEdit = async () => {
      editVisible.value = false;
      if (modelStatus.value === 0) {
        // const res = await addDoctor({ ...form.value });
        // if (!res.success) {
        //   ElMessage.info(res.message);
        //   return;
        // }
        // ElMessage.success("修改职称成功");
        getData();
      } else if (modelStatus.value === 1) {
        const res = await addDoctor({ ...form.value });
        if (!res.success) {
          ElMessage.info(res.message);
          return;
        }
        ElMessage.success("修改职称成功");
        getData();
      }
    };

    return {
      name,
      query,
      tableData,
      pageTotal,
      editVisible,
      form,
      modelStatus,
      ruleFormRef,
      allSections,
      allOutpatient,
      handleSearch,
      handlePageChange,
      handleDelete,
      handleEdit,
      saveEdit,
      addDoctorHandle,
      sectionChange,
    };
  },
};
</script>

<style scoped>
.handle-box {
  margin-bottom: 20px;
}

.handle-select {
  width: 120px;
}

.handle-input {
  width: 300px;
  display: inline-block;
}
.table {
  width: 100%;
  font-size: 14px;
}
.red {
  color: #ff0000;
}
.mr10 {
  margin-right: 10px;
}
.table-td-thumb {
  display: block;
  margin: auto;
  width: 40px;
  height: 40px;
}

.el-form-item {
  margin: 12px 0;
}
</style>
