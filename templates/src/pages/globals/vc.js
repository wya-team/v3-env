import { Global } from './global';
import { Network } from './network';

export class Vc {
	static configure = () => ({
		Portal: {
			globalProperties: {
				$global: Global,
				$request: Network
			}
		}
	})
}