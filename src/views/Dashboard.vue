<template>
  <div>
    <el-row :gutter="20">
      <el-col :span="8">
        <el-card shadow="hover" class="mgb20" style="height: 252px">
          <div class="user-info">
            <img
              v-if="userInfoData.avatarUrl"
              :src="userInfoData.avatarUrl"
              class="user-avator"
              alt
            />
            <img v-else src="../assets/img/img.jpg" class="user-avator" alt />
            <div class="user-info-cont">
              <div class="user-info-name">{{ name }}</div>
              <div>{{ role }}</div>
            </div>
          </div>
          <div class="user-info-list">
            本次登录地点：
            <span>{{ cityInfo }}</span>
          </div>
          <div class="user-info-list">
            天气信息：
            <div class="user-info-list-item">
              <span>{{ weatherInfo.temperature }}℃</span>
              <span>{{ weatherInfo.weather }}</span>
            </div>
            <div class="user-info-list-item">
              <span
                >{{ weatherInfo.winddirection }}风 风力{{
                  weatherInfo.windpower
                }}级</span
              >
              <span>湿度{{ weatherInfo.humidity }}%</span>
            </div>
          </div>
        </el-card>
        <el-card shadow="hover" style="height: 252px">
          <template #header>
            <div class="clearfix">
              <span>预约排行</span>
            </div>
          </template>
          <div v-for="(item, index) in reserveList" :key="item.doctorId">
            {{ item.name }} {{ item.outpatientName }}
            {{ item.technical }} 预约数量：{{ item.total }}
            <el-progress
              :percentage="(item.total / reserveList[0].total) * 100"
              :color="colorArr[index]"
            ></el-progress>
          </div>
        </el-card>
      </el-col>
      <el-col :span="16">
        <el-row :gutter="20" class="mgb20">
          <el-col :span="8">
            <el-card shadow="hover" :body-style="{ padding: '0px' }">
              <div class="grid-content grid-con-1">
                <i class="el-icon-user-solid grid-con-icon"></i>
                <div class="grid-cont-right">
                  <div class="grid-num">
                    {{ statisticsInfo.userTotal || 0 }}
                  </div>
                  <div>用户人数</div>
                </div>
              </div>
            </el-card>
          </el-col>
          <el-col :span="8">
            <el-card shadow="hover" :body-style="{ padding: '0px' }">
              <div class="grid-content grid-con-2">
                <i class="el-icon-message-solid grid-con-icon"></i>
                <div class="grid-cont-right">
                  <div class="grid-num">
                    {{ statisticsInfo.doctorTotal || 0 }}
                  </div>
                  <div>医生人数</div>
                </div>
              </div>
            </el-card>
          </el-col>
          <el-col :span="8">
            <el-card shadow="hover" :body-style="{ padding: '0px' }">
              <div class="grid-content grid-con-3">
                <i class="el-icon-s-goods grid-con-icon"></i>
                <div class="grid-cont-right">
                  <div class="grid-num">
                    {{ statisticsInfo.reserveTotal || 0 }}
                  </div>
                  <div>预约单数</div>
                </div>
              </div>
            </el-card>
          </el-col>
        </el-row>
        <el-card shadow="hover" style="height: 403px">
          <template #header>
            <div class="clearfix">
              <span>待办事项</span>
              <el-button style="float: right; padding: 3px 0" type="text"
                >添加</el-button
              >
            </div>
          </template>

          <el-table :show-header="false" :data="todoList" style="width: 100%">
            <el-table-column width="40">
              <template #default="scope">
                <el-checkbox v-model="scope.row.status"></el-checkbox>
              </template>
            </el-table-column>
            <el-table-column>
              <template #default="scope">
                <div
                  class="todo-item"
                  :class="{
                    'todo-item-del': scope.row.status,
                  }"
                >
                  {{ scope.row.title }}
                </div>
              </template>
            </el-table-column>
            <el-table-column width="60">
              <template>
                <i class="el-icon-edit"></i>
                <i class="el-icon-delete"></i>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="12">
        <el-card shadow="hover">
          <schart class="schart" canvasId="pie" :options="options3"></schart>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card shadow="hover">
          <schart
            ref="line"
            class="schart"
            canvasId="line"
            :options="options2"
          ></schart>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import Schart from "vue-schart";
import { reactive, ref, onMounted } from "vue";
import { useStore } from "vuex";
import {
  queryWeatherInfo,
  getStatisticsInfo,
  getDoctorReserveTotal,
  queryRechargeHistory,
  getSignUp,
} from "../api/index";

