import { resolve } from 'path';

/**
 * TODO: __dirname 不是当前文件夹，原因未知
 */
export const createAlias = (target) => {
	return Object.keys(target).map((alia) => {
		return {
			find: new RegExp(alia),
			replacement: resolve(__dirname, '.', target[alia]),
		};
	});
};
