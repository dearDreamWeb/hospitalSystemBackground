import vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vite'

export default defineConfig(() => {
    //返回vite配置
    return {
        base: './',
        plugins: [vue()],
        optimizeDeps: {
            include: ['schart.js']
        },
        define: {
            'process.env': {}
        },
        server: {
            port: 1289
        }
    }
}) 