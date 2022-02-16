import * as WYA_VC from '@wya/vc';

export class Vc {
	static configure = (options) => {
		const { Global, Network, Router } = options;
		return {
			Portal: {
				install(app) {
					app.config.globalProperties.$request = Network.request;
					app.config.globalProperties.$global = Global;
					app.config.globalProperties.$router = Router;
					
					app.use(WYA_VC);
				}
			}
		};
	}
}