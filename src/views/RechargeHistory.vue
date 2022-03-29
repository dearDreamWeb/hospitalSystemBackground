<template>
  <div>
    <el-tabs model-value="rechargeHistory" class="demo-tabs">
      <el-tab-pane label="消费记录" name="rechargeHistory">
        <div class="container">
          <div class="handle-box">
            <el-input
              v-model="query.name"
              placeholder="请输入搜索名称或手机号"
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
              prop="name"
              label="名字"
            ></el-table-column>
            <el-table-column
              min-width="50"
              prop="sex"
              label="性别"
            ></el-table-column>
            <el-table-column min-width="100" prop="balance" label="余额">
              <template #default="scope">
                ￥{{ scope.row.balance }}
              </template></el-table-column
            >
            <el-table-column
              width="180"
              prop="phone"
              label="手机号码"
            ></el-table-column>
            <el-table-column
              width="50"
              prop="age"
              label="年龄"
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

    <!-- 编辑弹出框 -->
    <el-dialog title="编辑" v-model="editVisible" width="30%">
      <el-form label-width="70px">
        <el-form-item label="名称">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="手机号">
          <el-input v-model="form.phone" disabled></el-input>
        </el-form-item>
        <el-form-item label="年龄">
          <el-input v-model="form.age"></el-input>
        </el-form-item>
        <el-form-item label="性别">
          <el-radio-group v-model="form.sex">
            <el-radio label="男" value="男"></el-radio>
            <el-radio label="女" value="女"></el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="头像" class="form-avatar">
          <AvatarUpload
            :imageUrl="showAvatarUrl || ''"
            @changeImage="changeImage"
          />
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
  queryUsers,
  queryRechargeHistory,
  updateUserInfo,
  deleteUserInfo,
} from "../api/index";
import AvatarUpload from "../components/AvatarUpload.vue";

export default {
  name: "rechargeHistory",
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
    let form = ref({
      name: "",
      pwd: "",
      phone: "",
      avatarUrl: "",
    });
    // 表格编辑时弹窗和保存
    const editVisible = ref(false);
    const showAvatarUrl = ref("");

    onMounted(() => {
      getData();
    });

    // 获取表格数据
    const getData = async () => {
      const res = await queryRechargeHistory({ ...query.value });
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

    // 图片变更
    const changeImage = (data) => {
      const { absolutePath, name } = data;
      form.value.avatarUrl = name;
      showAvatarUrl.value = absolutePath;
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
          const res = await deleteUserInfo(row.id);
          if (res.success) {
            ElMessage.success("删除成功");
            getData();
          }
        })
        .catch(() => {});
    };

    /**
     * 编辑
     */
    const handleEdit = (index, row) => {
      form.value = row;
      editVisible.value = true;
      showAvatarUrl.value = form.value.avatarUrl;
    };

    /**
     * 保存
     */
    const saveEdit = async () => {
      const res = await updateUserInfo({ ...form.value });
      if (!res.success) {
        ElMessage.info(res.message);
        return;
      }
      ElMessage.success("修改用户成功成功");
      getData();
      editVisible.value = false;
    };

    return {
      query,
      tableData,
      total,
      editVisible,
      form,
      moment,
      showAvatarUrl,
      pageSizes,
      handleSearch,
      handlePageChange,
      handleDelete,
      handleEdit,
      saveEdit,
      handleSizeChange,
      changeImage,
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
