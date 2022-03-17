import { cloneDeep } from 'lodash';
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
		this.navRoutes = navManage.navTreeFlatted || [];

		// 重新获得有权限的路由
		this.clearRoutes.forEach(fn => fn());
		let routes = cloneDeep(this.basicRoutes);
		let children = Global.isLoggedIn() ? this.getRoutes() : this.getRoutes(this.layoutRoutes);
		let redirect = (children[0] || {}).path || '/other/not-found';

		routes.push({
			path: '/',
			component: Layout,
			redirect,
			children
		});

		this.clearRoutes = routes.map(i => {
			return this.router.addRoute(i);
		});
	}

	getRoutes(targetRoutes) {
		let allRoutes = cloneDeep(targetRoutes || [...this.layoutRoutes, ...this.dynamicRoutes]);

		// 筛选出有权限的路由
		let authRoutes = allRoutes.filter((route) => Global.hasAuth(route.auth));
		// navRoutes已经过滤一遍，不需要在过滤
		if (!targetRoutes) {
			const layoutLength = this.layoutRoutes;
			authRoutes.splice(layoutLength, 0, ...this.navRoutes);
		}

		let temp = [];
		let routes = authRoutes.reduce((pre, route) => {
			/**
			 * 路由配置中如果没有设置component or components,即代表没有页面，不返回，
			 * 让后面的其他路由来生成对应的redirect
			 */
			if (!route.component && !route.components) return pre;
			// 一、二级路由url如果页面，则不做redirect
			if (route.path.split('/').length < 4 && !route.redirect) {
				temp.push(route.path);
			}
			let redirect = this.getRedirect(route.path);
			
			if (redirect) {
				redirect.forEach((path) => {
					if (!temp.includes(path)) {
						temp.push(path);
						pre.push({
							path,
							redirect: route.path
						});
					}
				});
			}

			pre.push(this.rebuildRoute(route));
			return pre;
		}, []);

		return routes;
	}

	getRedirect(path) {
		let pathArr = path.split('/');
		let redirect;
		switch (pathArr.length) {
			case 4: // 三级导航
				redirect = [
					`/${pathArr[1]}`,
					`/${pathArr[1]}/${pathArr[2]}`
				];
				break;
			case 3: // 二级导航
				redirect = [
					`/${pathArr[1]}`
				];
				break;
			default: 
				break;
		}

		return redirect;
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
				// 不能接收false了
				components: (() => {
					const comps = { default: route.components[0] };
					if (route.components.includes('left')) comps.left = Left;
					if (route.components.includes('top')) comps.top = Top;
					return comps;
				})()
			};
	}
}
export default RoutesManager;
