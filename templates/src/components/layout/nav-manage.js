import { Global } from '@globals/index';
import { tplNavConfig } from "@modules/tpl/index";

class NavManage {
	constructor() {
		// 变量名由模板内部生成，不要随意改动
		this.INITIAL_NAV_DATA = [tplNavConfig];
		this.navTreeData = [];
		this.navTreeFlatted = [];
	}

	update() {
		const { navTreeData, navTreeFlatted } = this.parserNavData(this.INITIAL_NAV_DATA);
		this.navTreeData = navTreeData;
		this.navTreeFlatted = navTreeFlatted;
	}

	// 过滤没有权限的导航，拍平导航树
	parserNavData(data) {
		const initialData = { navTreeData: [], navTreeFlatted: [] };
		return data.reduce((pre, cur) => {
			const { auth, children, ...rest } = cur;
			const hasChildren = children && children.length > 0;
			const show = Global.hasAuth(auth);
			if (!show) return pre;
			let obj = { ...rest };
			if (hasChildren) {
				const res = this.parserNavData(children);
				obj.children = res.navTreeData;
				pre.navTreeFlatted.push(...res.navTreeFlatted);
			} else {
				pre.navTreeFlatted.push(cur);
			}
			pre.navTreeData.push(obj);
			return pre;
		}, initialData);
	}
}

export default new NavManage();