import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import installElementPlus from './plugins/element'
import ElementPlus from 'element-plus'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import './assets/css/icon.css'
const app = createApp(App)
installElementPlus(app)
app
    .use(ElementPlus, {
        locale: zhCn,
    })
    .use(store)
    .use(router)
    .mount('#app')