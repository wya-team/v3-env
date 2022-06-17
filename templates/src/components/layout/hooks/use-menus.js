import { computed } from 'vue';
import { useRoute } from 'vue-router';
import navManage from '../nav-manage';
import { getParentRoutePath } from '../utils';

export const useMenus = () => {
	const route = useRoute();

	const activeChain = computed(() => {
		const stack = [];
		// 当前路由对应的最后一级导航路由
		// 如果当前路由本身是导航路由，则将其本身作为最后一级导航路由向上找
		// 否则说明当前路由是超过 3 级的路由，则查找当前路由对应的的三级导航路由（对应为 route.meta.parentPath）
		const theLastOnePath = route.meta.navigation > 0
			? route.path
			// 可配置对应路由的 route.meta.parentPath 属性来自定义归属的三级导航 path，默认通过当前 path 截取识别
			: route.meta.parentPath || getParentRoutePath(route.path, 3);

		let chunk = navManage.navTreeFlatted.value.find(it => it.path === theLastOnePath);
		while (chunk) {
			stack.unshift(chunk);
			chunk = chunk.parent;
		}

		return stack;
	});

	return {
		activeChain
	};
};
