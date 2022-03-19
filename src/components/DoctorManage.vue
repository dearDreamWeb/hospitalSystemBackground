<template>
  <div>
    <div class="container">
      <div class="handle-box">
        <el-input
          v-model="name"
          placeholder="请输入用户名或手机号"
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
          width="300"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="name"
          width="80"
          label="医生名字"
        ></el-table-column>
        <el-table-column
          prop="sectionName"
          width="80"
          label="科室"
        ></el-table-column>
        <el-table-column
          prop="outpatientName"
          width="150"
          label="门诊"
        ></el-table-column>
        <el-table-column
          prop="technicalName"
          width="150"
          label="职称"
        ></el-table-column>
        <el-table-column
          prop="phone"
          width="120"
          label="手机号码"
        ></el-table-column>
        <el-table-column
          prop="workAge"
          width="50"
          label="工龄"
        ></el-table-column>
        <el-table-column prop="age" width="50" label="年龄"></el-table-column>
        <el-table-column prop="sex" width="50" label="性别"></el-table-column>
        <el-table-column
          prop="adept"
          min-width="300"
          label="简介"
        ></el-table-column>

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
        <el-table-column prop="createTime" width="200" label="注册时间">
          <template #default="scope">
            {{ moment(scope.row.createTime).format("YYYY-MM-DD HH:mm:ss") }}
          </template>
        </el-table-column>
        <el-table-column width="200" prop="updateTime" label="更新时间">
          <template #default="scope">
            {{
              moment(scope.row.updateTime || scope.row.createTime).format(
                "YYYY-MM-DD HH:mm:ss"
              )
            }}
          </template>
        </el-table-column>
        <el-table-column
          prop="status"
          width="180"
          label="状态"
          align="center"
          fixed="right"
        >
          <template #default="scope">
            <el-check-tag
              :checked="!scope.row.status"
              @click="changeStatus(scope.row, scope.$index, 0)"
              >工作中</el-check-tag
            >
            <el-check-tag
              :checked="scope.row.status"
              @click="changeStatus(scope.row, scope.$index, 1)"
              style="margin-left: 12px"
              >请假中</el-check-tag
            >
          </template>
        </el-table-column>
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
              @click="handleDelete(scope.row.id)"
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
    <el-dialog title="编辑" v-model="editVisible" width="40%">
      <el-form ref="ruleFormRef" :model="form" label-width="70px">
        <el-form-item label="用户名" prop="name">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input
            v-model="form.phone"
            :disabled="modelStatus === 0"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="密码"
          prop="pwd"
          v-if="modelStatus === 1"
          type="password"
          show-password
        >
          <el-input v-model="form.pwd"></el-input>
        </el-form-item>
        <el-form-item label="工龄" prop="workAge">
          <el-input-number
            v-model="form.workAge"
            :min="1"
            :max="100"
          ></el-input-number>
        </el-form-item>
        <el-form-item label="年龄" prop="age">
          <el-input-number
            v-model="form.age"
            :min="1"
            :max="100"
          ></el-input-number>
        </el-form-item>
        <el-form-item label="性别" prop="sex">
          <el-radio-group v-model="form.sex">
            <el-radio label="男" value="男"></el-radio>
            <el-radio label="女" value="女"></el-radio>
          </el-radio-group>
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
        <el-form-item label="职称" prop="technicalId">
          <el-select v-model="form.technicalId" placeholder="选择职称">
            <el-option
              v-for="item in allTechnical"
              :key="item.id"
              :label="item.technical"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="头像" prop="avatarUrl" class="form-avatar">
          <AvatarUpload
            :imageUrl="avatarUrl || ''"
            @changeImage="changeImage"
          />
        </el-form-item>
        <el-form-item label="擅长" prop="adept">
          <el-input
            type="textarea"
            v-model="form.adept"
            maxlength="100"
            show-word-limit
            rows="4"
          ></el-input>
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
import moment from "moment";
import {
  addDoctor,
  deleteDoctor,
  updateDoctor,
  getTechnical,
  getDoctor,
  getSection,
  getOutpatient,
  updateDoctorStatus,
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
    const name = ref("");
    const tableData = ref([]);
    const pageTotal = ref(0);
    const ruleFormRef = ref();
    const modelStatus = ref(0); // 0: 编辑医生 1：新增医生
    const allSections = ref([]); // 全部科室
    const allOutpatient = ref([]); // 全部门诊
    const allTechnical = ref([]); // 全部职称
    // 表格编辑时弹窗和保存
    const editVisible = ref(false);
    let form = ref({});
    const avatarUrl = ref("");

    onMounted(() => {
      getData();
      getSectionHandle();
      getAllTechnical();
    });

    // 获取表格数据
    const getData = async () => {
      const res = await getDoctor({ name: name.value, ...query });
      if (res.success) {
        tableData.value = res.data.items;
        pageTotal.value = res.data.total;
      }
    };

    // 获取科室
    const getSectionHandle = async () => {
      const res = await getSection();
      if (res.success) {
        allSections.value = res.data.items;
      }
    };

    // 获取职称
    const getAllTechnical = async () => {
      const res = await getTechnical();
      if (res.success) {
        allTechnical.value = res.data.items;
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
      avatarUrl.value = "";
    };

    // 分页导航
    const handlePageChange = (val) => {
      query.page = val;
      getData();
    };

    // 图片变更
    const changeImage = (data) => {
      const { absolutePath, name } = data;
      form.value.avatarName = name;
      avatarUrl.value = absolutePath;
    };

    // 删除操作
    const handleDelete = (id) => {
      // 二次确认删除
      ElMessageBox.confirm("确定要删除吗？", "提示", {
        type: "warning",
      })
        .then(async () => {
          const res = await deleteDoctor(id);
          if (!res.success) {
            ElMessage.info(res.message);
            return;
          }
          ElMessage.success("删除成功");
          getData();
        })
        .catch(() => {});
    };

    // 选择科室
    const sectionChange = async (id) => {
      form.value.outpatientId = "";
      const res = await getOutpatient({ sectionId: id });
      if (res.success) {
        if (res.data.items.length) {
          allOutpatient.value = res.data.items;
        } else {
          ElMessage.info("该科室没有门诊");
          allOutpatient.value = [];
        }
      }
    };

    /**
     * 改变状态
     */
    const changeStatus = async (data, index, newStatus) => {
      if (data.status === newStatus) {
        return;
      }
      const res = await updateDoctorStatus({ id: data.id, stop: newStatus });
      if (!res.success) {
        ElMessage.info(res.message);
        return;
      }
      tableData.value[index].status = newStatus;
      ElMessage.success("状态修改成功");
    };

    const handleEdit = (index, row) => {
      const { sectionId } = row;
      modelStatus.value = 0;
      editVisible.value = true;
      sectionChange(sectionId);
      form.value = row;
      form.value.section = sectionId;
      avatarUrl.value = row.avatarUrl;
    };

    const saveEdit = async () => {
      editVisible.value = false;
      if (modelStatus.value === 0) {
        const res = await updateDoctor({
          ...form.value,
          avatarUrl: form.value.avatarName || form.value.avatarUrl,
        });
        if (!res.success) {
          ElMessage.info(res.message);
          return;
        }
        ElMessage.success("修改职称成功");
        getData();
      } else if (modelStatus.value === 1) {
        const res = await addDoctor({
          ...form.value,
          avatarUrl: form.value.avatarName,
        });
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
      avatarUrl,
      tableData,
      pageTotal,
      editVisible,
      form,
      modelStatus,
      ruleFormRef,
      allSections,
      allOutpatient,
      allTechnical,
      moment,
      handleSearch,
      handlePageChange,
      handleDelete,
      handleEdit,
      saveEdit,
      addDoctorHandle,
      sectionChange,
      changeImage,
      changeStatus,
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
