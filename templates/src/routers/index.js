import { createRouter } from 'vue-router';
import { history } from './routes';
import { Hooks } from './hooks';
import CRoutesManager from './routes.dynamic';
import FNScrollBehavior from './scroll-behavior';

// const scrollBehavior = FNScrollBehavior;

export const Routes = new CRoutesManager();
// 路由
export const Router = createRouter({
	history,
	routes: Routes.defaults,
});

Router.beforeEach(Hooks.beforeEach);
Router.afterEach(Hooks.afterEach);
