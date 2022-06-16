import { createRouter, createWebHistory } from 'vue-router';
import { VcInstance } from '@wya/vc';

import navManage from '@components/layout/nav-manage';
import Layout from '@components/layout/layout.vue';
import Left from '@components/layout/left.vue';
import Top from '@components/layout/top.vue';
import { Global } from '@globals/index';
import { basicRoutes, layoutRoutes, dynamicRoutes } from './routes.js';
import { stringifyQuery } from './utils';

class RoutesManager {
	constructor() {
		this.basicRoutes = basicRoutes || {};
		this.layoutRoutes = layoutRoutes || [];
		this.dynamicRoutes = dynamicRoutes || [];

		this.history = createWebHistory('/');
		this.router = createRouter({
			history: this.history,
			routes: [],
			// 源码在这里会对query中特殊字符进行兑换，像空格 -> '+'
			stringifyQuery
		});

		this.clearRoutes = [];

		this.reset();
	}

	/**
	 * 一开始没有登录，路由只有/login，登录之后，动态添加
	 */
	reset() {
		VcInstance.clear();
		// 更新导航
		navManage.update();
		this.navRoutes = navManage.navTreeData.value;

		// 重新获得有权限的路由
		this.clearRoutes.forEach(fn => fn());

		const children = Global.isLoggedIn()
			? this.generateRoutes([...this.layoutRoutes, ...this.dynamicRoutes])
			: this.generateRoutes(this.layoutRoutes);

		const rootRoute = {
			path: '/',
			component: Layout,
			redirect: children[0]?.path || '/other/not-found',
			children
		};

		this.clearRoutes = [rootRoute, ...this.basicRoutes]
			.map(route => this.router.addRoute(route));
	}

	/**
	 * 生成所有路由
	 * @param {*} routeRecords
	 */
	 generateRoutes(routeRecords) {
		const navRoutes = this.generateNavRoutes();
		// 筛选出有权限的路由, 这里用的同一个方法
		const routes = routeRecords.filter((route) => Global.hasAuth(route.auth));

		return [...navRoutes, ...routes].map((route) => this.rebuildRoute(route));
	}

	/**
	 * 生成导航关联的路由
	 */
	generateNavRoutes() {
		const navRoutes = [];
		const flatten = (routes) => {
			routes.forEach((route) => {
				navRoutes.push({
					...route,
					redirect: this.getNavRouteRedirect(route)
				});
				if (route.children) {
					flatten(route.children);
				}
			});
		};
		flatten(this.navRoutes);
		return navRoutes;
	}

	/**
	 * 解析得到单个导航路由的重定向路由
	 * @param {*} routeRecord
	 */
	getNavRouteRedirect(routeRecord) {
		// 可自定义重定向地址，默认取第一个子级路由
		return routeRecord.redirect || routeRecord.children?.[0]?.path;
	}

	rebuildRoute(route) {
		return !route.components || route.redirect
			? route
			: {
				...route,
				meta: {
					title: route.title,
					...route.meta,
				},
				components: (() => {
					const { components } = route;
					const comps = { default: components[0] };
					if (components.includes('left')) comps.left = Left;
					if (components.includes('top')) comps.top = Top;
					return comps;
				})()
			};
	}
}
export default RoutesManager;
