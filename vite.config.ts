import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import VueMacros from 'unplugin-vue-macros/vite'
import { defineConfig } from 'vite'
import { transformShortVmodel } from '@vue-macros/short-vmodel'

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [
		VueMacros({
			plugins: {
				vue: vue({
					reactivityTransform: true,
					template: {
						compilerOptions: {
							nodeTransforms: [
								transformShortVmodel({
									prefix: '$',
								}),
							],
						},
					},
				}),
			},
		}),
		AutoImport({
			imports: [
				'vue',
				'vue/macros',
				'vue-router',
				'@vueuse/head',
				'@vueuse/core',
			],
			dirs: ['src/composables'],
			dts: 'src/auto-imports.d.ts',
		}),
		Components({
			dts: './src/components.d.ts',
		}),
	],

	// Vite options tailored for Tauri development and only applied in `tauri dev` or `tauri build`
	// prevent vite from obscuring rust errors
	clearScreen: false,
	// tauri expects a fixed port, fail if that port is not available
	server: {
		port: 1420,
		strictPort: true,
	},
	// to make use of `TAURI_DEBUG` and other env variables
	// https://tauri.studio/v1/api/config#buildconfig.beforedevcommand
	envPrefix: ['VITE_', 'TAURI_'],
	build: {
		// Tauri supports es2021
		target: process.env.TAURI_PLATFORM == 'windows' ? 'chrome105' : 'safari13',
		// don't minify for debug builds
		minify: !process.env.TAURI_DEBUG ? 'esbuild' : false,
		// produce sourcemaps for debug builds
		sourcemap: !!process.env.TAURI_DEBUG,
	},
})
