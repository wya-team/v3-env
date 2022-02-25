import { Hooks } from './hooks';
import CRoutesManager from './routes.dynamic';
import FNScrollBehavior from './scroll-behavior';

// const scrollBehavior = FNScrollBehavior;

export const Routes = new CRoutesManager();
export const Router = Routes.router;

Router.beforeEach(Hooks.beforeEach);
Router.afterEach(Hooks.afterEach);
