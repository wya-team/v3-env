import { ref } from 'vue';
import { Global } from '@globals/index';
import { tplNavConfig } from "@modules/tpl/index";

class NavManage {
	constructor() {
		// 变量名由模板内部生成，不要随意改动
		this.INITIAL_NAV_DATA = [tplNavConfig];
		this.navTreeData = ref([]);
		this.navTreeFlatted = ref([]);
	}

	update() {
		const { navTreeData, navTreeFlatted } = this.parseNavTree(this.INITIAL_NAV_DATA);
		this.navTreeData.value = navTreeData;
		this.navTreeFlatted.value = navTreeFlatted;
	}

	// 过滤没有权限的导航，拍平导航树
	parseNavTree(navRecords) {
		// 代理模块查找缓存
		const proxyCache = {};
		// 导航层级深度
		let navigationDepth = 1;

		const parse = (modules, parent = null, shadowParent = null) => {
			const initialData = { navTreeData: [], navTreeFlatted: [] };
			return modules.reduce((pre, cur) => {
				const { auth, children, proxy, ...config } = cur;
				if (!Global.hasAuth(auth)) return pre;

				let realModule;
				// 如果配置了同级导航代理，则 realModule 应为代理模块
				if (proxy) {
					realModule = proxyCache[proxy];
					if (!realModule) {
						realModule = modules.find(module => module.path === proxy);
						// 更新查找缓存
						proxyCache[proxy] = realModule;
					}
					config.proxy = realModule;
					config.shadow = true;
				}

				// 父级导航
				config.parent = parent;
				// 幽灵父导航，不作为导航菜单，但是存在模块归属关系
				config.shadowParent = shadowParent;
				config.meta = config.meta || {};
				// 导航层级标识
				config.meta.navigation = navigationDepth;
				// 路由激活时需隐藏的导航层级，比如 hiddenNavigations = [2] 则表示隐藏二级导航
				config.meta.hiddenNavigations = config.meta.hiddenNavigations || [];

				pre.navTreeFlatted.push(config);
				if (children && children.length > 0) {
					if (!realModule) {
						realModule = config;
					}

					navigationDepth++;
					// realModule 作为子级的 parent
					const res = parse(children, realModule, config.shadow ? config : null);
					navigationDepth--;

					config.children = res.navTreeData;
					pre.navTreeFlatted.push(...res.navTreeFlatted);
				}
				pre.navTreeData.push(config);
				return pre;
			}, initialData);
		};

		return parse(navRecords);
	}
}

export default new NavManage();
