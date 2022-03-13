import vue from '@vitejs/plugin-vue';
import { defineConfig, loadEnv } from 'vite'

export default defineConfig(({ command, mode }) => {
    //检查process.cwd()路径下.env.development.local、.env.development、.env.local、.env这四个环境文件
    loadEnv(mode, process.cwd());
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