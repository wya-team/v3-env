import fs from 'fs-extra';
import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';

import { resolvePackage, isDev } from './build/utils';
import { createAlias, createPlugins } from './build/vite';

const TIMESTAMP = new Date().getTime();

export default (options) => {
	const ENV_IS_DEV = isDev(options.mode);

	return defineConfig({
		/**
		 * base: 同webpack {output.publicPath}, prod下可以是cdn
		 * publicDir: 同webpack copy文件夹内的静态资源
		 */
		base: ENV_IS_DEV ? '/' : '/',
		publicDir: 'src/static',

		resolve: {
			alias: createAlias({
				'@assets': './src/assets'
			})
		},

		plugins: createPlugins(options),

		/**
		 * https://cn.vitejs.dev/guide/features.html#css
		 */
		css: {
			preprocessorOptions: {
				scss: {
					additionalData: resolvePackage("@wya/sass/lib/mixins/bem.scss", { read: true }),
				}
			}
		},

		build: {
			outDir: 'dist',
			assetsDir: `static.${TIMESTAMP}`
		}
	});
};
