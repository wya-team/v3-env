import './assets/css/global.scss';
import "@wya/vc/lib/vc.min.css";

import { createApp } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';
import * as WYA_VC from '@wya/vc';
import { Global, Vc } from './globals';

import App from './app.vue';
import { routes, Hooks } from './routers';

let history = createWebHistory('/');
let router = createRouter({
	history,
	routes
});
router.beforeEach(Hooks.beforeEach);
router.afterEach(Hooks.afterEach);
let app = createApp(App);
app.use(Global);
app.use(router);
app.use(WYA_VC, Vc.configure());

app.mount('#app');

window.app = app;