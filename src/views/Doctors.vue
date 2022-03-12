<template>
  <div>
    <el-tabs v-model="tabValue" class="demo-tabs" @tab-click="handleClick">
      <el-tab-pane label="医生管理" name="first">
        <div class="container">
          <div class="handle-box">
            <el-select
              v-model="query.address"
              placeholder="地址"
              class="handle-select mr10"
            >
              <el-option key="1" label="广东省" value="广东省"></el-option>
              <el-option key="2" label="湖南省" value="湖南省"></el-option>
            </el-select>
            <el-input
              v-model="query.name"
              placeholder="用户名"
              class="handle-input mr10"
            ></el-input>
            <el-button
              type="primary"
              icon="el-icon-search"
              @click="handleSearch"
              >搜索</el-button
            >
            <el-button type="primary" icon="el-icon-plus" @click="addDoctor"
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
              prop="department"
              width="150"
              label="门诊"
            ></el-table-column>
            <el-table-column
              prop="age"
              width="50"
              label="年龄"
            ></el-table-column>
            <el-table-column
              prop="sex"
              width="50"
              label="性别"
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
            <el-table-column
              prop="good"
              min-width="300"
              label="擅长"
            ></el-table-column>
            <el-table-column
              prop="phone_name"
              width="120"
              label="手机号码"
            ></el-table-column>
            <el-table-column
              prop="date"
              width="120"
              label="注册时间"
            ></el-table-column>
            <el-table-column
              label="操作"
              width="180"
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
              layout="total, prev, pager, next"
              :current-page="query.page"
              :page-size="query.pageSize"
              :total="pageTotal"
              @current-change="handlePageChange"
            ></el-pagination>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="职称管理" name="two">
        <!-- 职称管理 -->
        <div class="level-main">
          <div class="level-title">
            职称管理
            <el-button type="success" icon="el-icon-plus" @click="addLevel"
              >新增职称</el-button
            >
          </div>

          <el-table
            :data="levelTableData"
            border
            class="table"
            :default-sort="{ prop: 'price', order: 'descending' }"
            header-cell-class-name="table-header"
          >
            <el-table-column
              prop="id"
              label="ID"
              align="center"
            ></el-table-column>
            <el-table-column prop="technical" label="职称">
              <template #default="scope">
                <el-tag size="large">{{ scope.row.technical }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="price" label="费用" sortable>
              <template #default="scope"> ￥{{ scope.row.price }} </template>
            </el-table-column>

            <el-table-column
              label="操作"
              width="180"
              align="center"
              fixed="right"
            >
              <template #default="scope">
                <el-button
                  type="text"
                  icon="el-icon-edit"
                  @click="levelHandleEdit(scope.$index, scope.row)"
                  >编辑
                </el-button>
                <el-button
                  type="text"
                  icon="el-icon-delete"
                  class="red"
                  @click="levelHandleDelete(scope.$index, scope.row)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
          <div class="pagination">
            <el-pagination
              background
              layout="total, prev, pager, next"
              :current-page="levelPage.page"
              :page-size="levelPage.pageSize"
              :total="levelPage.total"
              @current-change="handleLevelPageChange"
            ></el-pagination>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>

    <!-- 编辑弹出框 -->
    <el-dialog title="编辑" v-model="editVisible" width="30%">
      <el-form
        ref="ruleFormRef"
        :model="form"
        label-width="70px"
        v-if="modelStatus === 0 || modelStatus === 2"
      >
        <el-form-item label="用户名" prop="name">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="年龄" prop="age">
          <el-input v-model="form.age"></el-input>
        </el-form-item>
        <el-form-item label="性别" prop="sex">
          <el-radio-group v-model="form.sex">
            <el-radio label="男"></el-radio>
            <el-radio label="女"></el-radio>
          </el-radio-group>
          <el-form-item label="擅长" prop="good">
            <el-input v-model="form.good"></el-input>
          </el-form-item>
          <el-form-item label="手机号码" prop="phone_name">
            <el-input v-model="form.phone_name"></el-input>
          </el-form-item>
          <el-form-item label="头像" prop="avatarUrl" class="form-avatar">
            <AvatarUpload :imageUrl="form.avatarUrl || ''" />
          </el-form-item>
          <el-form-item label="科室" prop="section">
            <el-select v-model="form.section" placeholder="选择科室">
              <el-option label="内科" value="shanghai"></el-option>
              <el-option label="外科" value="beijing"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="门诊" prop="department">
            <el-select v-model="form.department" placeholder="选择门诊">
              <el-option label="呼吸门诊" value="shanghai"></el-option>
              <el-option label="发热门诊" value="beijing"></el-option>
            </el-select>
          </el-form-item>
        </el-form-item>
      </el-form>
      <el-form v-else ref="ruleFormRef" :model="levelForm" label-width="70px">
        <el-form-item label="职称" prop="technical">
          <el-input v-model="levelForm.technical"></el-input>
        </el-form-item>
        <el-form-item label="费用" prop="price">
          <el-input v-model="levelForm.price"></el-input>
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
import { useRoute } from "vue-router";
import { ElMessage, ElMessageBox } from "element-plus";
import {
  fetchData,
  addTechnical,
  deleteTechnical,
  updateTechnical,
  getTechnical,
} from "../api/index";
import AvatarUpload from "../components/AvatarUpload.vue";

export default {
  name: "doctors",
  components: { AvatarUpload },
  setup() {
    const tabValue = ref("first");
    const initLevelForm = {
      technical: "",
      price: 0,
    };
    const query = reactive({
      page: 1,
      pageSize: 10,
    });
    const tableData = ref([]);
    const levelTableData = ref([]);
    const levelPage = ref({ page: 1, pageSize: 10, total: 10 });
    const pageTotal = ref(0);
    const ruleFormRef = ref();
    const modelStatus = ref(0); // 0: 编辑医生 1：编辑职称 2：新增医生 3：新增职称
    const levelForm = ref({
      id: 1,
      ...initLevelForm,
    });
    console.log(useRoute().path);
    onMounted(() => {
      queryTechnical();
    });

    // 获取表格数据
    const getData = async () => {
      fetchData(query).then((res) => {
        tableData.value = [
          {
            id: 1,
            name: "王大力",
            age: 38,
            sex: "男",
            good: "擅长临床医学",
            phone_name: 12345678901,
            date: "2021-1-2",
            avatarUrl: null,
            section: "外科",
            department: "五官门诊",
          },
          {
            id: 2,
            name: "王大力",
            age: 38,
            sex: "男",
            good: "擅长临床医学",
            phone_name: 12345678901,
            date: "2021-1-2",
            avatarUrl: null,
            section: "外科",
            department: "五官门诊",
          },
        ];

        levelTableData.value = [
          {
            id: 1,
            name: "专家",
            pay: 80,
          },
          {
            id: 2,
            name: "主治医师",
            pay: 50,
          },
        ];
        pageTotal.value = res.pageTotal || 50;
      });
    };
    getData();

    // 获取职称列表
    const queryTechnical = async () => {
      const res = await getTechnical({ ...levelPage.value });
      if (!res.success) {
        ElMessage.info("职称请求错误");
        return;
      }
      const { items, page, pageSize, total } = res.data;
      levelTableData.value = items;
      levelPage.value = { page, pageSize, total };
    };

    // 查询操作
    const handleSearch = () => {
      query.page = 1;
      getData();
    };

    // 新增医生
    const addDoctor = () => {
      modelStatus.value = 2;
      editVisible.value = true;
    };

    // 新增职称
    const addLevel = () => {
      levelForm.value = { ...initLevelForm };
      modelStatus.value = 3;
      editVisible.value = true;
    };

    // 分页导航
    const handlePageChange = (val) => {
      query.page = val;
    };

    // 职称分页导航
    const handleLevelPageChange = (val) => {
      levelPage.value.page = val;
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

    // 删除科室操作
    const levelHandleDelete = async (index, row) => {
      // 二次确认删除
      ElMessageBox.confirm("确定要删除吗？", "提示", {
        type: "warning",
      })
        .then(async () => {
          const res = await deleteTechnical(row.id);
          if (!res.success) {
            ElMessage.info(res.message);
          }
          ElMessage.success("删除职称成功");
          queryTechnical();
        })
        .catch((err) => {
          console.log(err);
        });
    };

    // 表格编辑时弹窗和保存
    const editVisible = ref(false);
    let form = reactive({
      id: 1,
      name: "王大力",
      age: 38,
      sex: "男",
      good: "擅长临床医学",
      phone_name: 12345678901,
      date: "2021-1-2",
      avatarUrl: null,
      section: "外科",
      department: "五官门诊",
    });

    let idx = -1;

    const handleEdit = (index, row) => {
      idx = index;
      Object.keys(form).forEach((item) => {
        form[item] = row[item];
      });
      modelStatus.value = 0;
      editVisible.value = true;
    };

    // 编辑职称
    const levelHandleEdit = (index, row) => {
      levelForm.value = row;
      modelStatus.value = 1;
      editVisible.value = true;
    };

    const saveEdit = async () => {
      editVisible.value = false;
      if (modelStatus.value === 1) {
        const res = await updateTechnical({ ...levelForm.value });
        if (!res.success) {
          ElMessage.info(res.message);
        }
        ElMessage.success("修改职称成功");
        queryTechnical();
      } else if (modelStatus.value === 3) {
        const res = await addTechnical({ ...levelForm.value });
        if (!res.success) {
          ElMessage.info(res.message);
        }
        ElMessage.success("添加职称成功");
        queryTechnical();
      }
    };

    return {
      query,
      tableData,
      levelTableData,
      pageTotal,
      editVisible,
      form,
      levelPage,
      modelStatus,
      ruleFormRef,
      levelForm,
      tabValue,
      handleSearch,
      handlePageChange,
      handleLevelPageChange,
      handleDelete,
      handleEdit,
      levelHandleEdit,
      saveEdit,
      addDoctor,
      addLevel,
      levelHandleDelete,
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

.level-main .level-title {
  display: flex;
  justify-content: space-between;
  margin: 20px 0 12px 8px;
  font-weight: 400;
  color: #606266;
  cursor: text;
}
</style>