export default {
  name: "dashboard",
  components: { Schart },
  setup() {
    const store = useStore();
    const name = ref("");
    const role = ref("");
    const userInfoData = ref("");
    const cityInfo = ref("");
    const weatherInfo = ref({});
    const statisticsInfo = ref({});
    const reserveList = ref([]);
    const colorArr = ["#42b983", "#42b983", "#f1e05a", "#f56c6c", "#e4393c"];

    const options2 = ref({
      type: "line",
      title: {
        text: "2022年用户每月注册量",
      },
      labels: [],
      datasets: [
        {
          label: "用户注册量",
          data: [],
        },
      ],
    });

    const options3 = ref({
      type: "pie",
      title: {
        text: "收入和消费",
      },
      legend: {
        position: "left",
      },
      bgColor: "#fbfbfb",
      labels: ["收入", "消费"],
      datasets: [
        {
          data: [0, 0],
        },
      ],
    });

    onMounted(() => {
      const { userInfo } = store.state;
      const type = userInfo.type;
      name.value = userInfo.name;
      role.value = type !== "ADMIN" ? "超级管理员" : "普通管理员";
      userInfoData.value = userInfo;

      getWeatherInfo();
      getStatisticsInfoHandle();
      getDoctorReserveTotalHandle();
      queryRechargeHistoryHandle();
      getSignUpHandle();
    });

    // 天气信息
    const getWeatherInfo = async () => {
      const res = await queryWeatherInfo();
      const {
        province,
        city,
        temperature,
        weather,
        winddirection,
        windpower,
        humidity,
      } = res;
      cityInfo.value = `${province}-${city}`;
      weatherInfo.value = {
        temperature,
        weather,
        winddirection,
        windpower,
        humidity,
      };
    };

    const getStatisticsInfoHandle = async () => {
      const res = await getStatisticsInfo();
      if (!res.success) {
        return;
      }
      statisticsInfo.value = res.data;
    };

    const queryRechargeHistoryHandle = async () => {
      const res = await queryRechargeHistory({ page: 1, pageSize: 10000000 });
      let allIncrease = 0;
      let allReduce = 0;
      if (!res.success) {
        return;
      }
      res.data.items.forEach((item) => {
        if (item.name === "成功充值") {
          allIncrease += item.price;
        } else if (item.name === "成功预约") {
          allReduce += item.price;
        }
      });
      options3.value.datasets[0].data = [allIncrease, -allReduce];
    };

    const getSignUpHandle = async () => {
      const res = await getSignUp();
      if (!res.success) {
        return;
      }
      const labelArr = [];
      const dataArr = [];
      res.data.forEach((item, index) => {
        const newIndex = Number(item.monthName.split("月")[0]);
        labelArr[newIndex - 1] = item.monthName;
        dataArr[newIndex - 1] = item.signUpTotal;
      });
      options2.value.labels = labelArr;
      options2.value.datasets[0].data = dataArr;
    };

    const getDoctorReserveTotalHandle = async () => {
      const res = await getDoctorReserveTotal();
      if (!res.success) {
        return;
      }
      reserveList.value = res.data;
    };

    const data = reactive([
      {
        name: "2018/09/04",
        value: 1083,
      },
      {
        name: "2018/09/05",
        value: 941,
      },
      {
        name: "2018/09/06",
        value: 1139,
      },
      {
        name: "2018/09/07",
        value: 816,
      },
      {
        name: "2018/09/08",
        value: 327,
      },
      {
        name: "2018/09/09",
        value: 228,
      },
      {
        name: "2018/09/10",
        value: 1065,
      },
    ]);
    const options = {
      type: "bar",
      title: {
        text: "最近一周各品类销售图",
      },
      xRorate: 25,
      labels: ["周一", "周二", "周三", "周四", "周五"],
      datasets: [
        {
          label: "家电",
          data: [234, 278, 270, 190, 230],
        },
        {
          label: "百货",
          data: [164, 178, 190, 135, 160],
        },
        {
          label: "食品",
          data: [144, 198, 150, 235, 120],
        },
      ],
    };

    const todoList = reactive([
      {
        title: "今天要修复100个bug",
        status: false,
      },
      {
        title: "今天要修复100个bug",
        status: false,
      },
      {
        title: "今天要写100行代码加几个bug吧",
        status: false,
      },
      {
        title: "今天要修复100个bug",
        status: false,
      },
      {
        title: "今天要修复100个bug",
        status: true,
      },
      {
        title: "今天要写100行代码加几个bug吧",
        status: true,
      },
    ]);

    return {
      userInfoData,
      name,
      data,
      options,
      options2,
      options3,
      todoList,
      role,
      cityInfo,
      weatherInfo,
      statisticsInfo,
      reserveList,
      colorArr,
      getStatisticsInfoHandle,
    };
  },
};
</script>

<style scoped>
.el-row {
  margin-bottom: 20px;
}

.grid-content {
  display: flex;
  align-items: center;
  height: 100px;
}

.grid-cont-right {
  flex: 1;
  text-align: center;
  font-size: 14px;
  color: #999;
}

.grid-num {
  font-size: 30px;
  font-weight: bold;
}

.grid-con-icon {
  font-size: 50px;
  width: 100px;
  height: 100px;
  text-align: center;
  line-height: 100px;
  color: #fff;
}

.grid-con-1 .grid-con-icon {
  background: rgb(45, 140, 240);
}

.grid-con-1 .grid-num {
  color: rgb(45, 140, 240);
}

.grid-con-2 .grid-con-icon {
  background: rgb(100, 213, 114);
}

.grid-con-2 .grid-num {
  color: rgb(45, 140, 240);
}

.grid-con-3 .grid-con-icon {
  background: rgb(242, 94, 67);
}

.grid-con-3 .grid-num {
  color: rgb(242, 94, 67);
}

.user-info {
  display: flex;
  align-items: center;
  padding-bottom: 20px;
  border-bottom: 2px solid #ccc;
  margin-bottom: 20px;
}

.user-avator {
  width: 120px;
  height: 120px;
  border-radius: 50%;
}

.user-info-cont {
  padding-left: 50px;
  flex: 1;
  font-size: 14px;
  color: #999;
}

.user-info-cont div:first-child {
  font-size: 30px;
  color: #222;
}

.user-info-list {
  display: flex;
  font-size: 14px;
  color: #999;
  line-height: 25px;
}

.user-info-list span {
  margin-left: 70px;
}
.user-info-list-item {
  display: flex;
}
.user-info-list-item span {
  margin-left: 8px;
}

.mgb20 {
  margin-bottom: 20px;
}

.todo-item {
  font-size: 14px;
}

.todo-item-del {
  text-decoration: line-through;
  color: #999;
}

.schart {
  width: 100%;
  height: 300px;
}
</style>
