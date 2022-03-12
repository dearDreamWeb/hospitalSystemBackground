<template>
  <div>
    <div class="container">
      <div class="handle-box">
        <el-input
          v-model="searchContent"
          placeholder="科室名称"
          class="handle-input mr10"
          clearable
        ></el-input>
        <el-button type="primary" icon="el-icon-search" @click="handleSearch"
          >搜索</el-button
        >
        <el-button type="primary" icon="el-icon-plus" @click="addDepartment"
          >新增科室</el-button
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
          prop="section"
          min-width="200"
          label="科室名称"
        ></el-table-column>
        <el-table-column width="200" prop="createTime" label="创建时间">
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
        <el-table-column label="操作" width="320" fixed="right">
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
            <el-button
              type="text"
              icon="el-icon-search"
              @click="searchOutpatient(scope.$index, scope.row)"
              >查看门诊
            </el-button>
            <el-button
              type="text"
              icon="el-icon-plus"
              @click="addOutpatientHandle(scope.$index, scope.row)"
              >新增门诊
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination
          background
          layout="total, prev, pager, next"
          :current-page="pageInfo.page"
          :page-size="pageInfo.pageSize"
          :total="total"
          @current-change="handlePageChange"
        ></el-pagination>
      </div>
    </div>
    <!-- 编辑弹出框 -->
    <el-dialog
      :title="modelStatus === 0 || modelStatus === 3 ? '新增' : '编辑'"
      v-model="editVisible"
      width="30%"
    >
      <el-form
        label-width="70px"
        v-if="modelStatus === 0 || modelStatus === 1 || modelStatus === 3"
      >
        <el-form-item :label="modelStatus === 3 ? '门诊名称' : '科室名称'">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
      </el-form>
      <div v-if="modelStatus === 2">
        <div
          v-for="(item, i) in outpatientList"
          v-bind:key="item.id"
          class="outpatient-list"
        >
          <el-input
            v-model="outpatientList[i].outpatientName"
            :disabled="item.disabled"
            @blur="saveOutpatient(item, i)"
            class="outpatient-input"
          ></el-input>
          <el-button type="primary" size="default" @click="editOutpatient(i)"
            >编辑</el-button
          >
          <el-button
            type="danger"
            size="default"
            @click="deleteOutpatientHandle(item)"
            >删除</el-button
          >
        </div>
      </div>
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
import { ref, reactive, watch, onMounted } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import {
  addSection,
  deleteSection,
  updateSection,
  getSection,
  deleteOutpatient,
  updateOutpatient,
  getOutpatient,
  addOutpatient,
} from "../api/index";
import moment from "moment";

