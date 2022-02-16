import './assets/css/global.scss';
import "@wya/vc/lib/vc.min.css";

import { createApp } from 'vue';
import * as WYA_VC from '@wya/vc';
import * as WYA_VCC from '@wya/vcc';
import { Global, Network, Vc, Vcc } from './globals';
import { Router } from './routers';

import App from './app.vue';

const app = createApp(App);
const options = {
	Global,
	Network,
	Router
};

// 全局信息
app.use(Global, options);
app.use(Router);

// VC配置
app.use(WYA_VC, Vc.configure(options));
app.use(WYA_VCC, Vcc.configure(options));

app.mount('#app');

window.app = app;