import './assets/css/global.scss';
import "@wya/vc/lib/vc.min.css";

import { createApp } from 'vue';
import { createRouter } from 'vue-router';
import * as WYA_VC from '@wya/vc';
import { Global, Vc } from './globals';

import App from './app.vue';
import { history, Hooks, RoutesManager, scrollBehavior } from './routers';

let app = createApp(App);

// 全局信息
app.use(Global);

// 路由
const routesManager = new RoutesManager();
let router = createRouter({
	history,
	routes: routesManager.routes,
});
router.beforeEach(Hooks.beforeEach);
router.afterEach(Hooks.afterEach);
app.use(router);

// VC配置
app.use(WYA_VC, Vc.configure());

app.mount('#app');

window.app = app;