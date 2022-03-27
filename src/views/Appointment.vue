<template>
  <div>
    <el-tabs model-value="appointment" class="demo-tabs">
      <el-tab-pane label="预约管理" name="appointment">
        <div class="container">
          <div class="handle-box">
            搜索类型：
            <el-select
              v-model="queryFiled"
              class="m-2"
              placeholder="Select"
              size="large"
            >
              <el-option
                v-for="item in queryOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
            <el-input
              v-model="name"
              placeholder="请按照搜索类型查询"
              class="handle-input mr10"
              clearable
            ></el-input>
            <el-button
              type="primary"
              icon="el-icon-search"
              @click="handleSearch"
              >搜索</el-button
            >
            订单状态查询：
            <el-select
              v-model="queryStatus"
              class="m-2"
              placeholder="Select"
              size="large"
              @change="changeStatus"
            >
              <el-option
                v-for="item in statusOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
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
              width="80"
              align="center"
            ></el-table-column>
            <el-table-column
              width="100"
              prop="reserveUser"
              label="患者名字"
            ></el-table-column>
            <el-table-column
              min-width="150"
              prop="reserveSection"
              label="科室"
            ></el-table-column>
            <el-table-column
              min-width="150"
              prop="reserveOutpatient"
              label="门诊"
            ></el-table-column>
            <el-table-column width="150" prop="reserveMoney" label="费用">
              <template #default="scope">
                ￥{{ scope.row.reserveMoney }}
              </template>
            </el-table-column>
            <el-table-column
              min-width="120"
              prop="phone"
              label="预约手机号"
            ></el-table-column>
            <el-table-column width="150" prop="status" label="预约状态">
              <template #default="scope">
                <el-tag v-if="scope.row.status === 0" type="danger"
                  >取消预约</el-tag
                >
                <el-tag v-else type="success">预约成功</el-tag>
              </template>
            </el-table-column>

            <el-table-column width="200" prop="createTime" label="创建时间">
              <template #default="scope">
                {{
                  moment(scope.row.createTime * 1000).format(
                    "YYYY-MM-DD HH:mm:ss"
                  )
                }}
              </template>
            </el-table-column>
            <el-table-column width="200" prop="updateTime" label="更新时间">
              <template #default="scope">
                {{
                  moment(
                    scope.row.updateTime * 1000 || scope.row.createTime * 1000
                  ).format("YYYY-MM-DD HH:mm:ss")
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
                  icon="el-icon-edit"
                  :disabled="scope.row.status === 0"
                  @click="handleDelete(scope.$index, scope.row)"
                  >取消预约</el-button
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
import { deleteAdmin, updateReserve, queryReserve } from "../api/index";

export default {
  name: "appointment",
  setup() {
    const queryOptions = [
      {
        label: "患者名字",
        value: "reserveUser",
      },
      {
        label: "科室",
        value: "reserveSection",
      },
      {
        label: "门诊",
        value: "reserveOutpatient",
      },
    ];
    const statusOptions = [
      {
        label: "全部",
        value: 2,
      },
      {
        label: "预约成功",
        value: 1,
      },
      {
        label: "取消预约",
        value: 0,
      },
    ];
    const queryFiled = ref(queryOptions[0].value);
    const queryStatus = ref(statusOptions[0].value);
    const pageSizes = reactive([10, 20, 50, 100]);
    let query = reactive({
      page: 1,
      pageSize: pageSizes[0],
    });
    const name = ref("");
    const tableData = ref([]);
    const total = ref(0);

    onMounted(() => {
      getData();
    });

    // 获取表格数据
    const getData = async () => {
      const params = {
        page: query.page,
        pageSize: query.pageSize,
      };
      params[queryFiled.value] = name.value;
      if (queryStatus.value !== 2) {
        params.status = queryStatus.value;
      }
      const res = await queryReserve({ ...params });
      if (!res.success) {
        ElMessage.info(res.message);
        return;
      }
      const { items, page, pageSize } = res.data;
      tableData.value = items;
      total.value = res.data.total;
      query = { ...query, page, pageSize };
    };

    // 查询操作
    const handleSearch = () => {
      query = { ...query, page: 1 };
      getData();
    };

    // 分页导航
    const handlePageChange = (val) => {
      query.page = val;
      getData();
    };

    // 分页导航
    const handleSizeChange = (val) => {
      query.pageSize = val;
      getData();
    };

    // 删除操作
    const handleDelete = (index, row) => {
      // 二次确认删除
      ElMessageBox.confirm("确定要取消预约吗？", "提示", {
        type: "warning",
      })
        .then(async () => {
          const res = await updateReserve({
            id: row.id,
            status: 0,
            reserveMoney: row.reserveMoney,
            phone: row.phone,
          });
          if (res.success) {
            ElMessage.success("取消预约成功");
            getData();
          }
        })
        .catch(() => {});
    };

    const changeStatus = () => {
      getData();
    };

    return {
      query,
      tableData,
      total,
      name,
      moment,
      pageSizes,
      queryOptions,
      queryFiled,
      queryStatus,
      statusOptions,
      handleSearch,
      handlePageChange,
      handleDelete,
      handleSizeChange,
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
  margin-left: 12px;
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
