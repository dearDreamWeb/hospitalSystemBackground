<template>
  <div>
    <el-tabs model-value="admin" class="demo-tabs">
      <el-tab-pane label="管理员管理" name="admin">
        <div class="container">
          <div class="handle-box">
            <el-input
              v-model="searchContext"
              placeholder="请输入搜索标题或内容"
              class="handle-input mr10"
            ></el-input>
            <el-button
              type="primary"
              icon="el-icon-search"
              @click="handleSearch"
              >搜索</el-button
            >
            <el-button type="primary" icon="el-icon-plus" @click="addNews"
              >新增新闻</el-button
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
              min-width="240"
              prop="title"
              label="标题"
            ></el-table-column>
            <el-table-column min-width="350" prop="content" label="内容">
              <template #default="scope">
                <div>
                  {{ filterHtml(scope.row.content) }}
                </div>
              </template>
            </el-table-column>
            <el-table-column
              width="180"
              prop="createUser"
              label="创建人"
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
                  icon="el-icon-edit"
                  @click="previewHandle(scope.$index, scope.row)"
                  >预览
                </el-button>
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

    <!-- 预览框 -->
    <el-dialog title="预览" v-model="previewVisible" width="50%">
      <div ref="previewRef" class="preview-dialog"></div>
    </el-dialog>
    <!-- 编辑弹出框 -->
    <el-dialog title="编辑" v-model="editVisible" width="50%">
      <el-form label-width="70px">
        <el-form-item label="标题">
          <el-input v-model="form.title"></el-input>
        </el-form-item>
        <el-form-item label="内容" v-if="editVisible">
          <Editor :content="form.content" @changeEditor="changeEditor" />
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
import { getNews, deleteNews, addNewsApi, updateNews } from "../api/index";
import Editor from "./Editor.vue";

export default {
  name: "admin",
  components: { Editor },
  setup() {
    const pageSizes = reactive([10, 20, 50, 100]);
    let query = reactive({
      page: 1,
      pageSize: pageSizes[0],
    });
    const previewRef = ref(null);
    const searchContext = ref("");
    const tableData = ref([]);
    const total = ref(0);
    let form = ref({
      title: "",
      content: "",
    });
    const modelStatus = ref(0); // 0: 新增 1：编辑
    // 表格编辑时弹窗和保存
    const editVisible = ref(false);
    // 预览弹出框
    const previewVisible = ref(false);

    onMounted(() => {
      getData();
    });

    // 获取表格数据
    const getData = async () => {
      const params = {
        page: query.page,
        pageSize: query.pageSize,
      };
      if (searchContext.value) {
        params.searchContext = searchContext.value;
      }
      const res = await getNews(params);
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
      console.log(query);
      getData();
    };

    // 新增新闻
    const addNews = () => {
      editVisible.value = true;
      modelStatus.value = 0;
      form.value = { title: "", content: "" };
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
      ElMessageBox.confirm("确定要删除吗？", "提示", {
        type: "warning",
      })
        .then(async () => {
          const res = await deleteNews({ id: row.id, status: 0 });
          if (res.success) {
            ElMessage.success("删除成功");
            getData();
          }
        })
        .catch(() => {});
    };

    // 富文本编辑器内容改变时
    const changeEditor = (data) => {
      form.value.content = data;
    };

    // 去掉富文本的标签
    const filterHtml = (data) => {
      const reg = /<[^\>]*>/g;
      let str = data.replaceAll(reg, "");
      if (str.length > 50) {
        str = `${str.slice(0, 50)}......`;
      }
      return str;
    };

    /**
     * 编辑
     */
    const handleEdit = (index, row) => {
      form.value = row;
      modelStatus.value = 1;
      editVisible.value = true;
    };

    /**
     * 预览
     */
    const previewHandle = (index, row) => {
      previewVisible.value = true;
      setTimeout(() => {
        previewRef.value.innerHTML = row.content;
      }, 10);
    };

    /**
     * 保存
     */
    const saveEdit = async () => {
      const { id, title, content } = form.value;
      if (!title || !content) {
        ElMessage.info("请输入完整的表单");
        return;
      }
      if (modelStatus.value === 0) {
        const res = await addNewsApi({ title, content });
        if (res.success) {
          ElMessage.success("新增新闻成功");
          getData();
        }
      } else {
        const res = await updateNews({ id, title, content, status: 1 });
        if (res.success) {
          ElMessage.success("修改新闻成功");
          getData();
        }
      }
      editVisible.value = false;
    };

    return {
      query,
      tableData,
      total,
      editVisible,
      previewVisible,
      form,
      searchContext,
      previewRef,
      moment,
      pageSizes,
      filterHtml,
      handleSearch,
      handlePageChange,
      handleDelete,
      handleEdit,
      previewHandle,
      saveEdit,
      addNews,
      changeEditor,
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
