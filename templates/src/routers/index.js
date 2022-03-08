import { Hooks } from './hooks';
import CRoutesManager from './routes.dynamic';
import FNScrollBehavior from './scroll-behavior';

// const scrollBehavior = FNScrollBehavior;

export const Routes = new CRoutesManager();
export const Router = Routes.router;

Router.beforeEach(Hooks.beforeEach);
Router.afterEach(Hooks.afterEach);
Router.onError((error, to, form) => {
	if (error.message.match(/(Failed to load module script|Failed to fetch dynamically imported module)/g)) {
		location.reload(true);
	}
});