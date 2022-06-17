/**
 * 用于判断一个路由的 path 是否处于激活状态
 * 路由/a/b/c激活的条件：
 * 	1. 相对路由为 /a/b/c （完全匹配）
 * 	2. 相对路由为 /a/b/c/d （子级）
 * @param {*} targetRoutePath 目标路由 path
 * @param {*} relativeRoutePath 相对路由 path
 * @returns boolean
 */
export const isActiveRoute = (targetRoutePath, relativeRoutePath) => {
	return new RegExp(`${targetRoutePath}(/{1}.*)?$`).test(relativeRoutePath);
};

/**
 * 解析得到给定路由 path 的祖先路由 path
 * 如：
 * 解析一级 getParentRoutePath('/shop/product/main/editor', 1) -> '/shop'
 * 解析二级 getParentRoutePath('/shop/product/main/editor', 2) -> '/shop/product'
 * 解析三级 getParentRoutePath('/shop/product/main/editor', 3) -> '/shop/product/main'
 * @param {*} path
 * @param {*} level
 * @returns
 */
export const getParentRoutePath = (path, level = 1) => {
	const result = path.match(new RegExp(`((?:/[a-z]+[a-z0-9-]*){${level}})(?:/[a-z]+[a-z0-9-])+`));
	return result && result[1];
};
