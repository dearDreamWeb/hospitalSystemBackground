<template>
  <div class="sidebar">
    <el-menu
      class="sidebar-el-menu"
      :default-active="onRoutes"
      :collapse="collapse"
      background-color="rgba(255,255,255,0.5)"
      text-color="#3c3c3c"
      active-text-color="#20a0ff"
      unique-opened
      router
    >
      <template v-for="item in items">
        <template v-if="item.subs">
          <el-submenu :index="item.index" :key="item.index">
            <template #title>
              <i :class="item.icon"></i>
              <span>{{ item.title }}</span>
            </template>
            <template v-for="subItem in item.subs">
              <el-submenu
                v-if="subItem.subs"
                :index="subItem.index"
                :key="subItem.index"
              >
                <template #title>{{ subItem.title }}</template>
                <el-menu-item
                  v-for="(threeItem, i) in subItem.subs"
                  :key="i"
                  :index="threeItem.index"
                >
                  {{ threeItem.title }}</el-menu-item
                >
              </el-submenu>
              <el-menu-item v-else :index="subItem.index" :key="subItem.index"
                >{{ subItem.title }}
              </el-menu-item>
            </template>
          </el-submenu>
        </template>
        <template v-else>
          <el-menu-item :index="item.index" :key="item.index">
            <i :class="item.icon"></i>
            <template #title>{{ item.title }}</template>
          </el-menu-item>
        </template>
      </template>
    </el-menu>
  </div>
</template>

<script>
import { computed, onMounted, ref } from "vue";
import { useStore } from "vuex";
import { useRoute } from "vue-router";
export default {
  setup() {
    const data = [
      {
        icon: "el-icon-lx-home",
        index: "/dashboard",
        title: "系统首页",
      },
      {
        icon: "el-icon-lx-group",
        index: "/doctors",
        title: "医生管理",
      },
      {
        icon: "el-icon-lx-cascades",
        index: "/departmentIndex",
        title: "科室管理",
      },
      {
        icon: "el-icon-lx-attention",
        index: "/news",
        title: "新闻管理",
      },
      {
        icon: "el-icon-lx-people",
        index: "/adminUser",
        title: "用户管理",
      },
      {
        icon: "el-icon-lx-crown",
        index: "/appointment",
        title: "预约管理",
      },
      {
        icon: "el-icon-lx-crown",
        index: "/rechargeHistory",
        title: "消费记录",
      },
      {
        icon: "el-icon-lx-crown",
        index: "/admin",
        title: "管理员管理",
      },
      {
        icon: "el-icon-lx-emoji",
        index: "/icon",
        title: "自定义图标",
      },
      {
        icon: "el-icon-pie-chart",
        index: "/charts",
        title: "schart图表",
      },
    ];
    const items = ref(data);
    const route = useRoute();
    const store = useStore();
    const collapse = computed(() => store.state.collapse);

    onMounted(() => {
      const { userInfo } = store.state;
      if (userInfo.type !== "SUPPER_ADMIN") {
        items.value = items.value.filter((item) => item.index !== "/admin");
      }
    });

    const onRoutes = computed(() => {
      return route.path;
    });

    return {
      items,
      onRoutes,
      collapse,
    };
  },
};
</script>

<style scoped>
.sidebar {
  display: block;
  position: absolute;
  left: 0;
  top: 70px;
  bottom: 0;
  overflow-y: scroll;
}
.sidebar::-webkit-scrollbar {
  width: 0;
}
.sidebar-el-menu:not(.el-menu--collapse) {
  width: 250px;
}
.sidebar > ul {
  height: 100%;
}
</style>