export default {
  name: "department",
  setup() {
    const searchContent = ref("");
    const pageInfo = ref({ page: 1, pageSize: 10 });
    const tableData = ref([]);
    const total = ref(0);
    const modelStatus = ref(0); // 0:新增科室名 1:修改科室 2：编辑门诊 3:新增门诊
    const operationId = ref(); // 当前操作的科室id
    const outpatientList = ref([]);
    const form = ref({ name: "" });
    let sectionId = reactive("");
    // 表格编辑时弹窗和保存
    const editVisible = ref(false);

    onMounted(() => {
      getData();
    });

    // 获取表格数据
    const getData = async () => {
      const res = await getSection({
        name: searchContent.value,
        ...pageInfo.value,
      });
      if (res.success) {
        const { items, page } = res.data;
        total.value = res.data.total;
        pageInfo.value = { ...pageInfo.value, page };
        tableData.value = items;
      }
    };

    // 查询操作
    const handleSearch = () => {
      pageInfo.page = 1;
      getData();
    };

    // 新增科室
    const addDepartment = () => {
      modelStatus.value = 0;
      editVisible.value = true;
      form.value = { name: "" };
    };

    // 查看门诊
    const searchOutpatient = async (index, row) => {
      const res = await getOutpatient({ sectionId: row.id });
      if (res.success) {
        modelStatus.value = 2;
        editVisible.value = true;
        outpatientList.value = res.data.items.map((item) => {
          return { ...item, disabled: true };
        });
      }
    };

    // 新增门诊
    const addOutpatientHandle = async (index, row) => {
      modelStatus.value = 3;
      editVisible.value = true;
      sectionId = row.id;
      form.value.name = "";
    };

    // 修改门诊名称
    const editOutpatient = (index) => {
      const arr = JSON.parse(JSON.stringify(outpatientList.value));
      arr[index].disabled = false;
      outpatientList.value = arr;
    };

    // 删除门诊
    const deleteOutpatientHandle = async (data) => {
      const { id, sectionId } = data;
      const res = await deleteOutpatient(id);
      if (res.success) {
        ElMessage.success("删除门诊成功");
        searchOutpatient(0, { id: sectionId });
      } else {
        ElMessage.info(res.message);
      }
    };

    // 保存门诊修改名称
    const saveOutpatient = async (data, i) => {
      const res = await updateOutpatient(data);
      if (res.success) {
        const arr = JSON.parse(JSON.stringify(outpatientList.value));
        data.disabled = true;
        arr[i] = data;
        outpatientList.value = arr;
        ElMessage.success(`修改门诊成功`);
        editVisible = false;
      } else {
        ElMessage.success(res.message);
      }
    };

    // 分页导航
    const handlePageChange = (val) => {
      pageInfo.value.page = val;
      getData();
    };

    // 删除操作
    const handleDelete = (index, row) => {
      // 二次确认删除
      ElMessageBox.confirm("确定要删除吗？", "提示", {
        type: "warning",
      })
        .then(async () => {
          const res = await deleteSection(row.id);
          if (res.success) {
            ElMessage.success("删除科室成功");
            getData();
          }
        })
        .catch((err) => console.log(err));
    };

    // 编辑科室
    const handleEdit = (index, row) => {
      modelStatus.value = 1;
      editVisible.value = true;
      form.value = { ...row, name: row.section };
    };

    const saveEdit = async () => {
      // 新增科室
      if (modelStatus.value === 0) {
        const res = await addSection({ section: form.value.name });
        if (res.success) {
          ElMessage.success(`新增科室成功`);
          editVisible.value = false;
          getData();
        } else {
          ElMessage.info(res.message);
        }
      } else if (modelStatus.value === 1) {
        const { id, name } = form.value;
        const res = await updateSection({ id: id, section: name });
        if (res.success) {
          ElMessage.success("修改科室成功");
          editVisible.value = false;
          getData();
        }
      } else if (modelStatus.value === 2) {
      } else if (modelStatus.value === 3) {
        const res = await addOutpatient({
          sectionId,
          outpatientName: form.value.name,
        });
        if (res.success) {
          ElMessage.success(`新增门诊成功`);
          editVisible.value = false;
          getData();
        } else {
          ElMessage.info(res.message);
        }
      }
    };

    watch(editVisible, (newVal, oldVal) => {
      if (!newVal) {
        const arr = JSON.parse(JSON.stringify(outpatientList.value));
        arr.forEach((item) => (item.disabled = true));
        outpatientList.value = arr;
      }
    });

    return {
      tableData,
      total,
      editVisible,
      form,
      modelStatus,
      outpatientList,
      operationId,
      pageInfo,
      searchContent,
      moment,
      sectionId,
      handleSearch,
      handlePageChange,
      handleDelete,
      handleEdit,
      saveEdit,
      addDepartment,
      searchOutpatient,
      addOutpatientHandle,
      editOutpatient,
      saveOutpatient,
      deleteOutpatientHandle,
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
.outpatient-list {
  display: flex;
  margin-bottom: 12px;
}
.outpatient-input {
  width: 70%;
  margin-right: 12px;
}
</style>
