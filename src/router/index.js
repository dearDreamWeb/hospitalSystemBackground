import { createRouter, createWebHashHistory } from "vue-router";
import Home from "../views/Home.vue";

const routes = [
    {
        path: '/',
        redirect: '/dashboard'
    }, {
        path: "/",
        name: "Home",
        component: Home,
        children: [
            {
                path: "/dashboard",
                name: "dashboard",
                meta: {
                    title: '系统首页'
                },
                component: () => import( /* webpackChunkName: "dashboard" */ "../views/Dashboard.vue")
            }, {
                path: "/doctors",
                name: "doctors",
                meta: {
                    title: '医生管理'
                },
                component: () => import( /* webpackChunkName: "table" */ "../views/Doctors.vue")
            }, {
                path: "/departmentIndex",
                name: "departmentIndex",
                meta: {
                    title: '科室管理'
                },
                component: () => import( /* webpackChunkName: "table" */ "../views/DepartmentIndex.vue")
            }, {
                path: "/news",
                name: "news",
                meta: {
                    title: '新闻管理'
                },
                component: () => import( /* webpackChunkName: "table" */ "../views/News.vue")
            }, {
                path: "/admin",
                name: "admin",
                meta: {
                    title: '管理员管理'
                },
                component: () => import( /* webpackChunkName: "table" */ "../views/Admin.vue")
            }, {
                path: "/adminUser",
                name: "adminUser",
                meta: {
                    title: '用户管理'
                },
                component: () => import( /* webpackChunkName: "table" */ "../views/AdminUser.vue")
            },
            {
                path: "/appointment",
                name: "appointment",
                meta: {
                    title: '预约管理'
                },
                component: () => import( /* webpackChunkName: "table" */ "../views/Appointment.vue")
            }, {
                path: "/rechargeHistory",
                name: "rechargeHistory",
                meta: {
                    title: '消费记录'
                },
                component: () => import( /* webpackChunkName: "table" */ "../views/RechargeHistory.vue")
            },  {
                path: "/comment",
                name: "comment",
                meta: {
                    title: '评论管理'
                },
                component: () => import( /* webpackChunkName: "table" */ "../views/Comment.vue")
            },  {
                path: "/logs",
                name: "logs",
                meta: {
                    title: '日志记录'
                },
                component: () => import( /* webpackChunkName: "table" */ "../views/Logs.vue")
            }, {
                path: "/charts",
                name: "basecharts",
                meta: {
                    title: '图表'
                },
                component: () => import( /* webpackChunkName: "charts" */ "../views/BaseCharts.vue")
            }, {
                path: "/icon",
                name: "icon",
                meta: {
                    title: '自定义图标'
                },
                component: () => import( /* webpackChunkName: "icon" */ "../views/Icon.vue")
            }, {
                path: '/404',
                name: '404',
                meta: {
                    title: '找不到页面'
                },
                component: () => import(/* webpackChunkName: "404" */ '../views/404.vue')
            }, {
                path: '/user',
                name: 'user',
                meta: {
                    title: '个人中心'
                },
                component: () => import(/* webpackChunkName: "user" */ '../views/User.vue')
            }
        ]
    }, {
        path: "/login",
        name: "Login",
        meta: {
            title: '登录'
        },
        component: () => import( /* webpackChunkName: "login" */ "../views/Login.vue")
    }
];

const router = createRouter({
    history: createWebHashHistory(),
    routes
});

router.beforeEach((to, from, next) => {
    document.title = `${to.meta.title} | vue-manage-system`;
    const role = localStorage.getItem('token');
    if (!role && to.path !== '/login') {
        next('/login');
    } else if (to.meta.permission) {
        // 如果是管理员权限则可进入，这里只是简单的模拟管理员权限而已
        role === 'admin'
            ? next()
            : next('/403');
    } else {
        next();
    }
});

export default router;