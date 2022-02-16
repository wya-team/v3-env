import { createWebHistory } from 'vue-router';
import { loginConfig } from '../modules/login';
import { tplConfig } from '../modules/tpl';

export const history = createWebHistory('/');
export const basicRoutes = [
	...loginConfig,
	{
		path: '/:pathMatch(.*)*',
		redirect: (to) => {
			return '/login';
		}
	}
];

// 开放式路由（未登录），但可以共享Layout组件
export const layoutRoutes = [];

// 权限路由（已登录），根据权限动态注入路由
export const dynamicRoutes = [
	...tplConfig
];