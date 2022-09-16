export const tplNavConfig = {
	path: '/tpl',
	name: 'tpl',
	title: '模板',
	icon: '',
	auth: true,
	children: [{
		path: '/tpl/home/main', 
		name: 'tpl-home-main',
		title: '首页',
		auth: true,
		components: [
			() => import('./home-main/index.vue'),
			'left',
			'top'
		]
	}, {
		path: '/tpl/test/main', 
		name: 'tpl-test-main',
		title: '其他',
		auth: true,
		components: [
			() => import('./home-main/index.vue'),
			'left',
			'top'
		]
	}, {
		path: '/tpl/paging/form',
		name: 'tpl-paging-form',
		title: '表单',
		components: [
			() => import('./paging-form/index.vue'),
			'left',
			'top'
		]
	}, {
		path: '/tpl/paging/basic',
		name: 'tpl-paging-basic',
		title: '分页',
		components: [
			() => import('./paging-basic/index.vue'),
			'left',
			'top'
		]
	}, {
		path: '/tpl/paging/tabs',
		name: 'tpl-paging-tabs',
		title: '选项卡分页',
		components: [
			() => import('./paging-tabs/index.vue'),
			'left',
			'top'
		]
	}]
};

export const tplConfig = [
	
];
