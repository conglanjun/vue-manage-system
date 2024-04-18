import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import VueSetupExtend from 'vite-plugin-vue-setup-extend';
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers';
export default defineConfig({
	base: './',
	plugins: [
		vue(),
		VueSetupExtend(),
		AutoImport({
			resolvers: [ElementPlusResolver()]
		}),
		Components({
			resolvers: [ElementPlusResolver()]
		})
	],
	optimizeDeps: {
		include: ['schart.js']
	},
	resolve: {
		alias: {
			'@': '/src',
			'~': '/src/assets'
		}
	},
	define: {
		__VUE_PROD_HYDRATION_MISMATCH_DETAILS__: "true",
	},
	server: {
		host: "localhost",
		cors: true,
		port: 5173,
		open: false, //自动打开
		proxy: {
		  // 这里的ccc可乱写, 是拼接在url后面的地址 如果接口中没有统一的后缀可自定义
		  // 如果有统一后缀, 如api, 直接写api即可, 也不用rewrite了
		  "/api": {
			target: "http://localhost:8080", // 真实接口地址, 后端给的基地址
			changeOrigin: true, // 允许跨域
			rewrite: (path) => path.replace(/^\/ccc/, "/api"), // 将ccc替换为空
		  },
		},
	  },
});
