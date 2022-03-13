<template>
  <div>
    <el-tabs v-model="tabVal" class="demo-tabs">
      <el-tab-pane label="科室管理" name="section">
        <Department v-if="tabVal === 'section'" />
      </el-tab-pane>
      <el-tab-pane label="门诊管理" name="outpatient">
        <Outpatient v-if="tabVal === 'outpatient'" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { reactive } from "vue";
import Outpatient from "../components/Outpatient.vue";
import Department from "../components/Department.vue";

export default {
  name: "departmentIndex",
  components: { Outpatient, Department },
  setup() {
    let tabVal = reactive("section");

    return {
      tabVal,
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
