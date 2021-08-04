import { resolve } from 'path';

export const createAlias = (target) => {
	return Object.keys(target).map((alia) => {
		return {
			find: new RegExp(alia),
			replacement: resolve(__dirname, '../..', target[alia]),
		};
	});
};
