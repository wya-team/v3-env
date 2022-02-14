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
		path: "/tpl/paging",
		name: "tpl-paging",
		title: "",
		children: [{
			path: '/tpl/paging/form',
			name: 'tpl-paging-form',
			title: '',
			components: [
				() => import('./paging-form/index.vue'),
				'left',
				'top'
			]
		}]
	}]
};

export const tplConfig = [
	
];