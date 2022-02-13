import { loginConfig } from '../modules/login';
import { tplConfig } from '../modules/tpl';

export const routes = [
	{
		path: '/',
		redirect: () => {
			return '/tpl/main';
		}
	},
	...loginConfig,
	...tplConfig
];

