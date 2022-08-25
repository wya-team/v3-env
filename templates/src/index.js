import './assets/css/global.scss';
import "@wya/vc/lib/vc.min.css";

import { createApp } from 'vue';
import * as WYA_VC from '@wya/vc';
import * as WYA_VCC from '@wya/vcc';
import { Global, Network, Vc, Vcc } from './globals';
import { Router, Routes } from './routers';

import App from './app.vue';

const app = createApp(App);
const options = {
	Global,
	Network,
	Router,
	Routes
};

// 全局信息
app.use(Global, options);
app.use(Router);

// VC配置
app.use(WYA_VC, Vc.configure(options));
app.use(WYA_VCC, Vcc.configure(options));

app.mount('#app');

window.app = app;

Router.onError((error, to, form) => {
	if (
		process.env.NODE_ENV !== 'development'
		&& error.message.match(/(Failed to load module script|Failed to fetch dynamically imported module)/g)
	) {
		location.reload(true);
	}
});
window.addEventListener('unhandledrejection', (e) => {
	if (e.reason) {
		console.warn(`UNHANDLED PROMISE REJECTION`, e.reason);
	}

	e.preventDefault();
});
