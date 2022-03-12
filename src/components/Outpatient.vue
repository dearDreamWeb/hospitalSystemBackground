<template>
  <div>
    <div class="container">
      <div class="handle-box">
        <el-input
          v-model="searchContent"
          placeholder="门诊名称"
          class="handle-input mr10"
          clearable
        ></el-input>
        <el-button type="primary" icon="el-icon-search" @click="handleSearch"
          >搜索</el-button
        >
        <el-button
          type="primary"
          icon="el-icon-plus"
          @click="addOutpatientHandle"
          >新增门诊</el-button
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
          prop="outpatientName"
          min-width="200"
          label="门诊名称"
        ></el-table-column>
        <el-table-column prop="sectionName" min-width="200" label="所属科室">
          <template #default="scope">
            <el-tag size="large">{{ scope.row.sectionName || "" }}</el-tag>
          </template>
        </el-table-column>
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
        <el-table-column label="操作" width="180" fixed="right">
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
          :current-page="pageInfo.page"
          :page-size="pageInfo.pageSize"
          :total="total"
          @current-change="handlePageChange"
        ></el-pagination>
      </div>
    </div>

    <!-- 编辑弹出框 -->
    <el-dialog title="编辑" v-model="editVisible" width="30%">
      <el-form label-width="70px">
        <el-form-item label="选择科室">
          <el-select
            v-model="form.sectionId"
            placeholder="选择科室"
            size="large"
          >
            <el-option
              v-for="item in allSection"
              :key="item.id"
              :label="item.section"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="门诊名称">
          <el-input v-model="form.outpatientName"></el-input>
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
import { ref, reactive, watch, onMounted } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import {
  getSection,
  deleteOutpatient,
  updateOutpatient,
  getOutpatient,
  addOutpatient,
} from "../api/index";
import moment from "moment";

export default {
  name: "outpatient",
  setup() {
    const searchContent = ref("");
    const pageInfo = ref({ page: 1, pageSize: 10 });
    const tableData = ref([]);
    const total = ref(0);
    const modelStatus = ref(0); // 0:新增门诊 1:编辑门诊
    const outpatientList = ref([]);
    const allSection = ref([]);
    let sectionId = reactive("");
    // 表格编辑时弹窗和保存
    const editVisible = ref(false);
    const form = ref({
      sectionId: "",
      outpatientName: "",
    });

    onMounted(() => {
      getData();
      getSectionHandle();
    });

    // 获取全部科室
    const getSectionHandle = async () => {
      const res = await getSection();
      if (!res.success) {
        return;
      }
      allSection.value = res.data.items;
      form.value.sectionId = res.data.items[0].id;
    };

    // 获取表格数据
    const getData = async () => {
      const res = await getOutpatient({
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

    // 新增门诊
    const addOutpatientHandle = () => {
      modelStatus.value = 0;
      editVisible.value = true;
      form.value = { sectionId: allSection.value[0].id, outpatientName: "" };
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
          const res = await deleteOutpatient(row.id);
          if (res.success) {
            ElMessage.success("删除门诊成功");
            getData();
          }
        })
        .catch((err) => console.log(err));
    };

    // 编辑门诊
    const handleEdit = (index, row) => {
      modelStatus.value = 1;
      editVisible.value = true;
      const { sectionId, outpatientName, id } = row;
      form.value = {
        sectionId,
        outpatientName,
        id,
      };
    };

    const saveEdit = async () => {
      // 新增门诊
      if (modelStatus.value === 0) {
        const { sectionId, outpatientName } = form.value;
        const res = await addOutpatient({ sectionId, outpatientName });
        if (res.success) {
          ElMessage.success(`新增门诊成功`);
          editVisible.value = false;
          getData();
        } else {
          ElMessage.info(res.message);
        }
      } else {
        const { sectionId, outpatientName, id } = form.value;
        const res = await updateOutpatient({ id, sectionId, outpatientName });
        if (res.success) {
          ElMessage.success("修改门诊成功");
          editVisible.value = false;
          getData();
        }
      }
    };

    return {
      tableData,
      total,
      editVisible,
      form,
      modelStatus,
      outpatientList,
      pageInfo,
      searchContent,
      moment,
      sectionId,
      allSection,
      handleSearch,
      handlePageChange,
      handleDelete,
      handleEdit,
      saveEdit,
      addOutpatientHandle,
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
