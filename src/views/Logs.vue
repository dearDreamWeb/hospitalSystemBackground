<template>
  <div>
    <el-tabs model-value="logs" class="demo-tabs">
      <el-tab-pane label="评论管理" name="logs">
        <div class="container">
          <div class="handle-box">
            <el-input
              v-model="query.name"
              placeholder="请输入搜索医生名字或者患者名字"
              class="handle-input mr10"
              clearable
            ></el-input>
            <el-button
              type="primary"
              icon="el-icon-search"
              @click="handleSearch"
              >搜索</el-button
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
              min-width="100"
              prop="userName"
              label="患者名字"
            ></el-table-column>
            <el-table-column
              min-width="100"
              prop="doctorName"
              label="医生名字"
            ></el-table-column>
      
            <el-table-column
              width="80"
              prop="grade"
              label="评分"
            ></el-table-column>
            <el-table-column
              min-width="180"
              prop="msg"
              label="评论内容"
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
            <el-table-column
              width="200"
              label="操作"
              align="center"
              fixed="right"
            >
              <template #default="scope">
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
              layout="total,sizes, prev, pager, next"
              :current-page="query.page"
              :page-sizes="pageSizes"
              :total="total"
              @size-change="handleSizeChange"
              @current-change="handlePageChange"
            ></el-pagination>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { ref, reactive, onMounted } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import moment from "moment";
import {
  adminGetAllMessage,
  deleteComment,
} from "../api/index";
import AvatarUpload from "../components/AvatarUpload.vue";

export default {
  name: "logs",
  components: { AvatarUpload },
  setup() {
    const pageSizes = reactive([10, 20, 50, 100]);
    let query = ref({
      page: 1,
      pageSize: pageSizes[0],
      name: "",
    });
    const tableData = ref([]);
    const total = ref(0);

    onMounted(() => {
      getData();
    });

    // 获取表格数据
    const getData = async () => {
      const res = await adminGetAllMessage({ ...query.value });
      if (!res.success) {
        ElMessage.info(res.message);
        return;
      }
      const { items, page, pageSize } = res.data;
      tableData.value = items;
      total.value = res.data.total;
      query.value = { ...query.value, page, pageSize };
    };

    // 查询操作
    const handleSearch = () => {
      query.value = { ...query.value, page: 1 };
      getData();
    };

    // 分页导航
    const handlePageChange = (val) => {
      query.value.page = val;
      getData();
    };

    // 分页导航
    const handleSizeChange = (val) => {
      query.value.pageSize = val;
      getData();
    };

    // 删除操作
    const handleDelete = (index, row) => {
      // 二次确认删除
      ElMessageBox.confirm("确定要删除吗？", "提示", {
        type: "warning",
      })
        .then(async () => {
          const res = await deleteComment(row.id);
          if (res.success) {
            ElMessage.success("删除成功");
            getData();
          }
        })
        .catch(() => {});
    };

    return {
      query,
      tableData,
      total,
      moment,
      pageSizes,
      handleSearch,
      handlePageChange,
      handleDelete,
      handleSizeChange,
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

.preview-dialog {
  max-height: 70vh;
  overflow-y: auto;
}
</style>
